/**
 * cloud wallet home
 */
import { Widget } from "../../../../pi/widget/widget";
import { getBorn } from "../../../store/store";
import { popNewMessage, formatBalanceValue } from "../../../utils/tools";
import { popNew } from "../../../../pi/ui/root";
import { CurrencyType } from "../../../store/interface";
interface Props{
    currencyName:string;
}
export class CloudWalletHome extends Widget{
    public props:Props;
    public ok:()=>void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const rate =   getBorn('exchangeRateJson').get(currencyName).CNY;
        const balance = getBorn('cloudBalance').get(CurrencyType[currencyName]);
        const balanceValue = formatBalanceValue(rate * balance);
        this.state = {
            tabs:[{
                tab:'其他',
                components:'app-view-wallet-cloudWallet-otherRecord'
            },{
                tab:'充值',
                components:'app-view-wallet-cloudWallet-rechargeRecord'
            },{
                tab:'提币',
                components:'app-view-wallet-cloudWallet-withdrawRecord'
            }],
            activeNum:0,
            gain:getBorn('coinGain').get(currencyName) || formatBalanceValue(0),
            rate:formatBalanceValue(rate),
            balance,
            balanceValue
        };
    }

    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public rechargeClick(){
        if(this.props.currencyName === 'KT'){
            popNewMessage('敬请期待');
            return;
        }
        popNew('app-view-wallet-cloudWallet-recharge',{currencyName:this.props.currencyName});
    }
    public withdrawClick(){
        if(this.props.currencyName === 'KT'){
            popNewMessage('敬请期待');
            return;
        }
        popNew('app-view-wallet-cloudWallet-withdraw',{currencyName:this.props.currencyName});
    }
}