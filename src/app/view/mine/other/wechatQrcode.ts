/**
 * 联系我们
 */
// ===============================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
// ==================================================导出

export class WechatQrcode extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public shareImg() {
        const stp = new ShareToPlatforms();
        stp.init();
        stp.makeScreenShot({
            success: (result) => { 
                popNew('app-components-share-share',{ shareType:ShareToPlatforms.TYPE_SCREEN });
            },
            fail: (result) => { 
                popNew('app-components-message-message',{ content:this.language.shareScreen });
            }
        });
        console.log('截图截图截图');
    }
}