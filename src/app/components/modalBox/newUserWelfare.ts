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
        callGetAllAccount().then(accounts => {
            if (accounts.length > 0) {
                popNew('app-view-base-entrance1',{ accounts });
            } else {
                popNew('app-view-base-entrance');
            }
        });
        
    }
    public close(e: any) {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }
}