/**
 * transaction home
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getBorn } from '../../../store/store';
// tslint:disable-next-line:max-line-length
import { formatBalance, formatBalanceValue, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, timestampFormat } from '../../../utils/tools';
import { fetchTransactionList } from '../../../utils/walletTools';

interface Props {
    currencyName:string;
}
export class TransactionHome extends Widget {
    public props:Props;
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const balance = formatBalance(getCurrentAddrBalanceByCurrencyName(currencyName));
        const rate = getBorn('exchangeRateJson').get(currencyName).CNY;
        const balanceValue =  rate * balance;
        const txList = this.parseTxList();
        // console.log('txList-----------',txList);
        this.state = {
            balance,
            balanceValue:formatBalanceValue(balanceValue),
            rate,
            txList
        };
    }
    public parseTxList() {
        const currencyName = this.props.currencyName;
        const curAddr = getCurrentAddrByCurrencyName(currencyName);
        const txList = fetchTransactionList(curAddr,currencyName);
        txList.forEach(item => {
            item.TimeShow = timestampFormat(item.time).slice(5);
        });

        return txList;
    }
    public txListItemClick(e:any,index:number) {
        popNew('app-view-wallet-transaction-transactionDetails',{ tx:this.state.txList[index] });
    }
}