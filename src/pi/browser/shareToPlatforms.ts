/**
 * 分享
 */
import { NativeObject, ParamType, registerSign } from './native';

export class ShareToPlatforms extends NativeObject {
    public static TYPE_IMG: number = 1;// 二维码图片
    public static TYPE_TEXT: number = 2;// 文本
    public static TYPE_LINK: number = 3;// 文本

    public static PLATFORM_DEFAULT: number = -1;// 默认
    public static PLATFORM_WEBCHAT: number = 1;// 微信
    public static PLATFORM_MOMENTS: number = 2;// 朋友圈
    public static PLATFORM_QZONE: number = 3;// qq空间
    public static PLATFORM_QQ: number = 4;// qq

    /**
     * 分享
     */
    public shareCode(param: any) {
        this.call('shareContent', param);
    }
    /**
     * 分享链接
     */
    public shareLink(param: any) {
        this.call('shareLink', param);
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
    ], shareLink: [
        {
            name: 'webName',// 网站名称
            type: ParamType.String
        },
        {
            name: 'url',// 要分享的url链接
            type: ParamType.String
        },
        {
            name: 'title',// 标题
            type: ParamType.String
        },
        {
            name: 'content',// 内容
            type: ParamType.String
        },
        {
            name: 'comment',// 评论
            type: ParamType.String
        }
    ]
});
