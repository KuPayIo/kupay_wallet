/**
 * 充值页面
 */
// ==============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getBankAddr, getCloudBalance, getRechargeLogs, rechargeToServer } from '../../../net/pull';
import { sendRawTransactionETH, signRawTransactionETH } from '../../../net/pullWallet';
import { GasPriceLevel, TransRecordLocal } from '../../../store/interface';
import { find } from '../../../store/store';
import { defaultGasLimit } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { addRecord, fetchGasPrice,getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, parseDate, popPswBox } from '../../../utils/tools';
import { eth2Wei, wei2Eth } from '../../../utils/unitTools';
// ===============================================导出
interface Props {
    currencyName:string;
}
export class Charge extends Widget {
    public ok:() => void;
    public constructor() {
        super();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init(): void {
        this.state = {
            amount:0,// 充值输入值
            serviceCharge:wei2Eth(defaultGasLimit * fetchGasPrice(GasPriceLevel.STANDARD)),// 手续费
            localBalance:getCurrentAddrBalanceByCurrencyName(this.props.currencyName),// 本地余额
            isFeeEnough:false
        };
        this.judgeFeeEnough();
    }
    public backClick() {
        this.ok && this.ok();
    }
    public chargeChange(e:any) {
        this.state.amount = Number(e.value);
        this.judgeFeeEnough();
        this.paint();
    }
    public judgeFeeEnough() {
        const amount = this.state.amount;
        const serviceCharge = this.state.serviceCharge;
        const localBalance = this.state.localBalance;
        if ((amount + serviceCharge) > localBalance || serviceCharge === localBalance) {
            this.state.isFeeEnough = false;
        } else {
            this.state.isFeeEnough = true;
        }
    }
    // 充值
    public async rechargeClick() {
        if (this.state.amount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入充值数量',center:true });

            return;
        }
        if (!this.state.isFeeEnough) {
            popNew('app-components-message-message',{ itype:'error',content:'余额不足',center:true });

            return;
        }
        const wallet = find('curWallet');
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
       
        console.time('recharge');
        const close = popNew('app-components_level_1-loading-loading', { text: '正在充值...' });
        const toAddr = await getBankAddr();
        if (!toAddr) {
            close.callback(close.widget);

            return;
        }
        const fromAddr = getCurrentAddrByCurrencyName(this.props.currencyName);
        // tslint:disable-next-line:max-line-length
        const obj = await signRawTransactionETH(passwd,fromAddr,toAddr,fetchGasPrice(GasPriceLevel.STANDARD),this.state.amount,'');
        if (!obj) {
            close.callback(close.widget);

            return;
        }
        const signedTX = obj.signedTx;
        const hash = `0x${obj.hash}`;
        const nonce = Number(obj.nonce);
        const pay = eth2Wei(this.state.amount);
        const canTransfer = await rechargeToServer(fromAddr,toAddr,hash,nonce,fetchGasPrice(GasPriceLevel.STANDARD),pay);
        if (!canTransfer) {
            close.callback(close.widget);

            return;
        }
        const h = await sendRawTransactionETH(signedTX);
        if (!h) {
            close.callback(close.widget);

            return;
        }
        close.callback(close.widget);
        popNew('app-components-message-message',{ itype:'success',content:'充值成功',center:true });
        this.state.amount = 0;
        this.paint();
        console.timeEnd('recharge');
        // 维护本地交易记录
        const t = new Date();
        const record:TransRecordLocal = {
            hash: h,
            type: '充值',
            fromAddr: fromAddr,
            toAddr: toAddr,
            pay: wei2Eth(pay),
            time: t.getTime(),
            showTime: parseDate(t),
            result: '交易中',
            info: '',
            currencyName: this.props.currencyName,
            fee: defaultGasLimit * wei2Eth(fetchGasPrice(GasPriceLevel.STANDARD)),
            nonce,
            gasPriceLevel:GasPriceLevel.STANDARD
        };
        addRecord(this.props.currencyName, fromAddr, record);
        getRechargeLogs();
        getCloudBalance();
        this.ok && this.ok();
    }

}