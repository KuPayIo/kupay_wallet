/**
 *  app模块配置
 */

// ---------app模块功能配置----------------------------
export const appModulConfig = {
    APP_CHAT: false,            // 聊天模块
    APP_WALLET: true,           // 钱包模块
    APP_EARN: false,             // 赚钱模块
    APP_PLAY: true,            // 游戏模块
    FINANCIAL_SERVICES: true,   // 优选理财
    WALLET_NAME: 'KuPay'           // 钱包名字

};

export const findModulConfig = (modulName: string) => {
    if (appModulConfig.hasOwnProperty(modulName)) {
        return appModulConfig[modulName];
    } else {
        return false;
    }
};
