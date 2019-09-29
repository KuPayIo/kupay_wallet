import { createThirdApiStyleTag, createThirdBaseStyle } from './sdkTools';
import { createSignInPage, createSignInStyle } from './signIn';

/**
 * pi sdk 入口文件
 */
declare var pi_modules;

let webviewManagerPath;   // pi库webview文件路径
// tslint:disable-next-line:variable-name
let pi_RPC_Method:Function;     // rpc调用

// tslint:disable-next-line:variable-name
const pi_sdk:any = (<any>window).pi_sdk || {};         // pi sdk

// tslint:disable-next-line:variable-name
const pi_jsApi:any = pi_sdk.api;      // api

// tslint:disable-next-line:variable-name
const pi_store:any = pi_sdk.store || {       // store
    freeSecret:false                         // 是否开启免密支付
};   

// tslint:disable-next-line:variable-name
const pi_config:any = pi_sdk.config || {};  // 配置信息

/**
 * button id定义
 */
enum ButtonId {
    INVITEFRIENDS = 'pi-invite',                 // 邀请好友
    GAMESSERVICE = 'pi-service',                 // 游戏客服
    OFFICIALGROUPCHAT = 'pi-official-chat',      // 官方群聊
    RECHARGE = 'pi-recharg',                     // 充值
    FREESECRET = 'pi-free-secret',               // 免密支付
    MINWINDOW = 'pi-min-window',                 // 最小化
    EXITGAME = 'pi-exit-game'                    // 退出游戏
}

/**
 * 提供的button
 */
const showButtons = [{
    id:ButtonId.INVITEFRIENDS,
    img:'wx.png',
    text:'邀请好友',
    show:true,
    clickedClose:true,
    clickCb:() => {
        console.log('click 邀请好友');
        pi_RPC_Method(pi_config.jsApi, 'inviteFriends', pi_config.webviewName,  (error, result) => {
            console.log('inviteFriends call success');
        });
    }
},{
    id:ButtonId.GAMESSERVICE,
    img:'game_customer_service.png',
    text:'游戏客服',
    show:true,
    clickedClose:true,
    clickCb:() => {
        console.log('click 游戏客服');
        pi_RPC_Method(pi_config.jsApi, 'gotoGameService', pi_config.webviewName,  (error, result) => {
            console.log('gotoGameService call success');
        });
    }
},{
    id:ButtonId.OFFICIALGROUPCHAT,
    img:'official_group_chat.png',
    text:'官方群聊',
    show:true,
    clickedClose:true,
    clickCb:() => {
        console.log('click 官方群聊');
        pi_RPC_Method(pi_config.jsApi, 'gotoOfficialGroupChat', pi_config.webviewName,  (error, result) => {
            console.log('gotoOfficialGroupChat call success');
        });
    }
},{
    id:ButtonId.RECHARGE,
    img:'recharg.png',
    text:'去充值',
    show:true,
    clickedClose:true,
    clickCb:() => {
        console.log('click 去充值');
        pi_RPC_Method(pi_config.jsApi, 'gotoRecharge', pi_config.webviewName,  (error, result) => {
            console.log('inviteFriends call success');
        });
    }
},{
    id:ButtonId.FREESECRET,
    startImg:'free_secret_close.png',
    closeImg:'free_secret_start.png',
    text:'打开免密',
    startText:'关闭免密',
    closeText:'打开免密支付',
    show:false,
    clickedClose:false,
    clickCb:() => {
        console.log('click 免密支付');
        pi_jsApi.setFreeSecrectPay(!pi_store.freeSecret);
    }
},{
    id:ButtonId.MINWINDOW,
    img:'min_window.png',
    text:'最小化',
    show:true,
    clickedClose:true,
    clickCb:() => {
        console.log('click 最小化');
        pi_RPC_Method(pi_config.jsApi, 'minWebview', { webviewName:pi_config.webviewName,popFloatBox:true },  (error, result) => {
            console.log('minWebview call success');
        });
    }
},{
    id:ButtonId.EXITGAME,
    img:'exit_game.png',
    text:'退出游戏',
    show:true,
    clickedClose:true,
    clickCb:() => {
        console.log('click 退出游戏');
        pi_RPC_Method(pi_config.jsApi, 'closeWebview', pi_config.webviewName, (error, result) => {
            console.log('closeWebview call success');
        });
    }
}];

/**
 * @param timeMS: 超时时间
 * @param autoInfo：JSON对象
 * @param callback(err, initData) 接口回调
 * @description autoInfo 结构
 *                  {
 *                      "webViewName" = "testWebView"
 *                  }
 * @description initData 结构
 *                  {
 *                      "code" = 0
 *                      "autoToken" = "HA1284HWADry98"
 *                  }
 */
const pi_service = {
    hasCallBind: false,
    callBackListen: undefined,

    bind: function(timeMS, autoInfo, callback) {
        let start = 0;
        const step = 100;
        
        if (this.hasCallBind) {
            callback({
                code: -1,
                reason: 'this webview has already bind'
            });
            return;
        }

        this.hasCallBind = true;
        this.serviceCallBackListen = callback;
        const handler = function () {
            if (!this.hasCallBind) {
                callback({
                    code: -2,
                    reason: 'unbind'
                });
                return;
            }

            start += step;
            if (start > timeMS) {
                callback({
                    code: -3,
                    reason: 'timeout'
                });
                return;
            }
            if (this.callBackListen) {
                window.JSBridge.webViewBindService(JSON.stringify(autoInfo));
                setTimeout(handler, step);
            }
        };

        setTimeout(handler, step);
    },
    unbind: function(webViewName) {
        if (!this.hasCallBind) return;
        this.hasCallBind = false;
        window.JSBridge.unWebViewBindService(webViewName);
    },
    onBindService: function(err, initData) {
        this.callBackListen && this.callBackListen(err, JSON.parse(initData));
        this.callBackListen = undefined;
    }
};

/**
 * 设置webviewManager路径
 */
const setWebviewManager = (path:string) => {
    webviewManagerPath = path;
    console.log('setWebviewManager path = ',path);
    pi_sdk.pi_RPC_Method = pi_RPC_Method = (moduleName:string, methodName:string, param:any, callback:Function) => {
        const exs = pi_modules[webviewManagerPath].exports;
        if (!exs || !exs.WebViewManager || ! exs.WebViewManager.rpc) throw new Error('can\'t find WebViewManager');
        const rpcData = {
            moduleName,  // 模块名
            methodName,  // 方法名
            params:[param,callback]        // 参数组成的数组，参数可以有回调函数
        };
        exs.WebViewManager.rpc('default',rpcData);
    };
};

/**
 * 初始化
 */
const piSdkInit = (cb:any) => {
    createThirdBaseStyle();
    createThirdApiStyleTag();
    pi_service.bind(2000, { webviewName: pi_config.webviewName }, cb);
    // buttonModInit()();
    // getFreeSecret();
};

pi_config.ButtonId = ButtonId;
pi_config.showButtons = showButtons;
pi_config.webviewName = 'fairyChivalry';
pi_config.isHorizontal = false;
pi_config.appid = '103';
pi_config.jsApi = 'app/remote/JSAPI';
pi_config.imgUrlPre = 'http://192.168.31.226/wallet/app/res/image/third/';

pi_sdk.setWebviewManager = setWebviewManager;
pi_sdk.piSdkInit = piSdkInit;
pi_sdk.config = pi_config;
pi_sdk.store = pi_store;
pi_sdk.piService = pi_service;

(<any>window).pi_sdk = pi_sdk; 