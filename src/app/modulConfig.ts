// app模块配置

//---------app模块----------------------------
export const appModulConfig = {
    APP_CHAT: false,            //聊天模块
    APP_WALLET: true,           //钱包模块
    APP_EARN: true,             //赚钱模块
    APP_PLAY: false,            //游戏模块
    FINANCIAL_SERVICES: false,   //优选理财
}

export const findModulConfig = (modulName: string) => {
    if (appModulConfig[modulName]) {
        return true;
    } else {
        return false;
    }
}
