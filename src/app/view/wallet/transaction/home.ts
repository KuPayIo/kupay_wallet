/**
 * transaction home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../middleLayer/memBridge';
import { callcurrencyExchangeAvailable, callFetchBalanceValueOfCoin, callGetCurrencyUnitSymbol } from '../../../middleLayer/toolsBridge';
import { callFetchTransactionList, callGetCurrentAddrInfo, callGetDataCenter } from '../../../middleLayer/walletBridge';
import { CurrencyRecord, TxHistory, TxType } from '../../../publicLib/interface';
import { formatBalance, formatBalanceValue, timestampFormat } from '../../../publicLib/tools';
import { register } from '../../../store/memstore';
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
        const currencyName = this.props.currencyName;
        Promise.all([callGetDataCenter(),
            callGetCurrentAddrInfo(currencyName),
            callFetchBalanceValueOfCoin(currencyName,1),
            callGetCurrencyUnitSymbol(),
            getStoreData('setting/changeColor','redUp')]).then(([dataCenter,addrInfo,oneBalanceValue,currencyUnitSymbol,color]) => {
                dataCenter.updateAddrInfo(addrInfo.addr,currencyName);
                const balance = formatBalance(addrInfo.balance);
                const balanceValue =  balance * oneBalanceValue;
                this.props.balance = balance;
                this.props.balanceValue = balanceValue;
                this.props.addrInfo = addrInfo;
                this.props.rate = formatBalanceValue(oneBalanceValue);
                this.props.address = parseAccount(addrInfo.addr);
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.props.redUp = (color === 'redUp');
                this.paint();
                callFetchTransactionList(addrInfo.addr,currencyName).then(orginTxList => {
                    this.parseTxList(orginTxList);
                });
            });
    }
    public init() {
        const currencyName = this.props.currencyName;
        this.props = {
            ...this.props,
            currencyLogo:calCurrencyLogoUrl(currencyName),
            balance:0,
            balanceValue:formatBalanceValue(0),
            rate:formatBalanceValue(0),
            txList:[],
            canConvert:false,
            redUp:true,
            currencyUnitSymbol:'',
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
            address:''
        };

        this.canConvert();
    }

    // 解析txList
    public parseTxList(txList:any) {
        txList.forEach(item => {
            item.TimeShow = timestampFormat(item.time).slice(5);
            item.statusShow =  parseStatusShow(item).text; 
            item.txTypeShow = parseTxTypeShow(item.txType);
        });

        this.props.txList = txList;
        this.props.tabs[0].list = txList;
        this.props.tabs[1].list = this.transferList(txList);
        this.props.tabs[2].list = this.receiptList(txList);
        this.paint();
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
        callcurrencyExchangeAvailable().then(convertCurrencys => {
            let canConvert = false;
            for (let i = 0;i < convertCurrencys.length;i++) {
                if (convertCurrencys[i] === this.props.currencyName) {
                    canConvert = true;
                    break;
                }
            }
            this.props.canConvert = canConvert;
            this.paint();
        });
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
        callFetchBalanceValueOfCoin(this.props.currencyName,1).then(rate => {
            this.props.rate = formatBalanceValue(rate);
            this.paint();
        });
        
    }

    public convertCurrencyClick() {
        popNew('app-view-wallet-coinConvert-coinConvert',{ currencyName:this.props.currencyName });
    }

    public currencyUnitChange() {
        const currencyName = this.props.currencyName;
        Promise.all([callGetCurrentAddrInfo(currencyName),
            callFetchBalanceValueOfCoin(currencyName,1),
            callGetCurrencyUnitSymbol()]).then(([addrInfo,oneBalanceValue,currencyUnitSymbol]) => {
                const balance = formatBalance(addrInfo.balance);
                const balanceValue =  balance * oneBalanceValue;
                this.props.balance = balance;
                this.props.balanceValue = balanceValue;
                this.props.addrInfo = addrInfo;
                this.props.rate = formatBalanceValue(oneBalanceValue);
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.paint();
                callFetchTransactionList(addrInfo.addr,currencyName).then(orginTxList => {
                    this.parseTxList(orginTxList);
                });
            });
        this.paint();
    }

    public refreshClick() {
        callGetDataCenter().then(dataCenter => {
            dataCenter.updateAddrInfo(this.props.addrInfo.addr,this.props.currencyName);
        });
    }

    public updateCurrencyRecords(currencyRecords: CurrencyRecord[]) {
        const currencyName = this.props.currencyName;
        callGetCurrentAddrInfo(currencyName).then(addrInfo => {
            const balance = formatBalance(addrInfo.balance);
            const balanceValue =  balance * this.props.rate;
            this.props.balance = balance;
            this.props.balanceValue = balanceValue;
            this.props.addrInfo = addrInfo;
            this.props.address = parseAccount(addrInfo.addr);
            this.paint();
            callFetchTransactionList(addrInfo.addr,currencyName).then(orginTxList => {
                this.parseTxList(orginTxList);
            });
        });
        
    }
}

// ==========================本地

// 当前钱包变化
register('wallet/currencyRecords',(currencyRecords: CurrencyRecord[]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateCurrencyRecords(currencyRecords);
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
