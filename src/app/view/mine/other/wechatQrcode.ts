/**
 * 联系我们
 */
// ===============================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage } from '../../../utils/tools';
// ==================================================导出

export class WechatQrcode extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        const cfg = getLanguage(this);
        this.state = {
            cfgData:cfg
        };
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
                popNew('app-components-message-message',{ content:this.state.cfgData.shareScreen });
            }
        });
        console.log('截图截图截图');
    }
}