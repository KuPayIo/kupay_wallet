/**
 * 货币详情
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Api } from '../../../core/eth/api';
import { register } from '../../../store/store';
import {
    effectiveCurrency, effectiveCurrencyNoConversion, getAddrById, getCurrentWallet, getLocalStorage, parseAccount, parseDate
    , resetAddrById, setLocalStorage, wei2Eth
} from '../../../utils/tools';
import { Wallet } from '../../interface';

interface Props {
    currencyName: string;
}

interface State {
    list: any[];
    currentAddr: string;
    currentAddrRecords: any[];
    balance: number;
    showBalance: string;
    showBalanceConversion: string;
}

export class AddAsset extends Widget {
    public props: Props;
    public state: State;
    public timerRef: number = 0;

    public ok: () => void;

    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        register('wallets', (wallets) => {
            const wallet = getCurrentWallet(wallets);
            if (!wallet) return;
            this.resetCurrentAddr(wallet, this.props.currencyName);
            this.parseBalance();
            this.parseTransactionDetails();
            this.paint();
        });
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);

        this.state = {
            list: [], currentAddr: '', currentAddrRecords: [], balance: 0, showBalance: `0 ${this.props.currencyName}`
            , showBalanceConversion: '≈￥0'
        };
        this.resetCurrentAddr(wallet, this.props.currencyName);
        this.parseBalance();
        this.parseTransactionDetails();

        // 启动定时器，每10秒更新一次记录
        this.openCheck();

    }

    /**
     * 处理关闭
     */
    public doClose() {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        this.ok && this.ok();
    }

    /**
     * 处理选择地址
     */
    public doSearch() {
        if (!this.state.currentAddr) {
            popNew('app-components-message-message', { type: 'notice', content: '敬请期待', center: true });

            return;
        }
        popNew('app-view-wallet-transaction-choose_address', { currencyName: this.props.currencyName });
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e: any, index: number) {
        popNew('app-view-wallet-transaction-transaction_details', this.state.list[index]);
    }

    /**
     * 显示简介
     */
    public showIntroduction() {
        // console.log("onSwitchChange", e, index)
        // this.state.list[index].isChoose = e.newType;

        // // todo 这里处理数据变化
    }

    /**
     * 处理转账
     */
    public async doTransfer() {
        if (!this.state.currentAddr) {
            popNew('app-components-message-message', { type: 'notice', content: '敬请期待', center: true });

            return;
        }
        const api = new Api();
        const rate: any = await api.getExchangeRate();
        popNew('app-view-wallet-transaction-transfer', {
            currencyBalance: this.state.balance,
            fromAddr: this.state.currentAddr,
            currencyName: this.props.currencyName,
            rate: rate
        });
    }

    /**
     * 处理收款
     */
    public doReceipt() {
        // todo 这里获取地址
        if (!this.state.currentAddr) {
            popNew('app-components-message-message', { type: 'notice', content: '敬请期待', center: true });

            return;
        }
        popNew('app-view-wallet-transaction-receipt', {
            currencyBalance: this.state.balance,
            addr: this.state.currentAddr
        });
    }

    public async parseTransactionDetails() {
        if (!this.state.currentAddr) return;

        const api = new Api();
        const r: any = await api.getAllTransactionsOf(this.state.currentAddr);

        const removeList = [];
        let list = r.result.map(v => {
            const pay = effectiveCurrencyNoConversion(parseFloat(v.value), 'ETH', true);
            const fees = effectiveCurrencyNoConversion(parseFloat(v.gasUsed) * parseFloat(v.gasPrice), 'ETH', true);
            const isHave = this.state.currentAddrRecords.some(v1 => v1.id === v.hash);
            if (isHave) removeList.push(v.hash);
            const isFromMe = v.from.toLowerCase() === this.state.currentAddr.toLowerCase();
            const isToMe = v.to.toLowerCase() === this.state.currentAddr.toLowerCase();
            const t = parseInt(v.timeStamp, 10) * 1000;
            // info--input  0x636573--ces

            return {
                id: v.hash,
                type: isFromMe ? (isToMe ? '自己' : '转账') : '收款',
                fromAddr: v.from,
                to: v.to,
                pay: pay.num + fees.num,
                tip: fees.show,
                time: t,
                showTime: parseDate(new Date(t)),
                result: '已完成',
                info: '无',
                account: parseAccount(isFromMe ? (isToMe ? v.from : v.to) : v.from),
                showPay: pay.show
            };
        });
        this.state.currentAddrRecords = this.state.currentAddrRecords.filter(v => removeList.indexOf(v.id) < 0);
        list = list.concat(this.state.currentAddrRecords.map(v => {
            v.account = parseAccount(v.to);
            v.showPay = `${v.pay} ${this.props.currencyName}`;

            return v;
        }));
        // console.log(list, r)

        this.state.list = list.sort((a, b) => b.time - a.time);
        this.paint();

        this.resetRecord(this.state.currentAddrRecords, false);

    }

    // tslint:disable-next-line:member-ordering
    public async parseBalance() {
        if (!this.state.currentAddr) return;
        const api = new Api();

        const balance: any = await api.getBalance(this.state.currentAddr);
        const r = await effectiveCurrency(balance, 'ETH', 'CNY', true);
        this.state.balance = r.num;
        this.state.showBalance = r.show;
        this.state.showBalanceConversion = r.conversionShow;
        this.paint();
    }

    private resetCurrentAddr(wallet: Wallet, currencyName: string) {
        if (!wallet.currencyRecords || !currencyName) return [];

        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        if (!currencyRecord) return [];

        this.state.currentAddr = currencyRecord.currentAddr || wallet.walletId;
        const currentAddr = getAddrById(this.state.currentAddr);
        this.state.currentAddrRecords = currentAddr ? currentAddr.record : [];
    }

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 10 * 1000);

        this.parseTransactionDetails();
    }

    private resetRecord(record: any, notified: boolean) {
        const addr = getAddrById(this.state.currentAddr);
        if (!addr) return;
        addr.record = record;
        resetAddrById(this.state.currentAddr, addr, notified);
    }
}
