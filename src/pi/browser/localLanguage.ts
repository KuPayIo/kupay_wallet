/**
 * 语言设置
 */
import { NativeObject, ParamType, registerSign } from './native';

export class LocalLanguageMgr extends NativeObject {
    public getMobileLan(param:any) {
        this.call('getMobileLanguage',param);
    }
    public setMobileLan(param:any) {
        this.call('setMobileLanguage',param);
    }
}

registerSign(LocalLanguageMgr, {
    getMobileLanguage: [],
    setMobileLanguage: [
        {
            param:'language',
            type:ParamType.Number
        }
    ]
});