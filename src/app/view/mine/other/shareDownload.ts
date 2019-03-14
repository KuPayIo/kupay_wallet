/**
 * 分享下载链接页面
 */
import { ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { makeScreenShot } from '../../../logic/native';
import { getUserInfo } from '../../../utils/tools';

export class ShareDownload extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const userInfo = getUserInfo();
        this.props = {
            nickName:userInfo.nickName,
            avatar:userInfo.avatar
        };

    }
    public firstPaint() {
        console.log('firstPaint');
    }

    public attach() {
        console.log('attach');
        setTimeout(() => {
            this.shareClick();
        },1000);
    }
    public shareClick() {
        makeScreenShot(() => {
            popNew('app-components-share-share',{ shareType:ShareType.TYPE_SCREEN });
        },() => {
            const tips = { zh_Hans:'分享截图失败',zh_Hant:'分享截圖失敗',en:'' };
            popNew('app-components-message-message',{ content:tips[getLang()] });
        });
    }
    public backClick() {
        this.ok && this.ok();
    }
}