/**
 * 转账
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { estimateMinerFee, transfer } from '../../../net/pullWallet';
import { MinerFeeLevel, priorityMap, TransRecordLocal, TxStatus } from '../../../store/interface';
import { timeOfArrival } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { addRecord, fetchGasPrice, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, popPswBox } from '../../../utils/tools';
import { wei2Eth } from '../../../utils/unitTools';

interface Props {
    currencyName:string;
}
export class Transfer extends Widget {
    public ok:() => void;
    public async setProps(props:Props,oldProps:Props) {
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
        const curLevel:MinerFeeLevel = MinerFeeLevel.STANDARD;
        this.state = {
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName),
            toAddr:'',
            amount:0,
            balance:getCurrentAddrBalanceByCurrencyName(this.props.currencyName),
            minerFee:list[curLevel].minerFee,
            minerFeeList:list,
            curLevel
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
        const btcMinerFee = obj.btcMinerFee;
        for (let i = 0;i < toa.length;i++) {
            const obj = {
                ...toa[i],
                // tslint:disable-next-line:max-line-length
                minerFee: cn === 'ETH' ? wei2Eth(gasLimit * fetchGasPrice(toa[i].level)) : btcMinerFee[priorityMap[toa[i].level]]
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
        popNew('app-components-modalBox-modalBox1',{ title:'到账速度',content:'到账速度受矿工费影响，缺少到账速度说明文字',tips:'转账时不能全部转完，要预留出矿工费' });
    }

    public chooseMinerFee() {
        popNew('app-components-modalBox-chooseModalBox',{ 
            currencyName:this.props.currencyName,
            minerFeeList:this.state.minerFeeList,
            curLevel:this.state.curLevel },(index) => {
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
        this.state.amount = Number(e.value);
        this.paint();
    }

    // 转账
    public async nextClick() {
        if (!this.state.toAddr) {
            popNew('app-components-message-message', { itype: 'warn', content: '请输入收款地址', center: true });

            return;
        }
        if (!this.state.amount) {
            popNew('app-components-message-message', { itype: 'warn', content: '请输入转账金额', center: true });

            return;
        }

        if (this.state.balance < this.state.amount + this.state.minerFee) {
            popNew('app-components-message-message', { itype: 'warn', content: '余额不足', center: true });

            return;
        }

        const gasPrice = fetchGasPrice(this.state.curLevel);
        const currencyName = this.props.currencyName;
        const fromAddr = this.state.fromAddr;
        const toAddr = this.state.toAddr;
        const pay = this.state.amount;
        const passwd = await popPswBox();
        if (!passwd) return;
        const loading = popNew('app-components1-loading-loading', { text: '交易中...' });
        const ret = await transfer(passwd,fromAddr,toAddr,gasPrice,pay,currencyName);
        if (!ret) {
            loading.callback(loading.widget);

            return;
        }
        // 打开交易详情界面
        this.showTransactionDetails(ret.hash,ret.nonce,this.state.curLevel);
        loading.callback(loading.widget);
        popNew('app-components-message-message',{ content:'转账成功' });
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(hash: string,nonce:number,minerFeeLevel:MinerFeeLevel) {
        const t = new Date();
        const tx:TransRecordLocal = {
            hash,
            txType:1,
            fromAddr: this.state.fromAddr,
            toAddr: this.state.toAddr,
            pay: this.state.amount,
            time: t.getTime(),
            status:TxStatus.PENDING,
            confirmBlock: 0,
            info: '',
            currencyName: this.props.currencyName,
            fee: this.state.minerFee,
            nonce,
            minerFeeLevel
        };

        popNew('app-view-wallet-transaction-transactionDetails', { tx });
        addRecord(this.props.currencyName, this.state.fromAddr, tx);
        this.ok && this.ok();

    }
}