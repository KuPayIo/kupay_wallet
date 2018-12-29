/**
 * 奖券中心-玩法
 */


import { Widget } from "../../../../../../pi/widget/widget";

export class TicketCenter extends Widget {
    public ok: () => void;

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}