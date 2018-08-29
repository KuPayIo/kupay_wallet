/**
 * 货币详情列表
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getBankAddr, rechargeToServer } from '../../../net/pull';
import { sendRawTransactionETH, signRawTransactionETH, transfer } from '../../../net/pullWallet';
import { GasPriceLevel, TransRecordLocal } from '../../../store/interface';
import { defaultGasLimit, resendInterval } from '../../../utils/constants';
import { addRecord, fetchGasPrice, fetchNextGasPriceLevel, parseDate, popPswBox } from '../../../utils/tools';
import { eth2Wei, wei2Eth } from '../../../utils/unitTools';

export class CurrencyDetailsList extends Widget {

    public ok: () => void;

    constructor() {
        super();
    }
    /**
     * 显示交易详情
     */
    public  showTransactionDetails(e: any, index: number) {
        const txRecord:TransRecordLocal = this.props.list[index];
        const sendTime = txRecord.time;
        const t = new Date().getTime();
        const intervel = t - sendTime;
        // tslint:disable-next-line:max-line-length
        const resend = txRecord.currencyName !== 'BTC' && txRecord.result === '交易中' && txRecord.gasPriceLevel !== GasPriceLevel.FASTEST && intervel > resendInterval;
        console.log('txRecord-----------------------',txRecord);
        if (resend) {
            resendTransfer(txRecord);
        } else {
            popNew('app-view-wallet-transaction-transaction_details', txRecord);
        }
        
    }

}

/**
 * 交易重发
 */
export const resendTransfer = (txRecord:TransRecordLocal) => {
    console.log('----------resendTransfer--------------');
    popNew('app-components-message-messagebox',{ itype:'confirm',title:'交易重发',
        content:'交易还未被确认,您确定要重发么?',center:true },async () => {
            const psw = await popPswBox();
            if (!psw) return;
            if (txRecord.type === '转账') {
                resendNormalTransfer(psw,txRecord);
            } else if (txRecord.type === '充值') {
                resendChargeTransfer(psw,txRecord);
            }
        },() => {
            popNew('app-view-wallet-transaction-transaction_details', txRecord);
        });
};
/**
 * 普通转账重发
 */
export const resendNormalTransfer = async (psw:string,txRecord:TransRecordLocal) => {
    console.log('----------resendNormalTransfer--------------');
    const loading = popNew('app-components_level_1-loading-loading', { text: '重发中...' });
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const nextGasPriceLevel = fetchNextGasPriceLevel(txRecord.gasPriceLevel);
    const gasPrice = fetchGasPrice(nextGasPriceLevel);
    const pay = txRecord.pay;
    const info = txRecord.info;
    const nonce = txRecord.nonce;
    const currencyName = txRecord.currencyName;
    const ret = await transfer(psw,fromAddr,toAddr,gasPrice,defaultGasLimit,pay,currencyName,info,nonce);
    if (!ret) {
        loading.callback(loading.widget);

        return;
    }
    loading.callback(loading.widget);
    const t = new Date();
    const record:TransRecordLocal = {
        ...txRecord,
        hash:ret.hash,
        gasPriceLevel:nextGasPriceLevel,
        time: t.getTime(),
        showTime: parseDate(t),
        fee: defaultGasLimit * wei2Eth(gasPrice)
    };
    popNew('app-view-wallet-transaction-transaction_details', record);

    addRecord(txRecord.currencyName, txRecord.fromAddr, record);
        
};

/**
 * 充值重发
 */
export const resendChargeTransfer = async (psw:string,txRecord:TransRecordLocal) => {
    const close = popNew('app-components_level_1-loading-loading', { text: '重发中...' });
    const toAddr = await getBankAddr();
    if (!toAddr) {
        close.callback(close.widget);

        return;
    }
    const fromAddr = txRecord.fromAddr;
    const nextGasPriceLevel = fetchNextGasPriceLevel(txRecord.gasPriceLevel);
    const gasPrice = fetchGasPrice(nextGasPriceLevel);
    const pay = txRecord.pay;
    const info = txRecord.info;
    const nonce = txRecord.nonce;
    const obj = await signRawTransactionETH(psw,fromAddr,toAddr,gasPrice,pay,info,nonce);
    if (!obj) {
        close.callback(close.widget);

        return;
    }
    const signedTX = obj.signedTx;
    const hash = `0x${obj.hash}`;
    const canTransfer = await rechargeToServer(fromAddr,toAddr,hash,nonce,gasPrice,eth2Wei(pay));
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
    popNew('app-components-message-message',{ itype:'success',content:'重发成功',center:true });
    // 维护本地交易记录
    const t = new Date();
    const record:TransRecordLocal = {
        ...txRecord,
        hash: h,
        time: t.getTime(),
        showTime: parseDate(t),
        fee: defaultGasLimit * wei2Eth(gasPrice),
        gasPriceLevel:nextGasPriceLevel
    };
    addRecord(txRecord.currencyName, fromAddr, record);
};