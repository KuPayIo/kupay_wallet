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
import { register } from '../../../store/memstore';
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
    public web3Promise: Promise<string>;
    
    constructor() {
        super();
        this.web3Promise = new Promise((resolve) => {
            const path = 'app/core/thirdparty/web3_rpc.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                resolve(content);
            }, () => {
                //
            }, () => {
                //
            });
        });

        this.thirdApiPromise = new Promise((resolve) => {
            const path = 'app/api/thirdApi.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                resolve(content);
            }, () => {
                //
            }, () => {
                //
            });
        });

        this.thirdApiDependPromise = new Promise((resolve) => {
            const path = 'app/api/thirdApiDepend.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
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
            ...props
        };
        super.setProps(this.props);
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image/default_avater_big.png';
            this.props.refresh = false;
        }
        this.props.gameList = gameList;
        this.props.activityList = activityList;
        this.props.loaded = false;

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
        if (!hasWallet()) return;
        if (!gameList[num].url) {
            const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
            popNewMessage(tips[getLang()]);
        } else {
            setPopPhoneTips();
            
            const gameTitle = gameList[num].title.zh_Hans;
            const gameUrl =   gameList[num].url;
            const webviewName = gameList[num].webviewName;
            const pi3Config:any = getPi3Config();
            pi3Config.appid = gameList[num].appid;
            pi3Config.gameName = gameTitle;
            pi3Config.webviewName = webviewName;
            pi3Config.uid = gameList[num].uid;
            pi3Config.gid = gameList[num].gid;
            
            const pi3ConfigStr = `
                window.pi_config = ${JSON.stringify(pi3Config)}
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

    public payJump(e: any) {
        console.log();
        const gameTitle = '第三方';
        const gameUrl =  'http://192.168.7.71:50/';
        this.thirdApiPromise.then(content => {
            WebViewManager.open(gameTitle, `${gameUrl}?${Math.random()}`, gameTitle, content);
        });
    }

}

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
