/**
 * 去登录 modal
 */

import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class NewUserWelfare extends Widget {
    public ok: () => void;
    public props:any = { pi_norouter:true };
    public goLogin() {
        this.ok && this.ok();
        popNew('app-view-wallet-create-home');
    }
    public close(e: any) {
        this.ok && this.ok();
    }
}