/**
 * fund share Page
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { Widget } from '../../../../pi/widget/widget';

export class FundShare extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public cancelShareClick() {
        this.ok && this.ok();
        // this.testShare();
    }

    public testShare() {
        const stp = new ShareToPlatforms();

        stp.init();
        stp.shareQRCode({
            success: (result) => {
                alert(result);
            },
            fail: (result) => {
                alert(result);
            }, content: 'This is a test QRCode'
        });
    }
} 