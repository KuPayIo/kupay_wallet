/**
 * 购买的理财详情
 */
import { Widget } from '../../../../pi/widget/widget';
import { buyBack, getPurchaseRecord } from '../../../net/pull';
import { PurchaseHistory } from '../../../store/interface';
import { popNewLoading, popNewMessage, popPswBox } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';
import { getLang } from '../../../../pi/util/lang';
interface Props {
    product:PurchaseHistory;
}
export class HoldedFmDetail extends Widget {
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log(this.props.product);
        this.language = this.config.value[getLang()];
        const stateShow = props.product.state === 1 ? this.language.phrase[0] : this.language.phrase[1];
        const stateBg = props.product.state === 1 ? '' : 'bg1';
        const btnText = props.product.state === 1 ? this.language.phrase[2] : this.language.phrase[1];
        const btnBgColor = props.product.state === 1 ? 'blue' : 'white';
        this.state = {
            stateShow,
            scrollHeight:0,
            stateBg,
            btnText,
            btnBgColor,
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public async redemptionClick() {
        if (this.props.product.state !== 1) return;
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNewLoading(this.language.loading);
        const verify = await VerifyIdentidy(psw);
        if (!verify) {
            popNewMessage(this.language.tips[0]);
            close.callback(close.widget);

            return;
        }
        const result = await buyBack(this.props.product.purchaseTimeStamp);
        close.callback(close.widget);
        if (result) {
            popNewMessage(this.language.tips[1]);
            getPurchaseRecord();
        } else {
            popNewMessage(this.language.tips[2]);
        }
    }

     // 页面滚动
    public pageScroll() {
        const scrollTop = document.getElementById('body').scrollTop;
        this.state.scrollHeight = scrollTop;
        this.paint();
        
    }
}