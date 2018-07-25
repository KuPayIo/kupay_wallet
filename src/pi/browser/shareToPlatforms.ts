/**
 * 分享
 */
import { NativeObject, ParamType, registerSign } from './native';

export class ShareToPlatforms extends NativeObject {
    public static TYPE_IMG: number = 1;// 二维码图片
    public static TYPE_TEXT: number = 2;// 文本

    /**
     * 分享
     * @param param 参数
     */
    public shareCode(param: any) {
        this.call('shareContent', param);
    }
}

registerSign(ShareToPlatforms, {
    shareContent: [
        {
            name: 'content',// 要分享的内容
            type: ParamType.String
        },
        {
            name: 'type',// 分享的内容的种类 传 1 ：表示分享图片 传 2 ：表示 分享文本
            type: ParamType.Number
        }
    ]
});