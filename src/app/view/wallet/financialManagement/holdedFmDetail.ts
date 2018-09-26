/**
 * 购买的理财详情
 */
import { Widget } from "../../../../pi/widget/widget";
import { PurchaseRecordOne } from "../../../store/interface";
import { popPswBox, popNewLoading, popNewMessage } from "../../../utils/tools";
import { buyBack, getPurchaseRecord } from "../../../net/pull";
import { VerifyIdentidy } from "../../../utils/walletTools";
import { find } from "../../../store/store";
interface Props{
    product:PurchaseRecordOne;
}
export class holdedFmDetail extends Widget{
    public ok:()=>void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log(this.props.product);
        const stateShow = props.product.state === 1 ? '收益中' : '已赎回';
        const stateBg = props.product.state === 1 ? '' : 'bg1';
        const btnText = props.product.state === 1 ? '赎回' : '已赎回';
        const btnBgColor = props.product.state === 1 ? 'blue' : 'white';
        this.state = {
            stateShow,
            stateBg,
            btnText,
            btnBgColor
        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public async redemptionClick(){
        if(this.props.product.state !== 1) return;
        const psw = await popPswBox();
        if(!psw) return;
        const close = popNewLoading('赎回中...');
        const verify = await VerifyIdentidy(find('curWallet'),psw);
        if(!verify){
            popNewMessage('密码错误');
            close.callback(close.widget);
            return;
        }
        const result = await buyBack(this.props.product.purchaseTimeStamp);
        close.callback(close.widget);
        if(result){
            popNewMessage('赎回成功')
            getPurchaseRecord();
        }else{
            popNewMessage('赎回失败')
        }
    }
}