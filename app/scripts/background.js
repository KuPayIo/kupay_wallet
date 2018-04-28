const urlUtil = require('url')//进行url解析类似于path模块
const endOfStream = require('end-of-stream')//对stream的操作
const pump = require('pump')//pump is a small node module that pipes streams together and destroys all of them if one of them closes.
const log = require('loglevel')//Minimal lightweight simple logging for JavaScript
const extension = require('extensionizer')//A module for writing cross-browser extensions提供了跨浏览器的插件编写接口
const LocalStorageStore = require('obs-store/lib/localStorage')//ObservableStore is a synchronous in-memory store for a single value, that you can subscribe to updates on.用来管理内存的？
const storeTransform = require('obs-store/lib/transform')
const asStream = require('obs-store/lib/asStream')
const ExtensionPlatform = require('./platforms/extension')//打开关闭窗口+浏览器信息
const Migrator = require('./lib/migrator/')
const migrations = require('./migrations/')//似乎只是用来返回版本数据的
const PortStream = require('./lib/port-stream.js')//端口相关的stream
const NotificationManager = require('./lib/notification-manager.js')//打开和关闭通知页面
const MetamaskController = require('./metamask-controller')
const firstTimeState = require('./first-time-state')

const STORAGE_KEY = 'metamask-config'
const METAMASK_DEBUG = 'GULP_METAMASK_DEBUG'

window.log = log
log.setDefaultLevel(METAMASK_DEBUG ? 'debug' : 'warn')

const platform = new ExtensionPlatform()
const notificationManager = new NotificationManager()
global.METAMASK_NOTIFIER = notificationManager

let popupIsOpen = false

// state persistence
const diskStore = new LocalStorageStore({ storageKey: STORAGE_KEY })

// initialization flow
initialize().catch(log.error)

async function initialize () {
  const initState = await loadStateFromPersistence()
  debugger;
  await setupController(initState)
  log.debug('MetaMask initialization complete.')
}

//
// State and Persistence
//
//从localstorage里面取一些基本信息
async function loadStateFromPersistence () {
  // migrations
  const migrator = new Migrator({ migrations })
  // read from disk
  let versionedData = diskStore.getState() || migrator.generateInitialState(firstTimeState)
  // migrate data
  versionedData = await migrator.migrateData(versionedData)
  // write to disk
  diskStore.putState(versionedData)
  // return just the data
  return versionedData.data
}

function setupController (initState) {
  //
  // MetaMask Controller
  //

  const controller = new MetamaskController({
    // User confirmation callbacks:
    showUnconfirmedMessage: triggerUi,
    unlockAccountMessage: triggerUi,
    showUnapprovedTx: triggerUi,
    // initial state
    initState,
    // platform specific api
    platform,
  })
  global.metamaskController = controller

  // setup state persistence
  pump(
    asStream(controller.store),
    storeTransform(versionifyData),
    asStream(diskStore)
  )

  function versionifyData (state) {
    const versionedData = diskStore.getState()
    versionedData.data = state
    return versionedData
  }

  //
  // connect to other contexts
  //
  //background是被动和popup通讯的，实在popup或者notification主动申请之后，bg才会通过dnode和其建立链接
  extension.runtime.onConnect.addListener(connectRemote)
  function connectRemote (remotePort) {
    const isMetaMaskInternalProcess = remotePort.name === 'popup' || remotePort.name === 'notification'
    const portStream = new PortStream(remotePort)
    if (isMetaMaskInternalProcess) {
      // communication with popup
      popupIsOpen = popupIsOpen || (remotePort.name === 'popup')
      controller.setupTrustedCommunication(portStream, 'MetaMask')//直接返回了所有可供调用的api
      // record popup as closed
      if (remotePort.name === 'popup') {
        endOfStream(portStream, () => {
          popupIsOpen = false
        })
      }
    } else {
      // communication with page
      const originDomain = urlUtil.parse(remotePort.sender.url).hostname
      controller.setupUntrustedCommunication(portStream, originDomain)
    }
  }

  //
  // User Interface setup
  //

  updateBadge()
  controller.txController.on('update:badge', updateBadge)
  controller.messageManager.on('updateBadge', updateBadge)
  controller.personalMessageManager.on('updateBadge', updateBadge)

  // plugin badge text
  function updateBadge () {
    var label = ''
    var unapprovedTxCount = controller.txController.getUnapprovedTxCount()
    var unapprovedMsgCount = controller.messageManager.unapprovedMsgCount
    var unapprovedPersonalMsgs = controller.personalMessageManager.unapprovedPersonalMsgCount
    var unapprovedTypedMsgs = controller.typedMessageManager.unapprovedTypedMessagesCount
    var count = unapprovedTxCount + unapprovedMsgCount + unapprovedPersonalMsgs + unapprovedTypedMsgs
    if (count) {
      label = String(count)
    }
    extension.browserAction.setBadgeText({ text: label })
    extension.browserAction.setBadgeBackgroundColor({ color: '#506F8B' })
  }

  return Promise.resolve()
}

//
// Etc...
//

// popup trigger
function triggerUi () {
  if (!popupIsOpen) notificationManager.showPopup()
}

// On first install, open a window to MetaMask website to how-it-works.
extension.runtime.onInstalled.addListener(function (details) {
  if ((details.reason === 'install') && (!METAMASK_DEBUG)) {
    extension.tabs.create({url: 'https://metamask.io/#how-it-works'})
  }
})
