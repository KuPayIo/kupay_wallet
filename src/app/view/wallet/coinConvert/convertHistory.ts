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
import { getStore } from '../../../store/memstore';
// =========================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

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
        this.getAllTransactions();
        this.close = popNew('app-components1-loading-loading',{ text:this.language.loading });
    }

    public async getAllTransactions() {
        const changellyPayinAddress = getStore('wallet/changellyPayinAddress');
        let txHistory = [];
        for (const tmp of changellyPayinAddress) {
            changellyGetTransactions(tmp.currencyName,tmp.payinAddress).then(res => {
                if (res.result) {
                    txHistory = txHistory.concat(res.result);
                    console.log(txHistory);
                    this.close && this.close.callback(this.close.widget);
                    this.paint();
                }
            });
        }
    }

    /**
     * 查看输出地址交易详情
     */
    public inHashClick(e:any,index:number) {
        const tx = this.props.txsShow[index];
        const inHash = tx.inputTXID;
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:inHash });
    }

    /**
     * 查看输入地址交易详情
     */
    public outHashClick(e:any,index:number) {
        const tx = this.props.txsShow[index];
        if (tx.status !== 'complete') return;
        const outHash = tx.outputTXID;
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:outHash });
    }
}

// =================================本地
