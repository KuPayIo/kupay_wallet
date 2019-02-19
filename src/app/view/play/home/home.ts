/**
 * play home 
 */
 // ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { loadDir } from '../../../../pi/widget/util';
import { Widget } from '../../../../pi/widget/widget';
import { getStore, register } from '../../../store/memstore';
import { getCurrentEthAddr, getUserInfo, hasWallet, popNewMessage } from '../../../utils/tools';

import { WebViewManager } from '../../../../pi/browser/webview';
import { getEthApiBaseUrl } from '../../../core/config';
import { manualReconnect } from '../../../net/login';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    
    public ok: () => void;
    public language:any;
    public defaultInjectPromise:Promise<string>;
    public web3Promise: Promise<string>;
    public thirdApiPromise:Promise<string>;
    
    constructor() {
        super();
        this.web3Promise = new Promise((resolve) => {
            const path = 'app/core/thirdparty/web3_rpc.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                // for (let i = 0; i < arr.length; ++i) {
                //     content += String.fromCharCode(arr[i]);
                // }
                // content = decodeURIComponent(escape(atob(content)));
                const content = new TextDecoder().decode(arr);
                resolve(content);
            }, () => {}, () => {});
        });

        this.thirdApiPromise = new Promise((resolve) => {
            const path = 'app/api/thirdApi.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
                const content = new TextDecoder().decode(arr);
                resolve(content);
            }, () => {}, () => {});
        });
    }
    
    public setProps(props:Json) {
        this.props = {
            ...props,
            isLogin:getStore('user/isLogin'),
            reconnecting:false   
        };
        super.setProps(this.props);
        this.language = this.config.value[getLang()];
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
            this.props.refresh = false;
        }
        // http://fishing.rinkeby.cchaingames.com/
        // http://47.244.59.13/web-rinkeby/index.html
        this.props.gameList = [
            {
                title:{ zh_Hans:'fomosports',zh_Hant:'fomosports',en:'' },
                desc:{ zh_Hans:'要买要快，不要只是看',zh_Hant:'要買要快，不要只是看',en:'' },
                img:['app/res/image1/fomosports.jpg','app/res/image1/fomosports1.jpg'],
                url:'https://test.fomosports.me/'
            },
            {
                title:{ zh_Hans:'Crypto Fishing',zh_Hant:'Crypto Fishing',en:'' },
                desc:{ zh_Hans:'新一代区块链游戏',zh_Hant:'新一代區塊鏈遊戲',en:'' },
                img:['app/res/image1/CryptoFishing.jpg','app/res/image1/CryptoFishing1.jpg'],
                url:'http://fishing.rinkeby.cchaingames.com/'
            }
            // {
            //     title:'Decentraland',
            //     desc:{ zh_Hans:'Decentraland与Ethaemon合作',zh_Hant:'Decentraland與Ethaemon合作',en:'' },
            //     img:['app/res/image1/game4.jpg','app/res/image1/game4.jpg'],
            //     url:''
            // }
        ];
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
        popNew('app-view-mine-home-home');
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
        if (!this.props.gameList[num].url) {
            popNewMessage(this.language.tips);
        } else {
            const gameTitle = this.props.gameList[num].title.zh_Hans;
            const gameUrl =   this.props.gameList[num].url;
            const defaultInjectText = `
            window.piWeb3EthDefaultAccount = '${getCurrentEthAddr()}';
            window.piWeb3ProviderNetWork = '${getEthApiBaseUrl()}';
            window.piGameName = '${gameTitle}';
            `;
            this.defaultInjectPromise = Promise.resolve(defaultInjectText);

            const allPromise = Promise.all([this.defaultInjectPromise,this.web3Promise]);
            allPromise.then(([defaultInjectContent,web3Content]) => {
                const content = defaultInjectContent + web3Content;
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
        popNew(this.props.activityList[index].url);
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

    public updateLoginState(isLogin:boolean) {
        this.props.isLogin = isLogin;
        this.props.reconnecting = false;
        this.paint();
    }
    /**
     * 断线重连
     */
    public reConnect() {
        if (this.props.reconnecting) return;
        console.log('reconnect');
        this.props.reconnecting = true;   // 正在连接
        this.paint();
        manualReconnect();
    }
}
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

register('user/isLogin',(isLogin:boolean) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.updateLoginState(isLogin);
});