/**
 * 活动-邀请好友
 */
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    showPage:string;
}
export class InviteFriend extends Widget {
    public ok : () => void;

    public props:Props = {
        showPage:'first'
    };
    constructor() {
        super();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 切换显示页面
     * @param page 显示页面标识
     */
    public change(page:string) {
        this.props.showPage = page;
        this.paint();
    }

}