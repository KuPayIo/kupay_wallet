/**
 * transaction home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../logic/dataCenter';
import { TxHistory, TxType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, fetchBalanceValueOfCoin, formatBalance, formatBalanceValue, getCurrencyUnitSymbol, getCurrentAddrByCurrencyName, getCurrentAddrInfo, getLanguage, parseAccount, parseStatusShow, parseTxTypeShow, timestampFormat } from '../../../utils/tools';
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
        dataCenter.updateAddrInfo(getCurrentAddrInfo(this.props.currencyName).addr,this.props.currencyName);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const balance = formatBalance(getCurrentAddrInfo(this.props.currencyName).balance);
        const balanceValue =  fetchBalanceValueOfCoin(currencyName,balance);
        const txList = this.parseTxList();
        const canConvert = this.canConvert();
        const color = getStore('setting/changeColor','redUp');
        const cfg = getLanguage(this);
        const addr = parseAccount(getCurrentAddrByCurrencyName(currencyName));
        
        this.state = {
            balance,
            balanceValue:formatBalanceValue(balanceValue),
            rate:formatBalanceValue(fetchBalanceValueOfCoin(currencyName,1)),
            txList,
            canConvert,
            cfgData:cfg,
            redUp:color === 'redUp',
            currencyUnitSymbol:getCurrencyUnitSymbol(),
            tabs:[{
                tab:'全部',
                list:txList
            },{
                tab:'转账',
                list:this.transferList(txList)
            },{
                tab:'收款',
                list:this.receiptList(txList)
            }],
            activeNum:0,
            address:addr
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
    /**
     * 转账记录
     */
    public transferList(txList:TxHistory[]) {
        return txList.filter(item => {
            return item.txType !== TxType.Receipt;
        });
    }
    /**
     * 收款记录
     */
    public receiptList(txList:TxHistory[]) {
        return txList.filter(item => {
            return item.txType === TxType.Receipt;
        });
    }
    /**
     * tab切换
     */
    public tabsChangeClick(value: number) {
        this.state.activeNum = value;
        this.paint();
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
    //转账
    public doTransferClick() {
        popNew('app-view-wallet-transaction-transfer',{ currencyName:this.props.currencyName });
    }
    //收款
    public doReceiptClick() {
        popNew('app-view-wallet-transaction-receipt',{ currencyName:this.props.currencyName });
    }

    public chooseAddrClick() {
        popNew('app-view-wallet-transaction-chooseAddr',{ currencyName:this.props.currencyName });
    }
    public updateRate() {
        this.state.rate = formatBalanceValue(fetchBalanceValueOfCoin(this.props.currencyName,1));
        this.paint();
    }

    public convertCurrencyClick() {
        popNew('app-view-wallet-coinConvert-coinConvert',{ currencyName:this.props.currencyName });
    }

    public currencyUnitChange() {
        this.state.rate = formatBalanceValue(fetchBalanceValueOfCoin(this.props.currencyName,1));
        this.state.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(this.props.currencyName,this.state.balance));
        this.state.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }

    public refreshClick() {
        dataCenter.updateAddrInfo(getCurrentAddrInfo(this.props.currencyName).addr,this.props.currencyName);
    }
}

// ==========================本地

// 当前钱包变化
register('wallet/currencyRecords',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 汇率变化
register('third/rate', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRate();
    }
});

// 涨跌幅变化
register('third/currency2USDTMap', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRate();
    }
});

// 货币单位变化
register('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});
