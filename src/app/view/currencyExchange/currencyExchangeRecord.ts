/**
 * currency exchange records
 */
import { shapeshift } from '../../../app/exchange/shapeshift/shapeshift';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { shapeshiftApiPrivateKey } from '../../utils/constants';
import { getCurrentAddrByCurrencyName,getCurrentAddrInfo,getLocalStorage, parseAccount, timestampFormat, wei2Eth } from '../../utils/tools';

interface tx {
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
        const outAddr = getCurrentAddrByCurrencyName(this.props.currencyName).toLowerCase();
        console.log('outAddr',outAddr);
        shapeshift.transactions(shapeshiftApiPrivateKey,outAddr, (err, transactions) => {
            console.log('transactions',transactions);
            if (err) return console.error(err);
            const txList = [];
            transactions.forEach((tx) => {
                // tslint:disable-next-line:variable-name
                let status_show = '';
                if (tx.status === 'complete') {
                    status_show = '兑换成功';
                } else if (tx.status === 'failed') {
                    status_show = '兑换失败';
                } else {
                    status_show = '兑换中';
                }
                txList.push({
                    ...tx,
                    inputTXID_show:parseAccount(tx.inputTXID),
                    outputTXID_show:parseAccount(tx.outputTXID),
                    timestamp_show:timestampFormat(tx.timestamp),
                    status_show
                });
            });
            this.state.txList = txList;
            console.log(this.state.txList);
            this.paint();
        });
        this.state = {
            txList:[]
        };
    }
    public backClick() {
        this.ok && this.ok();
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
                if (item.hash === inHash) {
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