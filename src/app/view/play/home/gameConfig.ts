import { CRYPTOFISHING_GROUP, FOMOSPORTS_GROUP } from '../../../../chat/server/data/constant';

/**
 * 第三方游戏相关配置
 */

 /**
  * 游戏列表
  */
export const gameList = [
    {
        title:{ zh_Hans:'fomosports',zh_Hant:'fomosports',en:'' },
        desc:{ zh_Hans:'要买要快，不要只是看',zh_Hant:'要買要快，不要只是看',en:'' },
        webviewName:'fomosports',
        img:['app/res/image1/fomosports.jpg','app/res/image1/fomosports1.jpg'],
        url:'https://test.fomosports.me/',
        gid:FOMOSPORTS_GROUP
    },
    {
        title:{ zh_Hans:'Crypto Fishing',zh_Hant:'Crypto Fishing',en:'' },
        desc:{ zh_Hans:'新一代区块链游戏',zh_Hant:'新一代區塊鏈遊戲',en:'' },
        webviewName:'Crypto Fishing',
        img:['app/res/image1/CryptoFishing.jpg','app/res/image1/CryptoFishing1.jpg'],
        url:'http://192.168.31.10:3003/index.html',
        gid:CRYPTOFISHING_GROUP
    }
   
];

/**
 * 获取指定webviewName的url
 */
export const getGameUrl = (webviewName:string) => {
    const index = gameList.findIndex((item) => {
        return item.webviewName === webviewName;
    });

    return gameList[index].url;
};