/**
 * transaction home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Addr } from '../../../store/interface';
import { getBorn, register } from '../../../store/store';
// tslint:disable-next-line:max-line-length
import { formatBalance, formatBalanceValue, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, parseStatusShow, timestampFormat } from '../../../utils/tools';
import { fetchTransactionList } from '../../../utils/walletTools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
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
        this.state = {
            balance,
            balanceValue:formatBalanceValue(balanceValue),
            rate,
            txList
        };
    }
    // 解析txList
    public parseTxList() {
        const currencyName = this.props.currencyName;
        const curAddr = getCurrentAddrByCurrencyName(currencyName);
        const txList = fetchTransactionList(curAddr,currencyName);
        txList.forEach(item => {
            item.TimeShow = timestampFormat(item.time).slice(5);
            item.statusShow =  parseStatusShow(item.status).text; 
        });

        return txList;
    }
    public txListItemClick(e:any,index:number) {
        popNew('app-view-wallet-transaction-transactionDetails',{ tx:this.state.txList[index] });
    }

    public doTransferClick() {
        popNew('app-view-wallet-transaction-transfer',{ currencyName:this.props.currencyName });
    }
}

// ==========================本地
register('addrs',(addrs:Addr[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        // w.userInfoChange(userInfo);
    }
});