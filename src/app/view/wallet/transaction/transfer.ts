/**
 * 处理转账逻辑
 */
import { QRCode } from '../../../../pi/browser/qrcode';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BtcApi } from '../../../core/btc/api';
import { BTCWallet } from '../../../core/btc/wallet';
import { Api as EthApi } from '../../../core/eth/api';
import { ERC20Tokens } from '../../../core/eth/tokens';
import { EthWallet } from '../../../core/eth/wallet';
import { GlobalWallet } from '../../../core/globalWallet';
import { dataCenter } from '../../../store/dataCenter';
import {
    decrypt, effectiveAddr, effectiveCurrencyStableConversion, eth2Wei, ethTokenMultiplyDecimals, getAddrById
    , getCurrentAddrInfo, getCurrentWallet, getLocalStorage, openBasePage, parseAccount, parseDate, resetAddrById, urlParams
} from '../../../utils/tools';

interface Props {
    currencyBalance: string;
    fromAddr: string;
    currencyName: string;
}

interface States {
    title: string;
    to: string;
    pay: number;
    payConversion: string;
    gasPrice: number;
    gasLimit: number;
    fees: number;
    feesConversion: string;
    info: string;
    showNote: boolean;
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
            to: '',
            pay: 0,
            payConversion: `0.00`,
            gasPrice: 4000000000,
            gasLimit: 21000,
            fees: 0,
            feesConversion: '',
            info: '',
            showNote: ERC20Tokens[this.props.currencyName] ? false : true
        };

        // todo 这是测试地址
        if (this.props.currencyName === 'ETH') {
            // this.state.to = '0xa6e83b630BF8AF41A9278427b6F2A35dbC5f20e3';
        } else if (this.props.currencyName === 'BTC') {
            // this.state.to = 'mw8VtNKY81RjLz52BqxUkJx57pcsQe4eNB';

            this.state.gasPrice = 10;
            // const defaultToAddr = 'mw8VtNKY81RjLz52BqxUkJx57pcsQe4eNB';
            // const defaultAmount = 0.001;
            // this.getBtcTransactionFee(defaultToAddr, defaultAmount).then(fee => {
            //     this.state.gasPrice = fee;
            //     this.state.gasLimit = 1;
            //     this.resetFees();
            // });
        } else if (ERC20Tokens[this.props.currencyName]) {
            this.state.gasLimit = 81000;
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
    public async doNext() {
        if (!this.state.to) {
            popNew('app-components-message-message', { itype: 'warn', content: '请输入收款地址', center: true });

            return;
        }
        if (!this.state.pay) {
            popNew('app-components-message-message', { itype: 'warn', content: '请输入转账金额', center: true });

            return;
        }

        const loading = popNew('pi-components-loading-loading', { text: '交易中...' });

        try {
            const fromAddr = this.props.fromAddr;
            const toAddr = this.state.to;
            const gasPrice = this.state.gasPrice;
            const gasLimit = this.state.gasLimit;
            const pay = this.state.pay;
            const info = this.state.info;
            const currencyName = this.props.currencyName;

            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, currencyName);
            if (addrIndex >= 0) {
                let id: any;
                const wlt = await GlobalWallet.createWlt(currencyName, passwd, wallet, addrIndex);
                if (currencyName === 'ETH') {
                    id = await doEthTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, eth2Wei(pay), info);
                } else if (currencyName === 'BTC') {
                    id = await doBtcTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, pay, info);
                } else if (ERC20Tokens[currencyName]) {
                    id = await doERC20TokenTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, pay, currencyName);
                }

                // 打开交易详情界面
                this.showTransactionDetails(id);
                this.doClose();
                this.topContactAdd(toAddr, currencyName);
            }
        } catch (error) {
            console.log(error.message);
            if (error.message.indexOf('insufficient funds') >= 0) {
                popNew('app-components-message-message', { itype: 'error', content: '余额不足', center: true });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: error.message, center: true });
            }
        }

        loading.callback(loading.widget);

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
        // tslint:disable-next-line:max-line-length
        const r = effectiveCurrencyStableConversion(num, ERC20Tokens[this.props.currencyName] ? 'ETH' : this.props.currencyName, 'CNY', false);
        this.state.payConversion = r.conversionShow;
        this.paint();
    }

    /**
     * 备注信息改变
     */
    public async onInfoChange(e: any) {
        this.state.info = e.value;
        const api = new EthApi();
        const gas = await api.estimateGas({ to: '0x9cd1a1031dd7125a80c7d121ae5b17bc39a77ef7', data: '0x123456' });
        console.log(gas);
    }

    /**
     * gas费用改变
     */
    public onGasFeeChange(e: any) {
        const val = Number(e.value);
        this.state.fees = val;
        // tslint:disable-next-line:max-line-length
        const r = effectiveCurrencyStableConversion(val, ERC20Tokens[this.props.currencyName] ? 'ETH' : this.props.currencyName, 'CNY', false);
        this.state.feesConversion = r.conversionShow;
        this.paint();
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
            time: t.getTime(),
            showTime: parseDate(t),
            result: '交易中',
            info: this.state.info || '无',
            currencyName: this.props.currencyName,
            tip: this.state.fees
        };

        popNew('app-view-wallet-transaction-transaction_details', record);

        addRecord(this.props.currencyName, this.props.fromAddr, record);

    }

    /**
     * 处理扫描
     */
    public doScan() {
        const qrcode = new QRCode();
        qrcode.init();
        qrcode.scan({
            success: (addr) => {
                const r = effectiveAddr(this.props.currencyName, addr);
                if (r[0]) {
                    const amount = urlParams(addr, 'amount');
                    if (amount) {
                        const num = parseFloat(amount);
                        this.state.pay = num;
                        // tslint:disable-next-line:max-line-length
                        const t = effectiveCurrencyStableConversion(num, ERC20Tokens[this.props.currencyName] ? 'ETH' : this.props.currencyName, 'CNY', false);
                        this.state.payConversion = t.conversionShow;
                    }
                    this.state.to = r[1];
                    this.paint();
                } else {
                    popNew('app-components-message-message', { itype: 'error', content: '无效的地址', center: true });
                }
                // alert(`scan result:${r}`);
            },
            fail: (r) => {
                // alert(`scan fail:${r}`);
                console.log(`scan fail:${r}`);
            }
        });
        qrcode.close({
            success: (r) => {
                // alert(`close result:${r}`);
                console.log(`close result:${r}`);
            }
        });
    }

    /**
     * 判断收款地址是否为常用联系人,不是则提示加入常用联系人
     */
    public topContactAdd(addresse: string, currencyName: string) {
        if (!currencyName) {
            return;
        }
        let isExist = false;
        const topContacts = dataCenter.getTopContacts(this.props.currencyName);
        for (let i = 0; i < topContacts.length; i++) {
            const v = topContacts[i];
            if (v.addresse === addresse && v.currencyName === currencyName) {
                isExist = true;
                break;
            } else {
                isExist = false;
            }
        }
        if (isExist) {
            return;
        } else {
            // 不存在常用联系人，提示是否添加
            popNew('app-view-mine-addressManage-messagebox', {
                mType: 'confirm', title: '是否添加联系人', text: '是否将此收币地址添加为常用地址', input1DefaultValue: addresse
            }, (data) => {
                const addresse = data.addresse;
                let tags = data.tags;
                if (!tags) {
                    tags = '默认地址';
                }
                dataCenter.addTopContacts(currencyName, addresse, tags);
                popNew('app-components-message-message', { itype: 'success', content: '添加常用联系人成功！', center: true });
            });
        }
    }

    private resetFees() {
        const price = this.state.gasPrice;
        // tslint:disable-next-line:max-line-length
        const r = effectiveCurrencyStableConversion(price * this.state.gasLimit, ERC20Tokens[this.props.currencyName] ? 'ETH' : this.props.currencyName, 'CNY', true);

        this.state.fees = r.num;
        this.state.feesConversion = r.conversionShow;
        this.paint();
    }
    // tslint:disable-next-line:only-arrow-functions
    private async getBtcTransactionFee(toAddr: string, amount: number, priority: 'high' | 'medium' | 'low' = 'medium') {
        const addrInfo = getCurrentAddrInfo('BTC');
        const output = {
            toAddr: toAddr,
            amount: amount,
            chgAddr: addrInfo.addr
        };
        const wlt = BTCWallet.fromJSON(addrInfo.wlt);
        wlt.unlock();
        await wlt.init();

        const retArr = await wlt.buildRawTransaction(output, priority);
        wlt.lock();

        return retArr[1];
    }

}

