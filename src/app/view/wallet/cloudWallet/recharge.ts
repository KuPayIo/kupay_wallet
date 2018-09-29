/**
 * Recharge
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { estimateMinerFee, recharge, resendRecharge } from '../../../net/pullWallet';
import { MinerFeeLevel, TransRecordLocal, TxStatus, TxType } from '../../../store/interface';
import { timeOfArrival } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { fetchBtcMinerFee, fetchGasPrice, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, getLanguage, popNewMessage, popPswBox } from '../../../utils/tools';
import { sat2Btc, wei2Eth } from '../../../utils/unitTools';
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
        const cn = (this.props.currencyName === 'ETH' || ERC20Tokens[this.props.currencyName]) ? 'ETH' : 'BTC';
        const toa = timeOfArrival[cn];
        const list = [];
        for (let i = 0;i < toa.length;i++) {
            const obj = {
                ...toa[i],
                minerFee:'0.000000'
            };
            list.push(obj);
        }
        const tx = this.props.tx;
        console.log(tx);
        const curLevel:MinerFeeLevel = tx ? tx.minerFeeLevel + 1 : MinerFeeLevel.STANDARD;
        this.state = {
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName),
            amount:tx ? tx.pay : 0,
            balance:getCurrentAddrBalanceByCurrencyName(this.props.currencyName),
            minerFee:list[curLevel].minerFee,
            minerFeeList:list,
            curLevel,
            minLevel:curLevel,
            inputDisabled:tx ? true : false,
            cfgData:getLanguage(this)
        };
        this.updateMinerFeeList();
        
    }
    // 更新矿工费
    public async updateMinerFeeList() {
        const cn = (this.props.currencyName === 'ETH' || ERC20Tokens[this.props.currencyName]) ? 'ETH' : 'BTC';
        const toa = timeOfArrival[cn];
        const list = [];
        const obj = await estimateMinerFee(this.props.currencyName);
        const gasLimit = obj.gasLimit;
        // const btcMinerFee = obj.btcMinerFee;
        for (let i = 0;i < toa.length;i++) {
            const obj = {
                ...toa[i],
                // tslint:disable-next-line:max-line-length
                minerFee: cn === 'ETH' ? wei2Eth(gasLimit * fetchGasPrice(toa[i].level)) : sat2Btc(fetchBtcMinerFee(toa[i].level))
            };
            list.push(obj);
        } 
        this.state.minerFeeList = list;
        this.state.minerFee = list[this.state.curLevel].minerFee;
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