/**
 * 聊天
 */
import { NativeObject, ParamType, registerSign } from './native';

export class SendChatMessage extends NativeObject {
    /**
     * 跳转到Telegram聊天
     */
    public prepareChat(param: any) {
        this.call('jumpToTelegram', param);
    }

    /**
     * 设置代理
     * @param param 设置的回调
     */
    public setProxy(param: any) {
        this.call('setAndroidProxy', param);
    }

    /**
     * 
     * ios代理，因为ios是MTProxy
     */
    public setIosProxy(param:any) {
        this.call('setIOSProxy',param);
    }
}

registerSign(SendChatMessage, {
    jumpToTelegram: [],
    setAndroidProxy: [
        {
            name: 'proxyIp',// 设置代理->代理ip：如("123.123.123.123")
            type: ParamType.String
        },
        {
            name: 'proxyPort',// 设置代理->端口：如(6666)
            type: ParamType.Number
        },
        {
            name: 'userName',// 设置代理->用户名(如果没有用户名就传  ""   空字符串)
            type: ParamType.String
        },
        {
            name: 'password',// 设置代理->密码(如果没有用户名就传  ""   空字符串)
            type: ParamType.String
        }
    ],
    setIOSProxy: [
        {
            name: 'proxyIp',// 设置代理->代理ip：如("123.123.123.123")
            type: ParamType.String
        },
        {
            name: 'proxyPort',// 设置代理->端口：如(6666)
            type: ParamType.Number
        },
        {
            name: 'userName',// 设置代理->用户名(如果没有就传  ""   空字符串)
            type: ParamType.String
        },
        {
            name: 'password',// 设置代理->密码(如果没有就传  ""   空字符串)
            type: ParamType.String
        },
        {
            name: 'secret',// 设置代理->secret(如果没有就传  ""   空字符串)
            type: ParamType.String
        }
    ]
});