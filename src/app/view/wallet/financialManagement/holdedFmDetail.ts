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
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public async redemptionClick(){
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