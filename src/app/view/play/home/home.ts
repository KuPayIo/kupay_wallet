/**
 * play home 
 */
 // ================================ 导入
import { WebViewManager } from '../../../../pi/browser/webview';
import { Json } from '../../../../pi/lang/type';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getPi3Config } from '../../../api/pi3Config';
import { closePopFloatBox, setHasEnterGame } from '../../../api/thirdBase';
import { OfflienType } from '../../../components1/offlineTip/offlineTip';
import { callGetCurrentAddrInfo, callGetEthApiBaseUrl,callGetInviteCode, getStoreData } from '../../../middleLayer/wrap';
import { LuckyMoneyType } from '../../../publicLib/interface';
import { loadDir1 } from '../../../utils/commonjsTools';
import { popNew3, popNewMessage, setPopPhoneTips } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
import { activityList, gameList } from './gameConfig';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    public configPromise:Promise<string>;
    public piSdkPromise:Promise<string>;
    public injectStartPromise:Promise<string>;
    public injectEndPromise:Promise<string>;
    
    constructor() {
        super();
        setTimeout(() => {
            this.injectStartPromise = new Promise((resolve) => {
                const path = 'app/api/injectStart.js.txt';
                loadDir1([path,'app/api/thirdBase.js'], fileMap => {
                    const arr = new Uint8Array(fileMap[path]);
                    const content = new TextDecoder().decode(arr);
                    resolve(content);
                });
            });
        },0);
       
        setTimeout(() => {
            this.injectEndPromise = new Promise((resolve) => {
                const path = 'app/api/injectEnd.js.txt';
                loadDir1([path], fileMap => {
                    const arr = new Uint8Array(fileMap[path]);
                    const content = new TextDecoder().decode(arr);
                    console.timeEnd('loginMod thirdApiDependPromise');
                    resolve(content);
                });
            });
        },0);
       
        setTimeout(() => {
            this.piSdkPromise = new Promise((resolve) => {
                const sdkToolsPath = 'app/pi_sdk/sdkTools.js';
                const sdkApiPath = 'app/pi_sdk/sdkApi.js';
                const sdkMainPath = 'app/pi_sdk/sdkMain.js';
                loadDir1([sdkToolsPath,sdkApiPath,sdkMainPath], fileMap => {
                    // tslint:disable-next-line:max-line-length
                    const arrs = [new Uint8Array(fileMap[sdkToolsPath]),new Uint8Array(fileMap[sdkApiPath]),new Uint8Array(fileMap[sdkMainPath])];
                    // tslint:disable-next-line:max-line-length
                    const content = new TextDecoder().decode(arrs[0]) + new TextDecoder().decode(arrs[1]) + new TextDecoder().decode(arrs[2]);
                    resolve(content);
                });
            });
        },0);
        
    }
    
    public setProps(props:Json,oldProps:any) {
        this.props = {
            ...props,
            offlienType:OfflienType.WALLET
        };
        super.setProps(this.props);
        this.props.refresh = false;
        this.props.gameList = gameList;
        this.props.activityList = activityList;
        this.props.loaded = false;
    }

    public attach() {
        super.attach();
        this.defaultEnterGame();
    }
    /**
     * 刷新页面
     */
    public loaded() {
        // toDo 更新数据 完成之后将loaded变成true 刷新页面
        setTimeout(() => {
            console.log('加载数据完成');
            this.props.loaded = true;
            this.paint();

        },2000);

    }
    /**
     * 刷新页面前的准备
     */
    public beforeLoad() {
        console.log('通知刷新状态---');
        this.props.loaded = false;
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public getCode(event:any) {
        console.log(event.phone);
    }

    public modalBoxSure(e:any) {
        console.log(e.value);
    }

    public showMine() {
        popNew3('app-view-mine-home-home');
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.refresh = true;
        this.paint();
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);
    }

    /**
     * 搜索
     */
    public toSearch() {
        popNew3('app-view-play-searchGame');
    }

    /**
     * 点击游戏
     */
    public async gameClick(num:number) {
        closePopFloatBox();
        const id = await getStoreData('user/id');
        if (!id) return;
        // popNew3('earn-client-app-view-openBox-openBox');
        
        // return;
        const isLogin = await getStoreData('user/isLogin');
        if (!isLogin) {
            popNewMessage('登录中,请稍后再试');

            return;
        }
        if (!gameList[num].url) {
            const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
            popNewMessage(tips[getLang()]);
        } else {
            setPopPhoneTips();
            hasEnterGame = true;
            const gameItem = gameList[num];
            const gameTitle = gameItem.title.zh_Hans;
            const gameUrl =   gameItem.url;
            const webviewName = gameItem.webviewName;
            // tslint:disable-next-line:max-line-length
            const [addrInfo,baseUrl,inviteCodeInfo] = await Promise.all([callGetCurrentAddrInfo('ETH'),callGetEthApiBaseUrl(),callGetInviteCode()]);
            const inviteCode = `${LuckyMoneyType.Invite}${inviteCodeInfo.cid}`; 
            const pi3Config:any = getPi3Config();
            pi3Config.web3EthDefaultAccount = addrInfo.addr;
            pi3Config.web3ProviderNetWork = baseUrl;
            pi3Config.appid = gameItem.appid;
            pi3Config.buttonMod = gameItem.buttonMod;
            pi3Config.gameName = gameTitle;
            pi3Config.webviewName = webviewName;
            pi3Config.apkDownloadUrl = gameItem.apkDownloadUrl;
            pi3Config.fromWallet = true;
            pi3Config.userInfo = {
                nickName:this.props.userInfo.nickName,
                inviteCode
            };
            // tslint:disable-next-line:variable-name
            const pi_sdk = {
                config:pi3Config
            };
            const pi3ConfigStr = `
                window.pi_sdk = ${JSON.stringify(pi_sdk)};
            `;
            this.configPromise = Promise.resolve(pi3ConfigStr);
            if (gameItem.usePi) { // 有pi的项目
                this.configPromise.then(configContent => {
                    WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, configContent);
                });
            } else {
                const allPromise = Promise.all([this.injectStartPromise,this.configPromise,this.piSdkPromise,this.injectEndPromise]);
                allPromise.then(([injectStartContent,configContent,piSdkContent,injectEndContent]) => {
                    const content =  injectStartContent + configContent + piSdkContent + injectEndContent;
                    WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, content);
                });
            }
        }
    }

    /**
     * 活动点击
     * @param index 序号
     */
    public activityClick(index:number) {
        popNew3(this.props.activityList[index].url);
    }

    /**
     * 默认进入游戏
     */
    public defaultEnterGame() {
        return;
        const firstEnterGame = localStorage.getItem('firstEnterGame');   // 第一次直接进入游戏，以后如果绑定了手机则进入
        getStoreData('user/isLogin').then(isLogin => {
            const phoneNumber = this.props.userInfo.phoneNumber;    
            console.log(`firstEnterGame = ${firstEnterGame},phoneNumber = ${phoneNumber}`);
            if (!firstEnterGame || phoneNumber) {
                if (!isLogin  || !this.props.isActive || hasEnterGame) {
                    console.log('defaultEnterGame failed');
        
                    return;
                } else {
                    console.log('defaultEnterGame success');
                    localStorage.setItem('firstEnterGame','true');
                    this.gameClick(0);
                }
            }
        });
    }

}
let hasEnterGame = false;
// ========================================

registerStoreData('user/isLogin', (isLogin:boolean) => {
    setTimeout(() => {
        const w:any = forelet.getWidget(WIDGET_NAME);
        w && w.defaultEnterGame();   
    },400);
});