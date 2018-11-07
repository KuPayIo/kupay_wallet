/**
 * 语言设置
 */
import { NativeObject, ParamType, registerSign } from './native';


export enum appLanguageList {
    zh_Hans = 2,
    zh_Hant = 3,
}

export class LocalLanguageMgr extends NativeObject {
    public getAppLan(param:any) {
        this.call('getAppLanguage',param);
    }
    public setAppLan(param:any) {
        this.call('setAppLanguage',param);
    }
    public getSysLan(param:any) {
        this.call('getSystemLanguage',param);
    }
}

registerSign(LocalLanguageMgr, {
    getAppLanguage: [],
    setAppLanguage: [
        {
            param:'language',
            type:ParamType.Number
        }
    ],
    getSystemLanguage:[]
});