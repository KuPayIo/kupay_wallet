/**
 * 新用户福利
 */

import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class NewUserWelfare extends Widget {
    public ok: () => void;
    public props:any = {
        fadeOut:false
    };
    public goLogin() {
        this.ok && this.ok();
        popNew('app-view-wallet-create-home');
    }
    public close(e: any) {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }
}