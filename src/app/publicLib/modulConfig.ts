/**
 *  app模块配置
 */

// ---------app模块功能配置----------------------------
const appModulConfig = {
    APP_CHAT: true,            // 聊天模块
    APP_WALLET: true,           // 钱包模块
    APP_EARN: true,             // 赚钱模块
    APP_PLAY: true,            // 游戏模块
    APP_PAY:false,             // 支付测试模块
    FINANCIAL_SERVICES: false,   // 优选理财
    GITHUB:true,                  // github显示
    CLOUDASSETSHIDDEN:['ETH','BTC'],         // 云端资产隐藏
    IOS:true,                     // 是否ios版本

    WALLET_NAME: '好嗨',                        // 钱包名字
    WALLET_WEBSITE:'http://www.highapp.cn',     // 官网地址
    LOGIN_IMG:'app/res/image/login_bg.png',     // 登录页面图片
    WALLET_LOGO:'app/res/image/img_logo.png',    // 钱包logo
    WECHAT_HELPER:'app/res/image/wechat_robot.jpg',  // 微信小助手二维码
    WECHAT_ACCOUNT:'app/res/image/wechat_pn.jpg',  // 微信公众号二维码
    QQ_CODE:'1598787032',                               // qq号
    PAY_DOMAIN:'https://app.herominer.net',   // 支付注册域名
    CONTACTUSDESC:'好玩又赚钱',                  // 联系我们文字描述
    ABOUTUSDESC:'好玩又赚钱',                   // 关于我们文字描述
    KT_SHOW : '嗨豆',                    // KT界面显示文字
    ST_SHOW : '碎银',                    // ST界面显示文字
    SC_SHOW : '银两'                     // SC界面显示文字
};

export const getModulConfig = (modulName: string) => {
    if (appModulConfig.hasOwnProperty(modulName)) {
        return appModulConfig[modulName];
    } else {
        return false;
    }
};
