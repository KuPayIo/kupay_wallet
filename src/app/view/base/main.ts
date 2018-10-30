/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { backCall, backList, popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { addWidget } from '../../../pi/widget/util';
import { openConnect } from '../../net/pull';
import { initPush } from '../../net/push';
import { registerFileStore } from '../../store/filestore';
import {
  CloudCurrencyType,
  CloudWallet,
  Currency2USDT,
  LockScreen,
  ShapeShiftTxs,
  Store
} from '../../store/interface';
import { getStore, initStore, setStore } from '../../store/memstore';
// import{getTransaction as Account, Transation, getTokenTransaction as Token, TokenTransations} from "../../../index/rpc_call.s";
// import { Client } from "../../../pi/net/mqtt_c";
// import { create } from "../../../pi/net/rpc";
// import { Struct } from "../../../pi/struct/struct_mgr";

// let client;
// let rpc;
// ============================== 导出
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
  // 设置开发环境
  // eth代币精度初始化
  // 数据检查
    checkUpdate();
  // 初始化数据
    initStore();
    registerFileStore();
  // 主动推送初始化
    initPush();
    openConnect();
  // dataCenter.init();
    popNew('app-view-base-app');
  // popNew('app-view-chat-home-home');
  // getDeviceInfo();
    popNewPage();
  // 后台切前台
    backToFront();
  // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 20);
};

// const rpcFunc = (req:Struct, respClass:Function, callback:Function, timeout: number) => {
//     rpc(req, (r:Struct) =>{
//         if(!respClass || r instanceof respClass){
//             return callback(r);
//         }else{
//             console.log("RPCError:-------------------------------------------", r);
//             //console.log("RPCError:" + "返回类型" + r.constructor.name + "与" + respClass.name + "类型不匹配！")
//         }
//     }, timeout);
// }
// export const test = () => {
//     var options = {
//         timeout: 3,
//         keepAliveInterval: 60,
//         cleanSession: false,
//         useSSL: false,
//         mqttVersion:3,
//         onSuccess: () => {
//             rpc = create(client, (<any>self).__mgr);
//             let q = new Account();
//             q.name = "0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0";
//             rpcFunc(q, Transation, (r: Transation) => {
//                 console.log("------------r", r);
//             },2000);

//             let q1 = new Token();
//             q1.contractAddress = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
//             q1.userAddress = "0x9c808cd59d94a07053658b00ea12d8e9cbbe8304";
//             rpcFunc(q1, TokenTransations, (r: TokenTransations) => {
//                 console.log("------------r", r);
//             },2000);
//         },
//         onFailure: () =>{
//             console.log("connect fail");
//         }
//     };
//     client = new Client("127.0.0.1", 1234, "clientId-wcd14PDgoZ", null, options);
// }
/**
 * 界面入口
 */
const popNewPage = () => {
    if (ifNeedUnlockScreen()) {
        popNew('app-components1-lockScreenPage-lockScreenPage', {
            openApp: true
        });
    }
};
const checkUpdate = () => {
  // todo
};

/**
 * 后台切换到前台
 * onBackPressed
 */
const backToFront = () => {
    (<any>window).handle_app_lifecycle_listener = (iType: string) => {
        if (iType === 'onAppResumed' && ifNeedUnlockScreen()) {
            popNew('app-components1-lockScreenPage-lockScreenPage', {
                openApp: true
            });
        } else if (iType === 'onBackPressed') {
            if (backList.length === 1) return;
            backCall();
      // (<any>window).onpopstate();
      // widget.ok && widget.ok();
        }
    };
};

// ============================== 立即执行

/**
 * 是否需要解锁屏幕
 */
const ifNeedUnlockScreen = () => {
    const unlockScreen = document.getElementById('keyboard');
    if (unlockScreen) return false;
    const ls: LockScreen = getStore('setting/lockScreen',{});
    const lockScreenPsw = ls.psw;
    const openLockScreen = ls.open !== false;

    return lockScreenPsw && openLockScreen;
};

// tslint:disable-next-line:max-func-body-length
const test = () => {
    const showCurrencys = [];

    const txHistory = [];
    for (let i = 0; i < 13000; i++) {
        showCurrencys.push(`BTC${i}`);
        const txHistoryItem = {
            hash:
        '0x1b6d7da7381c8bdde97964621fcb31a9981b0dd9bbd9c17cfde371f6040a5ba6',
            addr: '0x9b4a57542791402b3de48be1fa3fd4ffae6d4809',
            txType: 0,
            fromAddr: '0x9b4a57542791402b3de48be1fa3fd4ffae6d4809',
            toAddr: '0x9b4a57542791402b3de48be1fa3fd4ffae6d4809',
            pay: 10000,
            time: 1540533041374,
            status: 2,
            confirmedBlockNumber: 3,
            needConfirmedBlockNumber: 10,
            info: '123',
            currencyName: 'ETH',
            fee: 1000,
            nonce: 10,
            minerFeeLevel: 1
        };
        txHistory.push(txHistoryItem);
    }
    const addrs = [];
    for (let i = 0; i < 10; i++) {
        const addrInfo = {
            addr: '0x9b4a57542791402b3de48be1fa3fd4ffae6d4809',
            balance: 0,
            txHistory,
            nonce: 11
        };
        addrs.push(addrInfo);
    }

    const currencyRecords = [];
    for (let i = 0; i < 10; i++) {
        const currencyRecord = {
            currencyName: `BTC${i}`,
            currentAddr: '0x9b4a57542791402b3de48be1fa3fd4ffae6d4809',
            addrs,
            updateAddr: false
        };

        currencyRecords.push(currencyRecord);
    }

    const gasLimitMap = new Map<string, number>();
    const currency2USDTMap = new Map<string, Currency2USDT>();
    for (let i = 0; i < 10; i++) {
        gasLimitMap.set(`ETH${i}`, 1000000);
        currency2USDTMap.set(`ETH${i}`, { open: 1000, close: 5000 });
    }

    const store: Store = {
        user: {
            id: '123',
            isLogin: false,
            token: '123456789',
            conRandom: '123456789',
            publicKey: '123456789',
            salt: '123456789',
            secrectHash: '123456789',
            info: {
                nickName: 'yuqiang',
                avatar: 'yuqiang',
                phoneNumber: '12345678912',
                isRealUser: false
            }
        },
        wallet: {
            vault: JSON.stringify({
                a: '123456',
                b: '123456789',
                c: '123456789897'
            }),
            isBackup: false,
            showCurrencys,
            currencyRecords
        },
        cloud: {
            cloudWallets: new Map<CloudCurrencyType, CloudWallet>()
        },
        activity: {
            luckyMoney: null,
            mining: null,
            dividend: null,
            financialManagement: null
        },
        setting: {
            lockScreen: { psw: '12345678', open: false, locked: false },
            language: 'english',
            changeColor: 'red',
            currencyUnit: 'CNY'
        },
        third: {
            gasPrice: { 1: 10000000, 2: 20000000, 3: 3000000000 },
            btcMinerFee: { 1: 10000000, 2: 20000000, 3: 3000000000 },
            gasLimitMap,

      // shapeshift
            shapeShiftCoins: [],
            shapeShiftMarketInfo: null,
            shapeShiftTxsMap: new Map<string, ShapeShiftTxs>(),

            rate: 0,
            currency2USDTMap
        },
        flags: {}
    };
    console.log(store);
    setStore('user',store.user);
};
