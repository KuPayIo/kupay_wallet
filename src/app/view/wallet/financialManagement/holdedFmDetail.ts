/**
 * 购买的理财详情
 */
import { Widget } from '../../../../pi/widget/widget';
import { buyBack, getPurchaseRecord } from '../../../net/pull';
import { PurchaseRecordOne } from '../../../store/interface';
import { find } from '../../../store/store';
import { getLanguage, popNewLoading, popNewMessage, popPswBox } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';
interface Props {
    product:PurchaseRecordOne;
}
export class HoldedFmDetail extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log(this.props.product);
        const cfg = getLanguage(this);
        const stateShow = props.product.state === 1 ? cfg.phrase[0] : cfg.phrase[1];
        const stateBg = props.product.state === 1 ? '' : 'bg1';
        const btnText = props.product.state === 1 ? cfg.phrase[2] : cfg.phrase[1];
        const btnBgColor = props.product.state === 1 ? 'blue' : 'white';
        this.state = {
            stateShow,
            stateBg,
            btnText,
            btnBgColor,
            cfgData:cfg
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public async redemptionClick() {
        if (this.props.product.state !== 1) return;
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNewLoading(this.state.cfgData.loading);
        const verify = await VerifyIdentidy(find('curWallet'),psw);
        if (!verify) {
            popNewMessage(this.state.cfgData.tips[0]);
            close.callback(close.widget);

            return;
        }
        const result = await buyBack(this.props.product.purchaseTimeStamp);
        close.callback(close.widget);
        if (result) {
            popNewMessage(this.state.cfgData.tips[1]);
            getPurchaseRecord();
        } else {
            popNewMessage(this.state.cfgData.tips[2]);
        }
    }
}