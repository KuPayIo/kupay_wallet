/**
 * 新用户福利
 */

import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class NewUserWelfare extends Widget {
    public ok: () => void;
    public props:any = { pi_norouter:true };
    public goLogin() {
        popNew('app-view-wallet-create-home');
        this.ok && this.ok();
    }
    public close(e: any) {
        this.ok && this.ok();
    }
}