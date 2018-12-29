/**
 * 奖券中心-首页
 */


import { Widget } from "../../../../../../pi/widget/widget";
import { popNew } from "../../../../../../pi/ui/root";


export class TicketCenter extends Widget {
    public ok: () => void;


    /**
     * 查看玩法
     */
    public goRule(){
        popNew('app-view-earn-client-view-ticketCenter-playRule');
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('app-view-earn-exchange-exchangeHistory');
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}