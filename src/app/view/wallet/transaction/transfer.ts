/**
 * 转账
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { dataCenter } from '../../../logic/dataCenter';
import { doScanQrCode } from '../../../logic/native';
import { fetchBtcFees, fetchGasPrices } from '../../../net/pull';
import { resendNormalTransfer, transfer, TxPayload } from '../../../net/pullWallet';
import { MinerFeeLevel, TxHistory } from '../../../store/interface';
import { register } from '../../../store/memstore';
import { doErrorShow } from '../../../utils/toolMessages';
// tslint:disable-next-line:max-line-length
import { fetchBalanceValueOfCoin, formatBalance, getCurrencyUnitSymbol, getCurrentAddrByCurrencyName, getCurrentAddrInfo, getStaticLanguage, judgeAddressAvailable, popNewLoading, popNewMessage, popPswBox, updateLocalTx } from '../../../utils/tools';
import { fetchMinerFeeList } from '../../../utils/walletTools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    tx?:TxHistory;
}

export class Transfer extends Widget {
    public ok:() => void;
    public language:any;
    public async setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public async init() {
        this.language = this.config.value[getLang()];
        if (this.props.currencyName === 'BTC') {
            fetchBtcFees();
        } else {
            fetchGasPrices();
        }
        const minerFeeList = fetchMinerFeeList(this.props.currencyName);
        const tx = this.props.tx;
        const curLevel:MinerFeeLevel = tx ? tx.minerFeeLevel + 1 : MinerFeeLevel.Standard;
        this.props = {
            ...this.props,
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName),
            toAddr:tx ? tx.toAddr : '',
            amount:tx ? tx.pay : 0,
            balance:formatBalance(getCurrentAddrInfo(this.props.currencyName).balance),
            minerFee:minerFeeList[curLevel].minerFee,
            minerFeeList,
            curLevel,
            minLevel:curLevel,
            inputDisabled:tx ? true : false,
            amountShow:'0.00',
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
    }

    public updateMinerFeeList() {
        const minerFeeList = fetchMinerFeeList(this.props.currencyName);
        this.props.minerFeeList = minerFeeList;
        this.props.minerFee = minerFeeList[this.props.curLevel].minerFee;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public speedDescClick() {
        popNew('app-components-allModalBox-modalBox1',this.language.modalBox);
    }
    // 到账速度
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
    // 收款地址变化
    public toAddrChange(e:any) {
        this.props.toAddr = e.value;
        this.paint();
    }

    // 转账金额变化
    public amountChange(e:any) {
        this.props.amount = e.value;
        const amountShow = formatBalance(fetchBalanceValueOfCoin(this.props.currencyName,e.value));
        this.props.amountShow =  amountShow === 0 ? '0.00' :amountShow;
        this.paint();
    }

    // 转账
    public async nextClick() {
        if (!this.props.toAddr) {
            popNewMessage(this.language.tips[0]);

            return;
        }
        if (!Number(this.props.amount)) {
            popNewMessage(this.language.tips[1]);

            return;
        }

        if (ERC20Tokens[this.props.currencyName]) {
            if (this.props.balance < Number(this.props.amount) || this.props.minerFee > getCurrentAddrInfo('ETH').balance) {
                popNewMessage(this.language.tips[2]);
    
                return;
            }
        } else {
            if (this.props.balance < Number(this.props.amount) + this.props.minerFee) {
                popNewMessage(this.language.tips[2]);
    
                return;
            }
        }
        
        if (!judgeAddressAvailable(this.props.currencyName,this.props.toAddr)) {
            popNewMessage(this.language.tips[3]);

            return;
        }

        const minerFeeLevel = this.props.curLevel;
        const currencyName = this.props.currencyName;
        const fromAddr = this.props.fromAddr;
        const toAddr = this.props.toAddr;
        const pay = Number(this.props.amount);
        const txPayload:TxPayload = {
            fromAddr,    
            toAddr,      
            pay,        
            currencyName,
            fee:this.props.minerFee,            
            minerFeeLevel 
        };
        const passwd = await popPswBox();
        if (!passwd) return;
        let ret;
        if (!this.props.tx) {
            const loading = popNewLoading(getStaticLanguage().transfer.loading);
            transfer(passwd,txPayload).then(([err,tx]) => {
                if (!err) {
                    updateLocalTx(tx);
                    dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
                    popNewMessage(getStaticLanguage().transfer.transSuccess);
                    popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
                    this.ok && this.ok();
                } else {
                    doErrorShow(err);
                }
                loading.callback(loading.widget);
            });
        } else {
            const tx = { ...this.props.tx };
            tx.minerFeeLevel = minerFeeLevel;
            ret = await resendNormalTransfer(passwd,tx);
            if (ret) {
                this.ok && this.ok();
            }
        }
        
    }

    /**
     * 扫描二维码
     */
    public doScanClick() {
        if (this.props.tx) return;
        doScanQrCode((res) => {
            console.log(res);
            this.props.toAddr = res;
            this.paint();
        });
    }

}

// gasPrice变化
register('third/gasPrice',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});

// btcMinerFee变化
register('third/btcMinerFee',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});
