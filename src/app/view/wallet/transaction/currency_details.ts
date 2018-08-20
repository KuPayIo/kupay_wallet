/**
 * 货币详情
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../core/eth/tokens';
import { dataCenter } from '../../../store/dataCenter';
import { Wallet } from '../../../store/interface';
import { find, register } from '../../../store/store';
import {
    currencyExchangeAvailable, effectiveCurrency, effectiveCurrencyNoConversion, getAddrById, parseAccount, parseDate
} from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

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
        const wallet = find('curWallet');

        this.state = {
            list: [],
            currentAddr: '',
            balance: 0,
            showBalance: `0 ${this.props.currencyName}`,
            showBalanceConversion: '≈0.00 CNY'
            
        };
        this.resetCurrentAddr(wallet, this.props.currencyName);
        this.parseBalance();
        this.parseTransactionDetails();

        // 启动定时器，每10秒更新一次记录
        this.openCheck();

    }

    public attach() {
        super.attach();
        // this.kLineInit();
        console.log('');
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
            popNew('app-components-message-message', { itype: 'notice', content: '敬请期待', center: true });

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
    public currencyExchangeClick() {
        // console.log("onSwitchChange", e, index)
        // this.state.list[index].isChoose = e.newType;

        // // todo 这里处理数据变化
        // 这里暂时作为币币兑换的入口
        popNew('app-view-currencyExchange-currencyExchange', { currencyName: this.props.currencyName });
    }

    /**
     * 处理转账
     */
    public async doTransfer() {
        if (!this.state.currentAddr) {
            popNew('app-components-message-message', { itype: 'notice', content: '敬请期待', center: true });

            return;
        }
        popNew('app-view-wallet-transaction-transfer', {
            currencyBalance: this.state.balance,
            fromAddr: this.state.currentAddr,
            currencyName: this.props.currencyName
        });
    }

    /**
     * 处理收款
     */
    public doReceipt() {
        // todo 这里获取地址
        if (!this.state.currentAddr) {
            popNew('app-components-message-message', { itype: 'notice', content: '敬请期待', center: true });

            return;
        }
        popNew('app-view-wallet-transaction-receipt', {
            currencyName: this.props.currencyName,
            currencyBalance: this.state.balance,
            addr: this.state.currentAddr
        });
    }

    /**
     * 解析交易详情
     */
    public parseTransactionDetails() {
        if (!this.state.currentAddr) return;

        let list = dataCenter.getAllTransactionsByAddr(this.state.currentAddr, this.props.currencyName);
        list = list.map(v => {
            const pay = effectiveCurrencyNoConversion(v.value, this.props.currencyName, true);
            // tslint:disable-next-line:max-line-length
            const fees = effectiveCurrencyNoConversion(v.fees, ERC20Tokens[this.props.currencyName] ? 'ETH' : this.props.currencyName, true);
            const isFromMe = v.from.toLowerCase() === this.state.currentAddr.toLowerCase();
            const isToMe = v.to.toLowerCase() === this.state.currentAddr.toLowerCase();

            return {
                id: v.hash,
                type: isFromMe ? (isToMe ? '自己' : '转账') : '收款',
                fromAddr: v.from,
                to: v.to,
                pay: pay.num,
                tip: fees.show,
                time: v.time,
                showTime: parseDate(new Date(v.time)),
                result: '已完成',
                info: v.info,
                account: parseAccount(isFromMe ? (isToMe ? v.from : v.to) : v.from).toLowerCase(),
                showPay: pay.show,
                currencyName: this.props.currencyName
            };
        });

        const addr = getAddrById(this.state.currentAddr, this.props.currencyName);
        let recordList = [];
        if (addr) {
            recordList = addr.record.map(v => {
                const pay = effectiveCurrencyNoConversion(v.pay, this.props.currencyName, false);

                v.account = parseAccount(v.to).toLowerCase();
                v.showPay = pay.show;

                return v;
            });
        }

        this.state.list = list.concat(recordList).sort((a, b) => b.time - a.time);
    }
    /**
     * 解析余额
     */
    public parseBalance() {
        if (!this.state.currentAddr) return;
        const info = dataCenter.getAddrInfoByAddr(this.state.currentAddr, this.props.currencyName);
        // console.log('parseBalance',info);
        const r = effectiveCurrency(info.balance, this.props.currencyName, 'CNY', false);
        this.state.balance = r.num;
        this.state.showBalance = r.show;
        this.state.showBalanceConversion = r.conversionShow;
    }
    /**
     * 钱包数据改变
     */
    public registerWalletsFun = () => {
        const wallet = find('curWallet');
        if (!wallet) return;
        this.resetCurrentAddr(wallet, this.props.currencyName);
        this.parseBalance();
        this.parseTransactionDetails();
        this.paint();
    }
    /**
     * 地址数据改变
     */
    public registerAddrsFun = (addrs: any) => {
        if (addrs.length === 0) return;
        this.parseTransactionDetails();
        this.paint();
    }
    private resetCurrentAddr(wallet: Wallet, currencyName: string) {
        if (!wallet.currencyRecords || !currencyName) return [];

        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        if (!currencyRecord) return [];

        this.state.currentAddr = currencyRecord.currentAddr || wallet.walletId;

    }

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 10 * 1000);

        this.parseTransactionDetails();
        this.parseBalance();
        this.paint();
        dataCenter.updatetTransaction(this.state.currentAddr, this.props.currencyName);
    }

}

// ============================== 本地

// ===================================================== 立即执行
register('curWallet', (resp) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.registerWalletsFun(resp);
    }
});

register('addrs', (resp) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.registerAddrsFun(resp);
    }
});
interface Props {
    currencyName: string;
}

interface State {
    list: any[];
    currentAddr: string;
    balance: number;
    showBalance: string;
    showBalanceConversion: string;
}