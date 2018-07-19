/**
 * 分享片段给好友
 */
import { Widget } from '../../../../pi/widget/widget';
import { DataCenter } from '../../../store/dataCenter';

interface Props {
    shares: string[];
}
export class WalletCreate extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        this.state = {
            totalSteps: DataCenter.MAX_SHARE_LEN,
            part: this.props.shares[0],// 分享内容
            step: 1// 分享第几个人
        };
    }
    public back() {
        this.ok && this.ok();
    }
    public shareBtnClick() {
        // TODO 分享给好友

        // 分享完成后
        this.state.step++;
        this.state.part = this.props.shares[this.state.step - 1];
        this.paint();

        // 分享完成
        if (this.state.step > this.state.totalSteps) {
            this.ok && this.ok();
        }

    }

}
