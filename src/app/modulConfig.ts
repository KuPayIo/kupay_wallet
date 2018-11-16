/**
 *  app模块配置
 */

// ---------app模块功能配置----------------------------
const appModulConfig = {
    APP_CHAT: false,            // 聊天模块
    APP_WALLET: true,           // 钱包模块
    APP_EARN: false,             // 赚钱模块
    APP_PLAY: true,            // 游戏模块
    FINANCIAL_SERVICES: true,   // 优选理财
    GITHUB:false,                  // github显示

    WALLET_NAME: 'KuPay',           // 钱包名字
    WALLET_WEBSITE:'www.KuPay.io',     // 官网地址
    LOGIN_IMG:'app/res/image/login_bg.png',  // 登录页面图片
    WALLET_LOGO:'app/res/image/img_logo.png' // 钱包logo
};

export const findModulConfig = (modulName: string) => {
    if (appModulConfig.hasOwnProperty(modulName)) {
        return appModulConfig[modulName];
    } else {
        return false;
    }
};
