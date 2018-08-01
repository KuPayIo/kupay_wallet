/**
 * currency exchange records
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { dataCenter } from '../../store/dataCenter';
import { getCurrentAddrByCurrencyName,getCurrentAddrInfo,getLocalStorage, parseAccount, timestampFormat, wei2Eth } from '../../utils/tools';

interface Tx {
    hasConfirmations:boolean;
    inputAddress:string;
    inputAmount:number;
    inputCurrency:string;
    inputTXID:string;
    outputAddress:string;
    outputAmount:string;
    outputCurrency:string;
    outputTXID:string;
    shiftRate:string;
    status:string;
    timestamp:number;
}
interface Props {
    currencyName:string;
}
export class CurrencyExchangeRecord extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const txs = this.getSortedCurrencyExchangeTxs();
        const txList = [];
        txs.forEach((tx:Tx) => {
            // tslint:disable-next-line:variable-name
            let status_show = '';
            // tslint:disable-next-line:variable-name
            let status_class = '';
            if (tx.status === 'complete') {
                status_show = '兑换成功';
                status_class = 'ga-status-success';
            } else if (tx.status === 'failed') {
                status_show = '兑换失败';
                status_class = 'ga-status-failed';
            } else {
                status_show = '兑换中';
                status_class = 'ga-status-pending';
            }
            txList.push({
                ...tx,
                inputTXID_show:parseAccount(tx.inputTXID),
                outputTXID_show:tx.status === 'complete' && parseAccount(tx.outputTXID),
                timestamp_show:timestampFormat(tx.timestamp),
                status_show,
                status_class
            });
        });
        this.state = {
            txList
        };
    }
    public backClick() {
        this.ok && this.ok();
    }
    public getSortedCurrencyExchangeTxs() {
        const outAddr = getCurrentAddrByCurrencyName(this.props.currencyName).toLowerCase();
        const currencyExchangeTxs = getLocalStorage('currencyExchangeTxs') || {};
        const txs = currencyExchangeTxs[outAddr] || [];
        txs.sort((tx1,tx2) => {
            return tx2.timestamp - tx1.timestamp;
        });

        return txs;
    }
    public inHashClick(e:any,index:number) {
        const tx = this.state.txList[index];
        const inHash = tx.inputTXID;
        const transactions = getLocalStorage('transactions');
        let record = null;
        transactions.forEach(item => {
            if (item.hash === inHash) {
                record = {
                    pay: wei2Eth(item.value),
                    result: '已完成',
                    to: item.to,
                    tip: wei2Eth(item.fees),
                    info: item.info,
                    fromAddr: item.from,
                    showTime: timestampFormat(item.time / 1000),
                    id: item.hash,
                    currencyName:tx.inputCurrency
                };
            }
        });
        if (!record) {
            const curAddrInfo = getCurrentAddrInfo(tx.inputCurrency);
            curAddrInfo.record.forEach(item => {
                if (item.id === inHash) {
                    record = {
                        ...item
                    };
                }
            });
        }
        popNew('app-view-wallet-transaction-transaction_details',{ ...record });
    }

    public outHashClick(e:any,index:number) {
        const tx = this.state.txList[index];
        if (tx.status !== 'complete') return;
        const outHash = tx.outputTXID;
        const transactions = getLocalStorage('transactions');
        let record = null;
        transactions.forEach(item => {
            if (item.hash === outHash) {
                record = {
                    pay: wei2Eth(item.value),
                    result: '已完成',
                    to: item.to,
                    tip: wei2Eth(item.fees),
                    info: item.info,
                    fromAddr: item.from,
                    showTime: timestampFormat(item.time / 1000),
                    id: item.hash,
                    currencyName:tx.outputCurrency
                };
            }
        });
        if (!record) return;
        popNew('app-view-wallet-transaction-transaction_details',{ ...record });
    }
}