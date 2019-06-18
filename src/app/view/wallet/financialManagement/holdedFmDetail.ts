/**
 * 购买的理财详情
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetPurchaseRecord } from '../../../middleLayer/netBridge';
import { callVerifyIdentidy } from '../../../middleLayer/walletBridge';
import { buyBack } from '../../../net/pull';
import { PurchaseHistory } from '../../../publicLib/interface';
import { register } from '../../../store/memstore';
import { popNewLoading, popNewMessage, popPswBox } from '../../../utils/tools';
interface Props {
    product:PurchaseHistory;
    index:number;
}
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class HoldedFmDetail extends Widget {
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        // console.log(this.props.product);
        this.language = this.config.value[getLang()];
        const stateShow = props.product.state === 1 ? this.language.phrase[0] : this.language.phrase[1];
        const stateBg = props.product.state === 1 ? '' : 'bg1';
        const btnText = props.product.state === 1 ? this.language.phrase[2] : this.language.phrase[1];
        const btnBgColor = props.product.state === 1 ? 'blue' : 'white';
        this.props = {
            ...this.props,
            stateShow,
            scrollHeight:0,
            stateBg,
            btnText,
            btnBgColor
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
        const secretHash = await callVerifyIdentidy(psw);
        if (!secretHash) {
            popNewMessage(this.language.tips[0]);
            close.callback(close.widget);

            return;
        }
        const result = await buyBack(this.props.product.purchaseTimeStamp,secretHash);
        close.callback(close.widget);
        if (result) {
            popNewMessage(this.language.tips[1]);
            callGetPurchaseRecord();
        } else {
            popNewMessage(this.language.tips[2]);
        }
    }

     // 页面滚动
    public pageScroll() {
        const scrollTop = document.getElementById('body').scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
        
    }

    /**
     * 点击阅读声明
     */
    public readAgree() {
        popNew('app-view-wallet-financialManagement-productStatement',{ fg:1 });        
    }
}

register('activity/financialManagement/purchaseHistories',(purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const data = {
            product:purchaseRecord[w.props.index],
            index:w.props.index
        };
        w.setProps(data);
        w.paint();
    }
    
});