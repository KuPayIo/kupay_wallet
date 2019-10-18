/**
 * 服务器推送key
 */
export enum ServerPushKey {
    CMD = 'cmd',                // 踢人下线
    EVENTPAYOK = 'event_pay_ok',         // 充值成功
    EVENTINVITESUCCESS = 'event_invite_success',   // 邀请好友成功
    EVENTCONVERTINVITE = 'event_convert_invite',   // 兑换邀请码成功
    EVENTINVITEREAL = 'event_invite_real',          // 邀请好友并成为真实用户事件
    ALTERBALANCEOK = 'alter_balance_ok'            // 余额变化事件
}
/**
 * 服务器推送
 */
export interface ServerPushArgs {
    key:ServerPushKey;            // 服务器推送key
    result:any;           // 服务器推送内容
}

/**
 * 推送消息模块
 */ 
export enum PostModule {
    LOADED = 0,    // 资源加载
    SERVER = 1,    // 服务端推送
    THIRD = 2     // 第三方游戏推送
}  

/**
 * 加载阶段
 */
export enum LoadedStage {
    START = 0,                 // 开始加载
    STORELOADED = 1           // store模块加载完毕并且数据初始化成功
}

/**
 * 三方命令
 */
export enum ThirdCmd {
    CLOSE = 0,        // 关闭
    MIN,              // 最小化
    INVITE,             // 邀请好友
    RECHARGE,         // 充值
    GAMESERVICE,       // 游戏客服
    OFFICIALGROUPCHAT   // 官方群聊
}

export interface ThirdPushArgs {
    cmd:ThirdCmd;         // 第三方游戏推送key
    payload:any;
}
/**
 * postMessage args类型
 */
export type PostMessageArgs = ServerPushArgs | ThirdPushArgs | LoadedStage;

/**
 * vm 往 webview 推送消息类型
 */
export interface PostMessage {
    moduleName:PostModule;   // 模块名
    args:PostMessageArgs;                // 参数
}