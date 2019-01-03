/**
 * 新用户福利
 */


 import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";


export class NewUserWelfare extends Widget {
    public ok: () => void;

    public goLogin(){
        popNew('app-view-wallet-create-home');
        this.ok && this.ok();
    }
    public close(e: any) {
        this.ok && this.ok();
    }
}