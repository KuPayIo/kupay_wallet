/**
 * fund share Page
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class FundShare extends Widget {
    public ok: () => void;
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
        popNew('app-components-share-share', { text: 'This is a test QRCode', shareType: ShareToPlatforms.TYPE_IMG }, (result) => {
            alert(result);
        }, (result) => {
            alert(result);
        });
    }
} 