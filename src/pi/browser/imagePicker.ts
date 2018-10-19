/**
 * 图片导入（本地、相机）
 */
import { NativeObject, ParamType, registerSign } from './native';

export class ImagePicker extends NativeObject {
    /**
     * 从本地选择图片
     * @param param 参数
     */
    public selectFromLocal(param: any) {
        this.call('chooseImage', param);
    }

    /**
     * 打开相机拍摄
     * @param param 参数
     */
    public openCamera(param: any) {
        // todo
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
    ]
});