/**
 * 添加记录
 */
const addRecord = (currencyName, currentAddr, record) => {
    const addr = getAddrById(currentAddr, currencyName);
    if (!addr) return;
    addr.record.push(record);

    resetAddrById(currentAddr, currencyName, addr, true);
};

/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doEthTransfer(wlt: EthWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, info: string) {
    const api = new EthApi();
    const nonce = await api.getTransactionCount(acct1);
    const txObj = {
        to: acct2,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        data: info
    };

    // const currentAddr = getAddrById(acct1, 'ETH');
    // if (!currentAddr) return;

    // const wlt = EthWallet.fromJSON(currentAddr.wlt);

    const tx = wlt.signRawTransaction(txObj);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const id = await api.sendRawTransaction(tx);

    return id;
}

/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doBtcTransfer(wlt: BTCWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, info: string) {
    const addrs = getLocalStorage('addrs');
    const addr = addrs.filter(v => v.addr === acct1)[0];
    const output = {
        toAddr: acct2,
        amount: value,
        chgAddr: acct1
    };
    wlt.unlock();
    await wlt.init();

    const retArr = await wlt.buildRawTransaction(output, 'medium');
    wlt.lock();
    const rawHexString: string = retArr[0];
    const fee = retArr[1];

    // tslint:disable-next-line:no-unnecessary-local-variable
    const hash = await BtcApi.sendRawTransaction(rawHexString);

    return hash.txid;

}

/**
 * 处理eth代币转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doERC20TokenTransfer(wlt: EthWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, currencyName: string) {

    const api = new EthApi();
    const nonce = await api.getTransactionCount(acct1);
    console.log('nonce', nonce);
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, acct2, ethTokenMultiplyDecimals(value, currencyName));
    const txObj = {
        to: ERC20Tokens[currencyName],
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: 0,
        data: transferCode
    };

    // const currentAddr = getAddrById(acct1, currencyName);
    // if (!currentAddr) return;

    // const wlt = EthWallet.fromJSON(currentAddr.wlt);

    const tx = wlt.signRawTransaction(txObj);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const id = await api.sendRawTransaction(tx);

    return id;
}
