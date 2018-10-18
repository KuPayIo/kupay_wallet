/**
 * 转账
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { doScanQrCode } from '../../../logic/native';
import { fetchBtcFees, fetchGasPrices } from '../../../net/pull';
import { resendNormalTransfer, transfer } from '../../../net/pullWallet';
import { MinerFeeLevel, TransRecordLocal, TxStatus, TxType } from '../../../store/interface';
import { register } from '../../../store/store';
// tslint:disable-next-line:max-line-length
import { fetchMinerFeeList, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, getLanguage, judgeAddressAvailable, popPswBox } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    tx?:TransRecordLocal;
}
export class Transfer extends Widget {
    public ok:() => void;
    public async setProps(props:Props,oldProps:Props) {
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
            toAddr:tx ? tx.toAddr : '',
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
    // 收款地址变化
    public toAddrChange(e:any) {
        this.state.toAddr = e.value;
        this.paint();
    }

    // 转账金额变化
    public amountChange(e:any) {
        this.state.amount = e.value;
        this.paint();
    }

    // 转账
    public async nextClick() {
        if (!this.state.toAddr) {
            popNew('app-components1-message-message', {  content: this.state.cfgData.tips[0] });

            return;
        }
        if (!this.state.amount) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[1] });

            return;
        }

        if (this.state.balance < Number(this.state.amount) + this.state.minerFee) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[2] });

            return;
        }
        if (!judgeAddressAvailable(this.props.currencyName,this.state.toAddr)) {
            popNew('app-components1-message-message', {  content: this.state.cfgData.tips[3] });

            return;
        }

        const minerFeeLevel = this.state.curLevel;
        const currencyName = this.props.currencyName;
        const fromAddr = this.state.fromAddr;
        const toAddr = this.state.toAddr;
        const pay = Number(this.state.amount);
        const passwd = await popPswBox();
        if (!passwd) return;
        const t = new Date();
        const tx:TransRecordLocal = {
            hash:'',
            addr:fromAddr,
            txType:TxType.TRANSFER,
            fromAddr,
            toAddr,
            pay: pay,
            time: t.getTime(),
            status:TxStatus.PENDING,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName,
            fee: this.state.minerFee,
            nonce:undefined,
            minerFeeLevel
        };
        let ret;
        if (!this.props.tx) {
            ret = await transfer(passwd,tx);
        } else {
            const tx = { ...this.props.tx };
            tx.minerFeeLevel = minerFeeLevel;
            ret = await resendNormalTransfer(passwd,tx);
        }
        if (ret) {
            this.ok && this.ok();
        }
    }

    /**
     * 扫描二维码
     */
    public doScanClick() {
        if (this.props.tx) return;
        doScanQrCode((res) => {
            console.log(res);
            this.state.toAddr = res;
            this.paint();
        });
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