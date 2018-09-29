/**
 * transaction home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../logic/dataCenter';
import { Addr } from '../../../store/interface';
import { getBorn, register } from '../../../store/store';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, formatBalance, formatBalanceValue, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, getCurrentAddrInfo, getLanguage, parseStatusShow, parseTxTypeShow, timestampFormat } from '../../../utils/tools';
import { fetchTransactionList } from '../../../utils/walletTools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    gain:number;
}
export class TransactionHome extends Widget {
    public props:Props;

    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        dataCenter.refreshTrans(getCurrentAddrInfo(this.props.currencyName).addr,this.props.currencyName);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const balance = formatBalance(getCurrentAddrBalanceByCurrencyName(currencyName));
        const rate =  getBorn('exchangeRateJson').get(currencyName).CNY;
        const balanceValue =  rate * balance;
        const txList = this.parseTxList();
        const canConvert = this.canConvert();
        this.state = {
            balance,
            balanceValue:formatBalanceValue(balanceValue),
            rate:formatBalanceValue(rate),
            txList,
            canConvert,
            cfgData:getLanguage(this)
        };
        
    }
    // 解析txList
    public parseTxList() {
        const currencyName = this.props.currencyName;
        const curAddr = getCurrentAddrByCurrencyName(currencyName);
        const txList = fetchTransactionList(curAddr,currencyName);
        txList.forEach(item => {
            item.TimeShow = timestampFormat(item.time).slice(5);
            item.statusShow =  parseStatusShow(item).text; 
            item.txTypeShow = parseTxTypeShow(item.txType);
        });

        return txList;
    }
    public canConvert() {
        const convertCurrencys = currencyExchangeAvailable();
        for (let i = 0;i < convertCurrencys.length;i++) {
            if (convertCurrencys[i].symbol === this.props.currencyName) {
                return true;
            }
        }

        return false;
    }
    public txListItemClick(e:any,index:number) {
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:this.state.txList[index].hash });
    }

    public doTransferClick() {
        popNew('app-view-wallet-transaction-transfer',{ currencyName:this.props.currencyName });
    }

    public doReceiptClick() {
        popNew('app-view-wallet-transaction-receipt',{ currencyName:this.props.currencyName });
    }

    public chooseAddrClick() {
        popNew('app-view-wallet-transaction-chooseAddr',{ currencyName:this.props.currencyName });
    }
    public updateRate() {
        this.state.rate = formatBalanceValue(getBorn('exchangeRateJson').get(this.props.currencyName).CNY);
        this.paint();
    }

    public updateTransaction() {
        this.init();
        this.paint();
    }

    public convertCurrencyClick() {
        popNew('app-view-wallet-coinConvert-coinConvert',{ currencyName:this.props.currencyName });
    }
}

// ==========================本地
// 地址变化
register('addrs',(addrs:Addr[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 汇率变化
register('exchangeRateJson',(exchangeRateJson) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRate();
    }
});

// 当前钱包变化
register('curWallet',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 交易记录变化
register('transactions',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});