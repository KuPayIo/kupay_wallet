import { screenMode } from '../../../../pi/browser/webview';
import { shareDownload } from '../../../config';
import { getLocalStorage } from '../../../store/filestore';

/**
 * 第三方游戏相关配置
 */

 /**
  * 游戏列表
  * http://xzxd.cocolandgame.com/dst/boot/yineng/yineng.html
  * http://192.168.35.202/dst/boot/yineng/yineng.html?debug
  http://gcydzm.17youx.cn:9888/client/boot/index.html
  http://cgcydzm.17youx.cn/client/boot/haohai.html
  */
export const gameList = [
    {
        usePi:true,
        title:{ zh_Hans:'一代掌门',zh_Hant:'一代掌门',en:'' },
        desc:{ zh_Hans:'一代掌门',zh_Hant:'一代掌门',en:'' },
        img:['app/res/image1/bg_open.jpg','app/res/image1/fairyChivalry.jpg','app/res/image1/fairyChivalry.jpg'],
        url:'http://cgcydzm.17youx.cn/client/boot/haohai.html',
        apkDownloadUrl:shareDownload,
        webviewName:'fairyChivalry',
        appid:'103',
        screenMode:screenMode.landscape // 横竖屏
    }
    // { // http://192.168.31.10:3003/index.html
    //     usePi:true,
    //     title:{ zh_Hans:'书城',zh_Hant:'书城',en:'' },
    //     desc:{ zh_Hans:'书城',zh_Hant:'书城',en:'' },
    //     img:['app/res/image1/fairyChivalry1.jpg','app/res/image1/fairyChivalry.jpg','app/res/image1/fairyChivalry.jpg'],
    //     url: 'http://192.168.31.226/wallet/app/boot/index.html',  //     http://192.168.34.72/tuishu/client/boot/index.html
    //     apkDownloadUrl:shareDownload,
    //     webviewName:'tuishu',
    //     appid:'102'
    // },{ // http://192.168.31.10:3003/index.html
    //     usePi:true,
    //     title:{ zh_Hans:'书城',zh_Hant:'书城',en:'' },
    //     desc:{ zh_Hans:'书城',zh_Hant:'书城',en:'' },
    //     img:['app/res/image1/fairyChivalry1.jpg','app/res/image1/fairyChivalry.jpg','app/res/image1/fairyChivalry.jpg'],
    //     url:'http://192.168.34.72:5432/index.html', // http://192.168.34.72:5432/index.html
    //     apkDownloadUrl:shareDownload,
    //     webviewName:'reader',
    //     appid:'102'
    // }
];

export const activityList = [
    // {
    //     title:{ zh_Hans:'LOL赛事竞猜',zh_Hant:'LOL賽事競猜',en:'' },
    //     desc:{ zh_Hans:'2019LPL春季赛常规赛',zh_Hant:'2019LPL春季賽常規賽',en:'' },
    //     img:['app/res/image1/guess.png','app/res/image1/guess1.png'],
    //     url:'earn-client-app-view-guess-home'
    // },
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

/**
 * 获取指定webviewName的所有值
 */
export const getGameItem = (webviewName:string) => {
    const index = gameList.findIndex((item) => {
        return item.webviewName === webviewName;
    });
    const officialService = getLocalStorage('officialService');
    let gameItem = {};
    if (officialService) {
        gameItem =  officialService.gameList[index];
    }
      
    console.log('获取游戏配置信息', gameList[index], gameItem);

    return {
        ...gameList[index],
        ...gameItem
    };
};
