/**
 * transaction home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callFetchTransactionList, callGetCurrentAddrInfo, callGetDataCenter } from '../../../middleLayer/walletBridge';
import { TxHistory, TxType } from '../../../publicLib/interface';
import { timestampFormat } from '../../../publicLib/tools';
import { getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { calCurrencyLogoUrl, parseAccount, parseStatusShow, parseTxTypeShow } from '../../../utils/tools';
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
    public props:any;

    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        Promise.all([callGetDataCenter(),callGetCurrentAddrInfo(this.props.currencyName)]).then(([dataCenter,addrInfo]) => {
            dataCenter.updateAddrInfo(addrInfo.addr,this.props.currencyName);
            const balance = formatBalance(addrInfo.balance);
            const balanceValue =  fetchBalanceValueOfCoin(this.props.currencyName,balance);
            this.props.balance = balance;
            this.props.balanceValue = balanceValue;
            this.props.addrInfo = addrInfo;
            this.paint();
        });
    }
    public init() {
        const currencyName = this.props.currencyName;
        const canConvert = this.canConvert();
        const color = getStore('setting/changeColor','redUp');
        const addr = parseAccount(getCurrentAddrByCurrencyName(currencyName));
        this.props = {
            ...this.props,
            currencyLogo:calCurrencyLogoUrl(currencyName),
            balance:0,
            balanceValue:formatBalanceValue(0),
            rate:formatBalanceValue(fetchBalanceValueOfCoin(currencyName,1)),
            txList:[],
            canConvert,
            redUp:color === 'redUp',
            currencyUnitSymbol:getCurrencyUnitSymbol(),
            tabs:[{
                tab:'全部',
                list:[]
            },{
                tab:'转账',
                list:[]
            },{
                tab:'收款',
                list:[]
            }],
            activeNum:0,
            address:addr
        };

        this.parseTxList().then(txList => {
            this.props.txList = txList;
            this.props.tabs[0].list = txList;
            this.props.tabs[1].list = this.transferList(txList);
            this.props.tabs[2].list = this.receiptList(txList);
            console.log(this.props.tabs);
            this.paint();
        });
        
    }
    // 解析txList
    public async parseTxList() {
        const currencyName = this.props.currencyName;
        const curAddr = getCurrentAddrByCurrencyName(currencyName);
        const txList = await callFetchTransactionList(curAddr,currencyName);
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
        this.props.activeNum = value;
        this.paint();
    }

    public canConvert() {
        const convertCurrencys = currencyExchangeAvailable();
        for (let i = 0;i < convertCurrencys.length;i++) {
            if (convertCurrencys[i] === this.props.currencyName) {
                return true;
            }
        }

        return false;
    }
    public txListItemClick(e:any,index:number) {
        const hash = this.props.tabs[this.props.activeNum].list[index].hash;
        popNew('app-view-wallet-transaction-transactionDetails',{ hash });
    }
    // 转账
    public doTransferClick() {
        popNew('app-view-wallet-transaction-transfer',{ currencyName:this.props.currencyName });
    }
    // 收款
    public doReceiptClick() {
        popNew('app-view-wallet-transaction-receipt',{ currencyName:this.props.currencyName });
    }

    public chooseAddrClick() {
        popNew('app-view-wallet-transaction-chooseAddr',{ currencyName:this.props.currencyName });
    }
    public updateRate() {
        this.props.rate = formatBalanceValue(fetchBalanceValueOfCoin(this.props.currencyName,1));
        this.paint();
    }

    public convertCurrencyClick() {
        popNew('app-view-wallet-coinConvert-coinConvert',{ currencyName:this.props.currencyName });
    }

    public currencyUnitChange() {
        this.props.rate = formatBalanceValue(fetchBalanceValueOfCoin(this.props.currencyName,1));
        this.props.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(this.props.currencyName,this.props.balance));
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }

    public refreshClick() {
        callGetDataCenter().then(dataCenter => {
            dataCenter.updateAddrInfo(this.props.addrInfo.addr,this.props.currencyName);
        });
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
