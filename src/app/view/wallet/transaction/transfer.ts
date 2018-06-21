/**
 * 处理转账逻辑
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Api as BtcApi } from '../../../core/btc/api';
import { BTCWallet } from '../../../core/btc/wallet';
import { Api as EthApi } from '../../../core/eth/api';
import { GaiaWallet } from '../../../core/eth/wallet';
import {
    decrypt, effectiveCurrencyStableConversion, eth2Wei, getAddrById, getCurrentWallet
    , getLocalStorage, parseAccount, parseDate, resetAddrById
} from '../../../utils/tools';

interface Props {
    currencyBalance: string;
    fromAddr: string;
    currencyName: string;
    rate: any;
}

interface States {
    title: string;
    fromShow: string;
    to: string;

    pay: number;
    payConversion: string;
    gasPrice: number;
    gasLimit: number;
    fees: number;
    feesShow: string;
    feesConversion: string;
    info: string;
    urgent: boolean;
}

export class AddAsset extends Widget {
    public props: Props;
    public state: States;

    public ok: () => void;

    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        this.state = {
            title: '转账',
            fromShow: parseAccount(this.props.fromAddr),
            to: '',
            pay: 0,
            payConversion: `≈0.00 CNY`,
            gasPrice: 100000000,
            gasLimit: 21000,
            fees: 0,
            feesShow: '',
            feesConversion: '',
            info: '',
            urgent: false
        };

        // todo 这是测试地址
        if (this.props.currencyName === 'ETH') {
            this.state.to = '0xa6e83b630BF8AF41A9278427b6F2A35dbC5f20e3';
        } else if (this.props.currencyName === 'BTC') {
            this.state.to = 'mw8VtNKY81RjLz52BqxUkJx57pcsQe4eNB';
            this.state.gasPrice = 1;
        }

        this.resetFees();
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理下一步
     */
    public doNext() {
        if (!this.state.to) {
            popNew('app-components-message-message', { itype: 'warn', content: '请输入收款地址', center: true });

            return;
        }
        if (!this.state.pay) {
            popNew('app-components-message-message', { itype: 'warn', content: '请输入转账金额', center: true });

            return;
        }

        // tslint:disable-next-line:no-this-assignment
        const thisObj = this;

        popNew('app-components-message-messagebox', {
            itype: 'prompt', title: '输入密码', placeHolder: '密码', inputType: 'password'
        }, async (r: any) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const psw = decrypt(wallet.walletPsw);
            if (r === psw) {
                try {
                    let id: any;
                    if (this.props.currencyName === 'ETH') {
                        id = await doEthTransfer(thisObj.props.fromAddr, thisObj.state.to, psw, thisObj.state.gasPrice
                            , thisObj.state.gasLimit, eth2Wei(thisObj.state.pay), thisObj.state.info, thisObj.state.urgent);
                    } else if (this.props.currencyName === 'BTC') {
                        id = await doBtcTransfer(thisObj.props.fromAddr, thisObj.state.to, psw, thisObj.state.gasPrice
                            , thisObj.state.gasLimit, thisObj.state.pay, thisObj.state.info, thisObj.state.urgent);
                    }

                    // 打开交易详情界面
                    thisObj.showTransactionDetails(id);
                    thisObj.doClose();
                } catch (error) {
                    console.log(error.message);
                    if (error.message.indexOf('insufficient funds') >= 0) {
                        popNew('app-components-message-message', { itype: 'error', content: '余额不足', center: true });
                    } else {
                        popNew('app-components-message-message', { itype: 'error', content: error.message, center: true });
                    }
                }
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误', center: true });
            }
        });
    }

    /**
     * 收款地址改变
     */
    public onToChange(e: any) {
        this.state.to = e.value;
    }

    /**
     * 收款金额改变
     */
    public onPayChange(e: any) {
        const num = parseFloat(e.value) || 0;
        this.state.pay = num;

        const r = effectiveCurrencyStableConversion(num, 'ETH', 'CNY', false, this.props.rate);
        this.state.payConversion = r.conversionShow;
        this.paint();
    }

    /**
     * 备注信息改变
     */
    public onInfoChange(e: any) {
        this.state.info = e.value;
        // let gas = await api.estimateGas({ to: acct2, data: e.value });
        // console.log(gas);
    }
    /**
     * 显示交易详情
     */
    public showTransactionDetails(id: number) {
        const t = new Date();
        const record = {
            id: id,
            type: '转账',
            fromAddr: this.props.fromAddr,
            to: this.state.to,
            pay: this.state.pay,
            tip: this.state.feesShow,
            time: t.getTime(),
            showTime: parseDate(t),
            result: '交易中',
            info: this.state.info || '无',
            currencyName: this.props.currencyName
        };

        popNew('app-view-wallet-transaction-transaction_details', record);

        addRecord(this.props.currencyName, this.props.fromAddr, record);

    }

    public changeUrgent(e: any, t: any) {
        this.state.urgent = t;
        this.paint();

        this.resetFees();
    }

    private resetFees() {
        let price = this.state.gasPrice;
        if (this.state.urgent) {
            price *= 2;
        }
        const r = effectiveCurrencyStableConversion(price * this.state.gasLimit, this.props.currencyName, 'CNY', true, this.props.rate);

        this.state.fees = r.num;
        this.state.feesShow = r.show;
        this.state.feesConversion = r.conversionShow;
        this.paint();
    }

}

/**
 * 添加记录
 */
const addRecord = (currencyName, currentAddr, record) => {
    const addr = getAddrById(currentAddr);
    if (!addr) return;
    addr.record.push(record);

    resetAddrById(currentAddr, addr, true);
};

/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doEthTransfer(acct1: string, acct2: string, psw: string, gasPrice: number, gasLimit: number
    , value: number, info: string, urgent: boolean) {
    const api = new EthApi();
    if (urgent) gasPrice *= 2;
    const nonce = await api.getTransactionCount(acct1);
    const txObj = {
        to: acct2,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        data: info
    };

    const gwlt = getGwltByAddr(acct1);
    if (!gwlt) return;

    const tx = gwlt.signRawTransaction(psw, txObj);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const id = await api.sendRawTransaction(tx);

    return id;
}

/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doBtcTransfer(acct1: string, acct2: string, psw: string, gasPrice: number, gasLimit: number
    , value: number, info: string, urgent: boolean) {

    const addrs = getLocalStorage('addrs');
    const addr = addrs.filter(v => v.addr === acct1)[0];

    const gwlt = BTCWallet.fromJSON(addr.gwlt, psw);
    gwlt.unlock(psw);
    await gwlt.init();
    const output = {
        toAddr: acct2,
        amount: value,
        chgAddr: acct1
    };
    console.log(gwlt, value);

    const id = await gwlt.spend(output, urgent ? 'high' : 'medium');
    gwlt.lock(psw);

    return id;

}

/**
 * 获取钱包 
 */
const getGwltByAddr = (addr) => {
    const currentAddr = getAddrById(addr);
    if (!currentAddr) return;

    return GaiaWallet.fromJSON(currentAddr.gwlt);
};