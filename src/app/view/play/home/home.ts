/**
 * play home 
 */
 // ================================ 导入
import { WebViewManager } from '../../../../pi/browser/webview';
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
export class PlayHome extends Widget {
    public ok: () => void;
    public configPromise:Promise<string>;
    public thirdApiDependPromise:Promise<string>;
    public thirdApiPromise:Promise<string>;
    
    constructor() {
        super();
        console.time('loginMod thirdApiPromise');
        console.time('loginMod thirdApiDependPromise');
        this.thirdApiPromise = new Promise((resolve) => {
            const path = 'app/api/thirdApi.js.txt';
            loadDir([path,'app/api/JSAPI.js'], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                console.timeEnd('loginMod thirdApiPromise');
                resolve(content);
            }, () => {
                //
            }, () => {
                //
            });
        });

        this.thirdApiDependPromise = new Promise((resolve) => {
            const path = 'app/api/thirdApiDepend.js.txt';
            loadDir([path,'app/api/thirdBase.js'], undefined, undefined, undefined, fileMap => {
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
            const gameTitle = gameList[num].title.zh_Hans;
            const gameUrl =   gameList[num].url;
            const webviewName = gameList[num].webviewName;
            const pi3Config:any = getPi3Config();
            pi3Config.appid = gameList[num].appid;
            pi3Config.gameName = gameTitle;
            pi3Config.webviewName = webviewName;
            
            const pi3ConfigStr = `
                window.pi_config = ${JSON.stringify(pi3Config)};
            `;
            this.configPromise = Promise.resolve(pi3ConfigStr);

            const allPromise = Promise.all([this.configPromise,this.thirdApiDependPromise,this.thirdApiPromise]);
            allPromise.then(([configContent,thirdApiDependContent,thirdApiContent]) => {
                const content =  configContent + thirdApiDependContent + thirdApiContent;
                WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, content);
            });
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
        return;
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