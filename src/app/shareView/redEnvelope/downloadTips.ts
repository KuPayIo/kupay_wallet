/**
 * 
 */
import { Widget } from '../../../pi/widget/widget';

export class DownloadTips extends Widget {
    public ok:() => void;
    public maskClick() {
        this.ok && this.ok();
    }
}