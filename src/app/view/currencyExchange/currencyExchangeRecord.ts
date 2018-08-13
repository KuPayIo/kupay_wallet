/**
 * currency exchange records
 */
// ================================ 导入
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getTransactionsByAddr } from '../../net/pullWallet';
import { ShapeShiftTx, ShapeShiftTxs } from '../../store/interface';
import { find, register } from '../../store/store';
import { getCurrentAddrByCurrencyName,getCurrentAddrInfo, parseAccount, timestampFormat, wei2Eth } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    currencyName:string;
}
export class CurrencyExchangeRecord extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public async init() {
        this.state = {
            txsShow:[]
        };
        const close = popNew('pi-components-loading-loading',{ text:'加载中...' });
        const addr = getCurrentAddrByCurrencyName(this.props.currencyName);
        await getTransactionsByAddr(addr);
        close.callback(close.widget);
    }
    public backClick() {
        this.ok && this.ok();
    }
    public shapeShiftTxsUpdate(shapeShiftTxsMap:Map<string,ShapeShiftTxs>) {
        const addr = getCurrentAddrByCurrencyName(this.props.currencyName).toLowerCase();
        const shapeShiftTxs = shapeShiftTxsMap.get(addr);
        console.log('shapeShiftTxs===========',shapeShiftTxs);
        const txs = shapeShiftTxs && shapeShiftTxs.list || [];
        txs.sort((tx1,tx2) => {
            return tx2.timestamp - tx1.timestamp;
        });
        const txsShow = [];
        txs.forEach((tx:ShapeShiftTx) => {
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
            txsShow.push({
                ...tx,
                inputTXID_show:parseAccount(tx.inputTXID),
                outputTXID_show:tx.status === 'complete' && parseAccount(tx.outputTXID),
                timestamp_show:timestampFormat(tx.timestamp * 1000),
                status_show,
                status_class
            });
        });
        this.state.txsShow = txsShow;
        this.paint();
        if (txsShow.length === 0) {
            popNew('app-components-message-message', { itype: 'success', center: true, content: '暂无兑换记录' });
        }
    }

    public inHashClick(e:any,index:number) {
        const tx = this.state.txList[index];
        const inHash = tx.inputTXID;
        const transactions = find('transactions');
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
                    showTime: timestampFormat(item.time),
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
        const transactions = find('transactions');
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
                    showTime: timestampFormat(item.time),
                    id: item.hash,
                    currencyName:tx.outputCurrency
                };
            }
        });
        if (!record) return;
        popNew('app-view-wallet-transaction-transaction_details',{ ...record });
    }
}

// =================================本地

register('shapeShiftTxsMap', shapeShiftTxsMap => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.shapeShiftTxsUpdate(shapeShiftTxsMap);
    }
});