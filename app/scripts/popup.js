const injectCss = require('inject-css')//inject css into the head and return a function to delete
const MetaMaskUiCss = require('../../ui/css')
const startPopup = require('./popup-core')
const PortStream = require('./lib/port-stream.js')
const isPopupOrNotification = require('./lib/is-popup-or-notification')
const extension = require('extensionizer')//实现了通用浏览器插件标准https://developer.mozilla.org/en-US/Add-ons/WebExtensions
const ExtensionPlatform = require('./platforms/extension')
const NotificationManager = require('./lib/notification-manager')
const notificationManager = new NotificationManager()

// create platform global
global.platform = new ExtensionPlatform()

// inject css
const css = MetaMaskUiCss()
injectCss(css)

// identify window type (popup, notification)
const windowType = isPopupOrNotification()
global.METAMASK_UI_TYPE = windowType
closePopupIfOpen(windowType)//？没看懂具体关闭的是啥

// setup stream to background
//Establishes a connection from a content script to the main extension process, or from one extension to a different extension.
//似乎只实现了监听接口没有发送数据的接口
const extensionPort = extension.runtime.connect({ name: windowType })
const connectionStream = new PortStream(extensionPort)

// start ui
//完成了UI的初始化工作
//UI并不是及时显示，而是被callback触发的
const container = document.getElementById('app-content')
startPopup({ container, connectionStream }, (err, store) => {
  if (err) return displayCriticalError(err)
  store.subscribe(() => {
    const state = store.getState()
    //关闭notification
    if (state.appState.shouldClose) notificationManager.closePopup()
  })
})


function closePopupIfOpen (windowType) {
  if (windowType !== 'notification') {
    notificationManager.closePopup()
  }
}

function displayCriticalError (err) {
  container.innerHTML = '<div class="critical-error">The MetaMask app failed to load: please open and close MetaMask again to restart.</div>'
  container.style.height = '80px'
  log.error(err.stack)
  throw err
}
