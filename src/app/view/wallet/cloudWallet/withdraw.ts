/**
 * Withdraw
 */
import { Widget } from "../../../../pi/widget/widget";
import { getBorn, find } from "../../../store/store";
import { popNew } from "../../../../pi/ui/root";
import { withdrawMinerFee } from "../../../config";
import { getAddrsInfoByCurrencyName, parseAccount, getCurrentAddrInfo, popNewMessage, popPswBox } from "../../../utils/tools";
import { withdrawLimit } from "../../../utils/constants";
import { CurrencyType } from "../../../store/interface";
import { withdraw } from "../../../net/pullWallet";
interface Props{
    currencyName:string;
}
export class Withdraw extends Widget{
    public props:Props;
    public ok:()=>void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const minerFee = withdrawMinerFee[currencyName];
        const balance = getBorn('cloudBalance').get(CurrencyType[currencyName]);
        this.state = {
            balance,
            amount:0,
            minerFee,
            withdrawAddr:getCurrentAddrInfo(currencyName).addr,
            withdrawAddrInfo:this.parseAddrsInfo()
        };
    }

    public backPrePage(){
        this.ok && this.ok();
    }
    public minerFeeDescClick() {
        const content = "无论单笔提币数量多少，每笔提币均会消耗固定费用，提币手续费将从提币数量中扣除，对应各币种，提现手续费不一致。BTC手续费固定0.001ETH/笔。ETH手续费固定收取0.01ETH/笔。提币到账时间以接收时间为准。";
        popNew('app-components-modalBox-modalBox1',{ title:'提币收费标准',content,tips:'曾经拥有1000KT才具有提现权限' });
    }

     // 提币金额变化
     public amountChange(e:any) {
        this.state.amount = Number(e.value);
        this.paint();
    }


    public parseAddrsInfo(){
        const addrsInfo = getAddrsInfoByCurrencyName(this.props.currencyName);
        const curAddr = getCurrentAddrInfo(this.props.currencyName).addr;
        addrsInfo.forEach(item=>{
            item.addrShow = parseAccount(item.addr);
            item.isChoosed = item.addr === curAddr;
        });
        return addrsInfo;
    }

    public chooseWithdrawAddr(){
        popNew('app-view-wallet-components-choosetWithdrawAddr',{addrsInfo:this.state.withdrawAddrInfo},(index)=>{
            const addrsInfo = this.state.withdrawAddrInfo;
            for(let i = 0;i<addrsInfo.length;i++){
                if(i === index){
                    addrsInfo[i].isChoosed = true;
                    this.state.withdrawAddr = addrsInfo[i].addr;
                }else{
                    addrsInfo[i].isChoosed = false;
                }
            }
            this.paint();
        });
    }

    public async withdrawClick(){
        const currencyName = this.props.currencyName;
        const limit = withdrawLimit[currencyName];
        if (Number(this.state.amount) < limit) {
            popNewMessage(`最小提现金额${limit}${currencyName}`);

            return;
        }
        if (Number(this.state.amount) + this.state.minerFee > this.state.balance) {
            popNewMessage(`余额不足`);

            return;
        }
        const realUser = getBorn('realUserMap').get(find('conUser'));
        if (!realUser) {
            popNewMessage('您不是真实用户,无法使用此功能');
            return;
        }
        const passwd = await popPswBox();
        if (!passwd) return;
        const success = await withdraw(passwd,this.state.withdrawAddr,this.props.currencyName,this.state.amount);
        if(success){
            this.ok && this.ok();
        }
    }

}