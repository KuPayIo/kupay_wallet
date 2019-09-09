 // ================================ 导入
import { WebViewManager, screenMode } from '../../../../pi/browser/webview';
import { Json } from '../../../../pi/lang/type';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { loadDir } from '../../../../pi/widget/util';
import { Widget } from '../../../../pi/widget/widget';
import { getPi3Config } from '../../../api/pi3Config';
import { closePopFloatBox } from '../../../api/thirdBase';
import { OfflienType } from '../../../components1/offlineTip/offlineTip';
import { getStore, register } from '../../../store/memstore';
import { getUserInfo, hasWallet, popNew3, popNewMessage, setPopPhoneTips } from '../../../utils/tools';
import { activityList, gameList } from './gameConfig';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

/**
 * play home 
 */
export class PlayHome extends Widget {
    public ok: () => void;
    public configPromise:Promise<string>;
    public piSdkPromise:Promise<string>;
    public injectStartPromise:Promise<string>;
    public injectEndPromise:Promise<string>;
    
    constructor() {
        super();
        this.injectStartPromise = new Promise((resolve) => {
            const path = 'app/api/injectStart.js.txt';
            loadDir([path,'app/api/JSAPI.js','app/api/thirdBase.js'], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                resolve(content);
            }, () => {
                //
            }, () => {
                //
            });
        });
        this.injectEndPromise = new Promise((resolve) => {
            const path = 'app/api/injectEnd.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                console.timeEnd('loginMod thirdApiDependPromise');
                resolve(content);
            }, () => {
                //
            }, () => {
                //
            });
        });

        this.piSdkPromise = new Promise((resolve) => {
            const sdkToolsPath = 'app/pi_sdk/sdkTools.js';
            const sdkApiPath = 'app/pi_sdk/sdkApi.js';
            const sdkMainPath = 'app/pi_sdk/sdkMain.js';
            loadDir([sdkToolsPath,sdkApiPath,sdkMainPath], undefined, undefined, undefined, fileMap => {
                // tslint:disable-next-line:max-line-length
                const arrs = [new Uint8Array(fileMap[sdkToolsPath]),new Uint8Array(fileMap[sdkApiPath]),new Uint8Array(fileMap[sdkMainPath])];
                const content = new TextDecoder().decode(arrs[0]) + new TextDecoder().decode(arrs[1]) + new TextDecoder().decode(arrs[2]);
                resolve(content);
            }, () => {
                //
            }, () => {
                //
            });
        });

    }
    
    public setProps(props:Json) {
        this.props = {
            ...props,
            offlienType:OfflienType.WALLET
        };
        super.setProps(this.props);
        console.log(props);
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.avatar = userInfo.avatar;
            this.props.refresh = false;
        }
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
    public gameClick(num:number) {
        closePopFloatBox();
        if (!getStore('user/id')) return;
        if (!getStore('user/isLogin')) {
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
            const screen = gameItem.screenMode;
            const pi3Config:any = getPi3Config();
            pi3Config.appid = gameItem.appid;
            pi3Config.gameName = gameTitle;
            pi3Config.webviewName = webviewName;
            pi3Config.fromWallet = true;
            pi3Config.isHorizontal = screen === screenMode.landscape;  // 是否横屏
            
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
                    if (gameUrl.indexOf('http') >= 0) {
                        WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, configContent, screen);
                    } else {
                        WebViewManager.open(webviewName, `${gameUrl}`, gameTitle, configContent, screen);
                    }
                });
            } else {
                const allPromise = Promise.all([this.injectStartPromise,this.configPromise,this.piSdkPromise,this.injectEndPromise]);
                allPromise.then(([injectStartContent,configContent,piSdkContent,injectEndContent]) => {
                    const content =  injectStartContent + configContent + piSdkContent + injectEndContent;
                    if (gameUrl.indexOf('http') >= 0) {
                        WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, content, screen);
                    } else {
                        WebViewManager.open(webviewName, `${gameUrl}`, gameTitle, content, screen);
                    }
                });
            }
        }
    }

    /**
     * 活动点击
     * @param index 序号
     */
    public activityClick(index:number) {
        if (!hasWallet()) return;
        popNew3(this.props.activityList[index].url);
    }

    /**
     * 默认进入游戏
     */
    public defaultEnterGame() {
        console.log(`getStore('user/isLogin') = ${getStore('user/isLogin')},isActive = ${this.props.isActive}`);
        const firstEnterGame = localStorage.getItem('firstEnterGame');   // 第一次直接进入游戏，以后如果绑定了手机则进入
        const phoneNumber = getUserInfo().phoneNumber;    
        console.log(`firstEnterGame = ${firstEnterGame},phoneNumber = ${phoneNumber}`);
        if (!firstEnterGame || phoneNumber) {
            if (!getStore('user/isLogin')  || !this.props.isActive || hasEnterGame) {
                console.log('defaultEnterGame failed');
    
                return;
            } else {
                console.log('defaultEnterGame success');
                this.gameClick(1);
                localStorage.setItem('firstEnterGame','true');
            }
        }
    }

}
let hasEnterGame = false;
// ========================================
register('user/info',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const userInfo = getUserInfo();
        if (userInfo) {
            w.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
        }
        w.paint();
    }
});

register('user/isLogin', (isLogin:boolean) => {
    setTimeout(() => {
        const w:any = forelet.getWidget(WIDGET_NAME);
        w && w.defaultEnterGame();
    },0);
});