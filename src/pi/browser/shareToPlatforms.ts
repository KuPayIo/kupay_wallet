/**
 * 分享
 */
import { NativeObject, ParamType, registerSign } from './native';

export class ShareToPlatforms extends NativeObject {
    public static TYPE_IMG: number = 1;// 二维码图片
    public static TYPE_TEXT: number = 2;// 文本

    public static PLATFORM_DEFAULT: number = -1;// 默认
    public static PLATFORM_WEBCHAT: number = 1;// 默认
    public static PLATFORM_FRIENDS: number = 2;// 默认
    public static PLATFORM_QQSPACE: number = 3;// 默认
    public static PLATFORM_QQ: number = 4;// 默认

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
        },
        {
            name: 'platform',// 要分享到的平台：1、微信 2、朋友圈 3、QQ空间 4、QQ 5、所有平台(当你传5的时候！不用写界面、底层会自动弹出界面)
            type: ParamType.Number
        }
    ]
});