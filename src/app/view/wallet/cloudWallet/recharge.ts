/**
 * Recharge
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import {  callFetchBtcFees, callFetchGasPrices,callFetchMinerFeeList, callGetCurrentAddrInfo } from '../../../middleLayer/wrap';
import { MinerFeeLevel, TxHistory, TxStatus, TxType } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { formatBalance } from '../../../publicLib/tools';
import { popNewMessage, popPswBox } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
import { recharge, resendRecharge } from '../../../viewLogic/localWallet';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    currencyName:string;
    tx?:TxHistory;
}
export class Recharge extends Widget {
    public props:any;
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public async init() {
        this.language = this.config.value[getLang()];
        if (this.props.currencyName === 'BTC') {
            callFetchBtcFees();
        } else {
            callFetchGasPrices();
        }
       
        const tx = this.props.tx;
        console.log(tx);
        const curLevel:MinerFeeLevel = tx ? tx.minerFeeLevel + 1 : MinerFeeLevel.Standard;
        let topBarTitle = '';
        if (this.props.currencyName === 'KT') {
            topBarTitle = getModulConfig('KT_SHOW');
        } else {
            topBarTitle = this.props.currencyName;
        }
        this.props = {
            ...this.props,
            topBarTitle,
            fromAddr:'',
            amount:tx ? tx.pay : 0,
            balance:formatBalance(0),
            minerFee:0,
            minerFeeList:[],
            curLevel,
            minLevel:curLevel,
            inputDisabled:tx ? true : false
        };
        Promise.all([callFetchMinerFeeList(this.props.currencyName),
            callGetCurrentAddrInfo(this.props.currencyName)]).then(([minerFeeList,addrInfo]) => {
                this.props.minerFeeList = minerFeeList;
                this.props.minerFee = minerFeeList[this.props.curLevel].minerFee;
                this.props.fromAddr = addrInfo.addr;
                this.props.balance = formatBalance(addrInfo.balance);
                this.paint();
            });
    }
    public updateMinerFeeList() {
        callFetchMinerFeeList(this.props.currencyName).then(minerFeeList => {
            this.props.minerFeeList = minerFeeList;
            this.props.minerFee = minerFeeList[this.props.curLevel].minerFee;
            this.paint();
        });
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public speedDescClick() {
        popNew('app-components-allModalBox-modalBox1',this.language.modalBox);
    }

     // 提币金额变化
    public amountChange(e:any) {
        this.props.amount = e.value;
        this.paint();
    }

    // 选择矿工费
    public chooseMinerFee() {
        popNew('app-components-allModalBox-chooseModalBox',{ 
            currencyName:this.props.currencyName,
            minerFeeList:this.props.minerFeeList,
            curLevel:this.props.curLevel,
            minLevel:this.props.minLevel },(index) => {
                this.props.curLevel = this.props.minerFeeList[index].level;
                this.props.minerFee = this.props.minerFeeList[index].minerFee;
                this.paint();
            });
    }

    // 转账
    public async nextClick() {
        if (!this.props.amount) {
            popNewMessage(this.language.tips[0]);

            return;
        }

        if (this.props.balance < Number(this.props.amount) + this.props.minerFee) {
            popNewMessage(this.language.tips[1]);

            return;
        }
        const minerFeeLevel = this.props.curLevel;
        const currencyName = this.props.currencyName;
        const fromAddr = this.props.fromAddr;
        const pay = Number(this.props.amount);
        const passwd = await popPswBox();
        if (!passwd) return;
        const t = new Date();
        const oldTx = this.props.tx;
        const tx:TxHistory = {
            hash:'',
            txType:TxType.Recharge,
            fromAddr,
            toAddr: '',
            pay,
            time: t.getTime(),
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName: currencyName,
            fee: this.props.minerFee,
            nonce:oldTx && oldTx.nonce,
            minerFeeLevel,
            addr:fromAddr
        };
        let ret;
        if (this.props.tx) {
            tx.hash = this.props.tx.hash;
            ret = await resendRecharge(passwd,tx);
        } else {
            ret = await recharge(passwd,tx);
        }
        
        if (ret) {
            this.ok && this.ok();
        }
    }
}

// gasPrice变化
registerStoreData('third/gasPrice',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});

// btcMinerFee变化
registerStoreData('third/btcMinerFee',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});