/**
 * 消息框
 */
import { Widget } from '../../../pi/widget/widget';
import { getLanguage } from '../../utils/tools';

export class OpenLink extends Widget {
    public ok: () => void;
    public cancel:() => void;

    public create() {
        this.state = {
            cfgData:getLanguage(this)
        };
    }

    public openClick() {
        this.ok && this.ok();
    }

    public cancelClick() {
        this.cancel && this.cancel();
    }
   
}
