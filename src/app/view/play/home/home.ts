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
import { thirdPay } from '../../../api/JSAPI';
import { getPi3Config } from '../../../api/pi3Config';
import { register } from '../../../store/memstore';
import { getUserInfo, hasWallet, popNew3, popNewMessage } from '../../../utils/tools';
import { gameList } from './gameConfig';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    
    public ok: () => void;
    public configPromise:Promise<string>;
    public web3Promise: Promise<string>;
    public thirdApiPromise:Promise<string>;
    public thirdApiDependPromise:Promise<string>;
    
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
        // http://fishing.rinkeby.cchaingames.com/
        // http://47.244.59.13/web-rinkeby/index.html
        // http://192.168.31.95/dst/boot/yineng/yineng.html?debug
        this.props.gameList = gameList;
        this.props.activityList = [
            {
                title:{ zh_Hans:'LOL赛事竞猜',zh_Hant:'LOL賽事競猜',en:'' },
                desc:{ zh_Hans:'2019LPL春季赛常规赛',zh_Hant:'2019LPL春季賽常規賽',en:'' },
                img:['app/res/image1/guess.png','app/res/image1/guess1.png'],
                url:'earn-client-app-view-guess-home'
            },
            {
                title:{ zh_Hans:'大转盘',zh_Hant:'大轉盤',en:'' },
                desc:{ zh_Hans:'看看今天的运气怎么样',zh_Hant:'看看今天的運氣怎麼樣',en:'' },
                img:['app/res/image1/turntable.png','app/res/image1/turntable1.png'],
                url:'earn-client-app-view-turntable-turntable'
            },
            {
                title:{ zh_Hans:'宝箱贩卖机',zh_Hant:'寶箱販賣機',en:'' },
                desc:{ zh_Hans:'是哪一个幸运的宝箱被选中呢？',zh_Hant:'是哪一個幸運的寶箱被選中呢？',en:'' },
                img:['app/res/image1/chest.png','app/res/image1/chest1.png'],
                url:'earn-client-app-view-openBox-openBox'
            },
            {
                title:{ zh_Hans:'兑换商城',zh_Hant:'兌換商城',en:'' },
                desc:{ zh_Hans:'不定期上新物品',zh_Hant:'不定期上新物品',en:'' },
                img:['app/res/image1/exchangeMall.png','app/res/image1/exchangeMall1.png'],
                url:'earn-client-app-view-exchange-exchange'
            }
        ];
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

    public gameClick(num:number) {
        if (!hasWallet()) return;
        if (!gameList[num].url) {
            const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
            popNewMessage(tips[getLang()]);
            
        } else {

            const gameTitle = gameList[num].title.zh_Hans;
            const gameUrl =   gameList[num].url;
            const pi3Config:any = getPi3Config();
            pi3Config.gameName = gameTitle;
            
            const pi3ConfigStr = `
                window.pi_config = ${JSON.stringify(pi3Config)}
                window.piGroupId = ${gameList[num].gid};
                window.piOfficialUser = ${gameList[num].uid}; 
            `;
            this.configPromise = Promise.resolve(pi3ConfigStr);

            const allPromise = Promise.all([this.configPromise,this.thirdApiDependPromise,this.thirdApiPromise]);
            allPromise.then(([configContent,thirdApiDependContent,thirdApiContent]) => {
                const content =  configContent + thirdApiDependContent + thirdApiContent;
                WebViewManager.open(gameTitle, `${gameUrl}?${Math.random()}`, gameTitle, content);
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
    public openTestClick() {
        const gameTitle = '测试';
        const gameUrl =  'http://192.168.9.15:3001/authorize.html';
        this.thirdApiPromise.then(content => {
            WebViewManager.open(gameTitle, `${gameUrl}?${Math.random()}`, gameTitle, content);
        });
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
