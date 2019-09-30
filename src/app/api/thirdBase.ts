import { getStore as chatGetStore, register as chatRegister, unregister as chatUnregister } from '../../chat/client/app/data/store';
import { applyToGroup, getChatUid } from '../../chat/client/app/net/rpc';
import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { logoutWallet } from '../net/login';
import { loadDir1 } from '../utils/commonjsTools';
import { getGameItem } from '../view/play/home/gameConfig';
import { getPi3Config } from './pi3Config';

/**
 * 第三方应用调用的基础功能
 * 
 */

// 悬浮框
let popFloatBoxClose;

// 当前打开的webviewName
let curWebviewName;

// 退出钱包后关闭悬浮框和游戏
logoutWallet(() => {
    closePopFloatBox();
    if (curWebviewName) {
        closeWebview(curWebviewName);
        curWebviewName = undefined;
    }
});

export const closePopFloatBox = () => {
    popFloatBoxClose && popFloatBoxClose.callback(popFloatBoxClose.widget);
    popFloatBoxClose = undefined ;
};

 /**
  * 关闭打开的webview
  */
export const closeWebview = (webviewName: string) => {
    console.log('wallet closeWebview called');
    WebViewManager.close(webviewName);
};

/**
 * 最小化webview
 */
export const minWebview = (payload:{webviewName: string;popFloatBox:boolean}) => {
    console.log('wallet minWebview called');
    const webviewName = payload.webviewName;
    const popFloatBox = payload.popFloatBox;
    if (popFloatBox) {
        popFloatBoxClose = popNew('app-components-floatBox-floatBox',{ webviewName });
    }
};

/**
 * 最小化webview
 */
export const minWebview1 = (webviewName: string) => {
    console.log('wallet minWebview called');
    curWebviewName = webviewName;
    WebViewManager.minWebView(webviewName);
};

/**
 * 邀请好友
 */
export const inviteFriends = (webviewName: string) => {
    console.log('wallet inviteFriends called');
    const gameItem = getGameItem(webviewName);
    popNew('earn-client-app-view-activity-inviteFriend',{
        bgImg:gameItem.img[2],
        shareUrl:gameItem.apkDownloadUrl,
        okCB:() => {
            WebViewManager.open(webviewName, `${gameItem.url}?${Math.random()}`, webviewName,'');
        }
    });
};

/**
 * 游戏客服
 */
export const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    if (!chatGetStore('uid') || !chatGetStore('isLogin')) {
        const isLoginCb = (uid:number) => {
            gotoGameService1(webviewName);
            chatUnregister('uid',isLoginCb);
        };
        chatRegister('uid',isLoginCb);
    } else {
        gotoGameService1(webviewName);
    }
};

const gotoGameService1 = (webviewName: string) => {
    const item = getGameItem(webviewName);
    getChatUid(item.accId).then((r) => {
        popNew('chat-client-app-view-chat-chat',{ id: r,chatType: GENERATOR_TYPE.USER,okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        } });
    });
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    if (!chatGetStore('uid') || !chatGetStore('isLogin')) {
        const isLoginCb = (uid:number) => {
            gotoOfficialGroupChat1(webviewName);
            chatUnregister('uid',isLoginCb);
        };
        chatRegister('uid',isLoginCb);
    } else {
        gotoOfficialGroupChat1(webviewName);
    }
};

const gotoOfficialGroupChat1 = (webviewName: string) => {
    const item = getGameItem(webviewName);
    applyToGroup(item.groupId).then((r) => {
        console.log(' applyToGroup success');
        popNew('chat-client-app-view-chat-chat',{ id: r, chatType: GENERATOR_TYPE.GROUP,okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        } });
    });
};

/**
 * 打开一个新的webview
 */
export const openNewWebview = (payload:{ webviewName: string;url:string;args:Object}) => {
    const gameItem = getGameItem(payload.webviewName);
    const pi3Config:any = getPi3Config();
    pi3Config.appid = gameItem.appid;
    pi3Config.gameName = gameItem.title.zh_Hans;
    pi3Config.webviewName = payload.webviewName;
    pi3Config.buttonMod = gameItem.buttonMod;
    pi3Config.apkDownloadUrl = gameItem.apkDownloadUrl;
    pi3Config.fromWallet = true;

    // tslint:disable-next-line:variable-name
    const pi_sdk = {
        config:pi3Config
    };
    const pi3ConfigStr = `
        window.pi_sdk = ${JSON.stringify(pi_sdk)};
    `;
    const configPromise = Promise.resolve(pi3ConfigStr);
    if (gameItem.usePi) {
        configPromise.then((configContent) => {
            const search = [];
            if (typeof payload.args === 'object') {
                for (const k in payload.args) {
                    search.push(`${k}=${payload.args[k]}`);
                }
            }
            const gameUrl = `${payload.url}?${search.join('&')}`;
            WebViewManager.open(payload.webviewName, gameUrl, pi3Config.gameName, configContent);
        });
    } else {
        const injectStartPromise = new Promise((resolve) => {
            const path = 'app/api/injectStart.js.txt';
            loadDir1([path], fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                resolve(content);
            });
        });
        const injectEndPromise = new Promise((resolve) => {
            const path = 'app/api/injectEnd.js.txt';
            loadDir1([path], fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                resolve(content);
            });
        });

        const piSdkPromise = new Promise((resolve) => {
            const sdkToolsPath = 'app/pi_sdk/sdkTools.js';
            const sdkApiPath = 'app/pi_sdk/sdkApi.js';
            const sdkMainPath = 'app/pi_sdk/sdkMain.js';
            loadDir1([sdkToolsPath,sdkApiPath,sdkMainPath], fileMap => {
                // tslint:disable-next-line:max-line-length
                const arrs = [new Uint8Array(fileMap[sdkToolsPath]),new Uint8Array(fileMap[sdkApiPath]),new Uint8Array(fileMap[sdkMainPath])];
                const content = new TextDecoder().decode(arrs[0]) + new TextDecoder().decode(arrs[1]) + new TextDecoder().decode(arrs[2]);
                resolve(content);
            });
        });
        const allPromise = Promise.all([injectStartPromise,configPromise,piSdkPromise,injectEndPromise]);
        WebViewManager.close(payload.webviewName);
        allPromise.then(([injectStartContent,configContent,piSdkContent,injectEndContent]) => {
            const content =  injectStartContent + configContent + piSdkContent + injectEndContent;
            const search = [];
            if (typeof payload.args === 'object') {
                for (const k in payload.args) {
                    search.push(`${k}=${payload.args[k]}`);
                }
            }
            const gameUrl = `${payload.url}?${search.join('&')}`;
            WebViewManager.open(payload.webviewName, gameUrl, pi3Config.gameName, content);
        });
    }
};