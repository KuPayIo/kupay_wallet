/**
 * 图片导入（本地、相机）
 */
import { NativeObject, ParamType, registerSign } from './native';
import { base64ToArrayBuffer } from '../util/base64';

export class ImagePicker extends NativeObject {
    /**
     * 从本地选择图片
     * @param param 参数
     */
    public selectFromLocal(param: any) {
        this.call('chooseImage', param);
    }

    /**
     * 
     * @param param {success: ArrayBuffer}
     */
    public getContent(param: any) {
        let old = param.success;
        
        if (old) {
            param.success = base64 => {
                let buffer = base64ToArrayBuffer(base64);
                old(buffer);
            }
        }
        
        this.call('getContent', param);
    }

    public getAHash(param: any) {
        this.call('getAHash', param);
    }
}

registerSign(ImagePicker, {
    chooseImage: [
        {
            name: 'useCamera',// 是否使用相机----(传1表示 “是”，其它任何值都表示 “否”)
            type: ParamType.Number
        },
        {
            name: 'single',// 是否只选择一张照片(单选)----(传1表示 “是”，其它任何值都表示 “否”)
            type: ParamType.Number
        },
        {
            name: 'max',// 可以选择多张的情况下最大可以选择的张数
            type: ParamType.Number
        }
    ],
    getContent: [],
    getAHash: [],
});
