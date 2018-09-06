/**
 * 添加好友
 */
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';

export class AddFriend extends Widget {
    public ok:()=>void;
    public create() {
        super.create();
    }

    public share(){
        // popNew('app-view-earn-mining-miningHistory');
    }

    public backPrePage() {
        this.ok && this.ok();
    } 
}