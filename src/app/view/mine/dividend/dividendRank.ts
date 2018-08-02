/**
 * 领取奖励详情界面
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class DividendItem extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public gainAward() {
        popNew('pi-components-message-message', { type:'warn',content:'恭喜，你已经成功领取1000KPT' });
    }

}