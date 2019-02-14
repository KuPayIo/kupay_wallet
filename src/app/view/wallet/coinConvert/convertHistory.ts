/**
 * convertHistory
 */
// =======================================导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { changellyGetTransactions } from '../../../net/pull3';
import { getStore, setStore } from '../../../store/memstore';
import { parseAccount, timestampFormat } from '../../../utils/tools';
// =========================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    currencyName:string;
    addr:string;
}

// 交易记录
interface ChangellyTransactionsShow {
    id:string;// 交易id
    currencyFrom:string;  // 出币类型
    currencyTo:string;   // 入币类型
    amountExpectedTo:string; // 计划入币数量
    amountExpectedFrom:string; // 计划出币数量
    rate:string;  // 汇率 
    timestamp:number;  // 时间戳
    timestamp_show:string;   // 时间
    status:string;    // 状态
    status_show:string;   // 状态show
    status_class:string;  // 状态css class
    payinHash:string;   // 出币hash
    payinHash_show:string;   // 出币hash展示
    payoutHash:string;   // 入币hash
    payoutHash_show:string;   // 入币hash展示

}
export class ConvertHistory extends Widget {
    public ok: () => void;
    public language:any;
    public close:any;
    
    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.init();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public async init() {
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            txsShow:[]
        };
        this.close = popNew('app-components1-loading-loading',{ text:this.language.loading });
        this.getAllTransactions();
    }

    public async getAllTransactions() {
        const changellyPayinAddress = getStore('wallet/changellyPayinAddress');
        let txHistory = [];
        const txPromises = [];
        for (const tmp of changellyPayinAddress) {
            if (tmp.currencyName === this.props.currencyName) {
                const txPromise = changellyGetTransactions(tmp.currencyName,tmp.payinAddress);
                txPromises.push(txPromise);
            }
        }

        try {
            const results = await Promise.all(txPromises);
            for (const res of results) {
                console.log(res.result);
                if (res.result) {
                    for (const result of res.result) {
                        // const payinHash = fetchLocalTxByHash1(result.payinHash);
                        const item:ChangellyTransactionsShow = {
                            id:result.id,
                            currencyFrom:result.currencyFrom.toUpperCase(),
                            currencyTo:result.currencyTo.toUpperCase(),   
                            rate:(Number(result.amountExpectedTo) / Number(result.amountExpectedFrom)).toFixed(8),
                            amountExpectedTo:result.amountExpectedTo,
                            amountExpectedFrom:result.amountExpectedFrom,
                            timestamp:result.createdAt,
                            timestamp_show:timestampFormat(result.createdAt * 1000),  
                            status:result.status,
                            status_show:this.parseStatus(result.status).status_show,  
                            status_class:this.parseStatus(result.status).status_class,   
                            payinHash:result.payinHash,   
                            payinHash_show:result.payinHash && parseAccount(result.payinHash),   
                            payoutHash:result.payoutHash,
                            payoutHash_show:result.payoutHash && parseAccount(result.payoutHash)
                        };
                        txHistory = txHistory.concat(item);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            this.close && this.close.callback(this.close.widget);
            this.props.txsShow = this.filterTxHistory(txHistory);
            this.paint();
        }
    }

    public filterTxHistory(txHistory:ChangellyTransactionsShow[]) {
        let changellyTempTxs = getStore('wallet/changellyTempTxs');
        const findIndexOf = (txId:string) => {
            let index = -1;
            for (let j = 0; j < txHistory.length;j++) {
                if (txHistory[j].id === txId) {
                    return index = j;
                }
            }
            
            return index;
        };
        const findTempTxsIndexOf = (txHash:string) => {
            let index = -1;
            for (let j = 0; j < changellyTempTxs.length;j++) {
                if (changellyTempTxs[j].hash === txHash) {
                    return index = j;
                }
            }
            
            return index;
        };
        changellyTempTxs = changellyTempTxs.filter(tmpTx => {
            const index = findIndexOf(tmpTx.id);
            const tx = txHistory[index];
            
            return (tx.status !== ChangellyStatus.Overdue) && (tx.status !== ChangellyStatus.Finished);

        });
        // 没有详细记录时使用临时记录
        for (let i = 0;i <  changellyTempTxs.length ;i++) {
            const tempTxs = changellyTempTxs[i];
            const tx = txHistory[findIndexOf(tempTxs.id)];
            if ((tx.payinHash && tx.payoutHash) && !tempTxs.hash) {   // 创建了多笔订单  但只有最后发送成功
                const index = findTempTxsIndexOf(tx.payinHash);
                if (index >= 0)  changellyTempTxs[index].hash = undefined;
            } else {
                tx.payinHash = tempTxs.hash;
                tx.payinHash_show = tempTxs.hash && parseAccount(tempTxs.hash);
            }
        }
            
        setStore('wallet/changellyTempTxs',changellyTempTxs);
        txHistory = txHistory.filter(tx => {
            return !!tx.payinHash;
        });
        txHistory.sort((tx1,tx2) => {
            return tx2.timestamp - tx1.timestamp;
        });

        return txHistory;
    }

    /**
     * 查看输出地址交易详情
     */
    public inHashClick(e:any,index:number) {
        const tx = this.props.txsShow[index];
        const inHash = tx.payinHash;
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:inHash });
    }

    /**
     * 查看输入地址交易详情
     */
    public outHashClick(e:any,index:number) {
        const tx = this.props.txsShow[index];
        if (tx.status !== ChangellyStatus.Finished) return;
        const outHash = tx.payoutHash;
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:outHash });
    }

    public parseStatus(status:string) {
        if (status === ChangellyStatus.Finished) {
            return {
                status_show:'兑换成功',
                status_class:''
            };
        } else if (status === ChangellyStatus.Failed || status === ChangellyStatus.Refunded || status === ChangellyStatus.Overdue) {
            return {
                status_show:'兑换失败',
                status_class:''
            };
        } else {
            return {
                status_show:'打包中',
                status_class:'confirming'
            };
        }
    }
}

/**
 * changelly 兑换状态
 */
enum ChangellyStatus {
    Waiting = 'waiting', // Transaction is waiting for an incoming payment.
    Confirming = 'confirming', // We have received payin and are waiting for certain amount of confirmations depending of incoming currency
    Exchanging = 'exchanging', // Payment was confirmed and is being exchanged.
    Sending = 'sending', // Coins are being sent to the recipient address.
    Finished = 'finished',// Coins were successfully sent to the recipient address.
    Failed = 'failed', // Transaction has failed.
    Refunded = 'refunded', // Exchange failed and coins were refunded to user's wallet. The wallet address should be provided by user.
    Overdue = 'overdue', // We did not receive any payment since 36 hours from transaction creation.
    Hold = 'hold' // Due to AML/KYC procedure, exchange may be delayed
}
