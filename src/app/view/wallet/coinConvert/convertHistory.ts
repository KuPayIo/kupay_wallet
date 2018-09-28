/**
 * convertHistory
 */
// =======================================导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getTransactionsByAddr } from '../../../net/pullWallet';
import { ShapeShiftTx, ShapeShiftTxs } from '../../../store/interface';
import { find, register } from '../../../store/store';
import { getCurrentAddrByCurrencyName, getCurrentAddrInfo, getLanguage, parseAccount, timestampFormat } from '../../../utils/tools';
// =========================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ConvertHistory extends Widget {
    public ok: () => void;
    
    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.init();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public async init() {
        this.state = {
            txsShow:[],
            cfgData:getLanguage(this)
        };
        const close = popNew('app-components1-loading-loading',{ text:this.state.cfgData.loading });
        const addr = getCurrentAddrByCurrencyName(this.props.currencyName);
        await getTransactionsByAddr(addr);
        close.callback(close.widget);
    }

    /**
     * 兑换历史记录更新
     */
    public shapeShiftTxsUpdate(shapeShiftTxsMap:Map<string,ShapeShiftTxs>) {
        const addr = getCurrentAddrByCurrencyName(this.props.currencyName).toLowerCase();
        const shapeShiftTxs = shapeShiftTxsMap.get(addr);
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
                status_show = this.state.cfgData.tips[1];
                status_class = '';
            } else if (tx.status === 'failed') {
                status_show = this.state.cfgData.tips[2];
                status_class = 'isActive';   // 做个标记，提醒
            } else {
                status_show = this.state.cfgData.tips[3];
                status_class = 'isActive';  // 做个标记，提醒
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
        
    }

    /**
     * 查看输出地址交易详情
     */
    public inHashClick(e:any,index:number) {
        const tx = this.state.txsShow[index];
        const inHash = tx.inputTXID;
        // const transactions = find('transactions');
        // let record = null;
        // transactions.forEach(item => {
        //     if (item.hash === inHash) {
        //         record = {
        //             tx:tx
        //         };
        //     }
        // });
        // if (!record) {
        //     const curAddrInfo = getCurrentAddrInfo(tx.inputCurrency);
        //     curAddrInfo.record.forEach(item => {
        //         if (item.id === inHash) {
        //             record = {
        //                 ...item
        //             };
        //         }
        //     });
        // }
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:inHash });
    }

    /**
     * 查看输入地址交易详情
     */
    public outHashClick(e:any,index:number) {
        const tx = this.state.txsShow[index];
        if (tx.status !== 'complete') return;
        const outHash = tx.outputTXID;
        // const transactions = find('transactions');
        // let record = null;
        // transactions.forEach(item => {
        //     if (item.hash === outHash) {
        //         record = {
        //             tx:tx
        //         };
        //     }
        // });
        // if (!record) return;
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:outHash });
    }
}

// =================================本地

register('shapeShiftTxsMap', shapeShiftTxsMap => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.shapeShiftTxsUpdate(shapeShiftTxsMap);
    }
});
