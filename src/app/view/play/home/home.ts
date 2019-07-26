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
import { callGetCurrentAddrInfo, callGetEthApiBaseUrl,callGetInviteCode, getStoreData } from '../../../middleLayer/wrap';
import { LuckyMoneyType } from '../../../publicLib/interface';
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
    public thirdApiDependPromise:Promise<string>;
    public thirdApiPromise:Promise<string>;
    
    constructor() {
        super();
        this.thirdApiPromise = new Promise((resolve) => {
            const path = 'app/api/thirdApi.js.txt';
            loadDir([path,'app/api/JSAPI.js'], undefined, undefined, undefined, fileMap => {
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
            loadDir([path,'app/api/thirdBase.js'], undefined, undefined, undefined, fileMap => {
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
            ...props,
            offlienType:OfflienType.WALLET
        };
        super.setProps(this.props);
        console.log(props);
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
            const gameTitle = gameList[num].title.zh_Hans;
            const gameUrl =   gameList[num].url;
            const webviewName = gameList[num].webviewName;
            // tslint:disable-next-line:max-line-length
            const [addrInfo,baseUrl,inviteCodeInfo] = await Promise.all([callGetCurrentAddrInfo('ETH'),callGetEthApiBaseUrl(),callGetInviteCode()]);
            const inviteCode = `${LuckyMoneyType.Invite}${inviteCodeInfo.cid}`; 
            const pi3Config:any = getPi3Config();
            pi3Config.web3EthDefaultAccount = addrInfo.addr;
            pi3Config.web3ProviderNetWork = baseUrl;
            pi3Config.appid = gameList[num].appid;
            pi3Config.gameName = gameTitle;
            pi3Config.webviewName = webviewName;
            pi3Config.apkDownloadUrl = gameList[num].apkDownloadUrl;
            pi3Config.userInfo = {
                nickName:this.props.nickName,
                inviteCode
            };

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
        popNew3(this.props.activityList[index].url);
    }

    /**
     * 默认进入游戏
     */
    public defaultEnterGame() {
        // TODO  暂时屏蔽默认进入游戏
        return;
        const firstEnterGame = localStorage.getItem('firstEnterGame');   // 第一次直接进入游戏，以后如果绑定了手机则进入
        Promise.all([getStoreData('user/isLogin')]).then(([isLogin]) => {
            const phoneNumber = this.props.userInfo.phoneNumber;    
            console.log(`firstEnterGame = ${firstEnterGame},phoneNumber = ${phoneNumber}`);
            if (!firstEnterGame || phoneNumber) {
                if (!isLogin  || !this.props.isActive || hasEnterGame) {
                    console.log('defaultEnterGame failed');
        
                    return;
                } else {
                    console.log('defaultEnterGame success');
                    this.gameClick(0);
                    localStorage.setItem('firstEnterGame','true');
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
    },0);
});