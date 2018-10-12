/**
 * Recharge
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { fetchBtcFees, fetchGasPrices } from '../../../net/pull';
import { recharge, resendRecharge } from '../../../net/pullWallet';
import { MinerFeeLevel, TransRecordLocal, TxStatus, TxType } from '../../../store/interface';
import { register } from '../../../store/store';
import { fetchMinerFeeList, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, getLanguage, popNewMessage, popPswBox } from '../../../utils/tools';

// ============================导出
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    currencyName:string;
    tx?:TransRecordLocal;
}
export class Recharge extends Widget {
    public props:Props;
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public async init() {
        if (this.props.currencyName === 'BTC') {
            fetchBtcFees();
        } else {
            fetchGasPrices();
        }
        const minerFeeList = fetchMinerFeeList(this.props.currencyName);
        const tx = this.props.tx;
        console.log(tx);
        const curLevel:MinerFeeLevel = tx ? tx.minerFeeLevel + 1 : MinerFeeLevel.STANDARD;
        this.state = {
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName),
            amount:tx ? tx.pay : 0,
            balance:getCurrentAddrBalanceByCurrencyName(this.props.currencyName),
            minerFee:minerFeeList[curLevel].minerFee,
            minerFeeList,
            curLevel,
            minLevel:curLevel,
            inputDisabled:tx ? true : false,
            cfgData:getLanguage(this)
        };
        
    }
    public updateMinerFeeList() {
        const minerFeeList = fetchMinerFeeList(this.props.currencyName);
        this.state.minerFeeList = minerFeeList;
        this.state.minerFee = minerFeeList[this.state.curLevel].minerFee;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public speedDescClick() {
        popNew('app-components-modalBox-modalBox1',this.state.cfgData.modalBox);
    }

     // 提币金额变化
    public amountChange(e:any) {
        this.state.amount = Number(e.value);
        this.paint();
    }

    // 选择矿工费
    public chooseMinerFee() {
        popNew('app-components-modalBox-chooseModalBox',{ 
            currencyName:this.props.currencyName,
            minerFeeList:this.state.minerFeeList,
            curLevel:this.state.curLevel,
            minLevel:this.state.minLevel },(index) => {
                this.state.curLevel = this.state.minerFeeList[index].level;
                this.state.minerFee = this.state.minerFeeList[index].minerFee;
                this.paint();
            });
    }

    // 转账
    public async nextClick() {
        if (!this.state.amount) {
            popNewMessage(this.state.cfgData.tips[0]);

            return;
        }

        if (this.state.balance < this.state.amount + this.state.minerFee) {
            popNewMessage(this.state.cfgData.tips[1]);

            return;
        }
        const minerFeeLevel = this.state.curLevel;
        const currencyName = this.props.currencyName;
        const fromAddr = this.state.fromAddr;
        const pay = this.state.amount;
        const passwd = await popPswBox();
        if (!passwd) return;
        const t = new Date();
        const oldTx = this.props.tx;
        const tx:TransRecordLocal = {
            hash:'',
            txType:TxType.RECHARGE,
            fromAddr,
            toAddr: '',
            pay,
            time: t.getTime(),
            status:TxStatus.PENDING,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName: currencyName,
            fee: this.state.minerFee,
            nonce:oldTx && oldTx.nonce,
            minerFeeLevel,
            addr:fromAddr
        };
        let ret;
        if (this.props.tx) {
            tx.hash = this.props.tx.hash;
            ret = resendRecharge(passwd,tx);
        } else {
            ret = recharge(passwd,tx);
        }
        
        if (ret) {
            this.ok && this.ok();
        }
    }
}

// gasPrice变化
register('gasPrice',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});

// btcMinerFee变化
register('btcMinerFee',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});