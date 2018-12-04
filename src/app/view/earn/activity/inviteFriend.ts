/**
 * 活动-邀请好友
 */
import { Widget } from '../../../../pi/widget/widget';

export class InviteFriend extends Widget {
    public ok : () => void;
    constructor() {
        super();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

}