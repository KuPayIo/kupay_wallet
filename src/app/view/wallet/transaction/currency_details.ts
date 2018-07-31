/**
 * 货币详情
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../core/eth/tokens';
import { dataCenter } from '../../../store/dataCenter';
import { register,unregister } from '../../../store/store';
import {
    currencyExchangeAvailable, effectiveCurrency, effectiveCurrencyNoConversion, 
    formatBalance, getAddrById, getCurrentWallet, getLocalStorage, parseAccount, parseDate
} from '../../../utils/tools';
import { Wallet } from '../../interface';

interface Props {
    currencyName: string;
}

interface State {
    list: any[];
    currentAddr: string;
    balance: number;
    showBalance: string;
    showBalanceConversion: string;
    canCurrencyExchange:boolean;
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
        register('wallets',this.registerWalletsFun);
        register('addrs',this.registerAddrsFun);
        
        const data = currencyExchangeAvailable();
        const dataList = [];
        data.forEach(element => {
            dataList.push(element.symbol);
        });
        const wallets = getLocalStorage('wallets');
        
        const wallet = getCurrentWallet(wallets);

        this.state = {
            list: [], 
            currentAddr: '', 
            balance: 0, 
            showBalance: `0 ${this.props.currencyName}`, 
            showBalanceConversion: '≈0.00 CNY',
            canCurrencyExchange:dataList.indexOf(this.props.currencyName) >= 0 
        };
        this.resetCurrentAddr(wallet, this.props.currencyName);
        this.parseBalance();
        this.parseTransactionDetails();

        // 启动定时器，每10秒更新一次记录
        this.openCheck();

    }
    public destroy() {
        unregister('wallets',this.registerWalletsFun);
        unregister('addrs',this.registerAddrsFun);
        
        return super.destroy();
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
        popNew('app-view-currencyExchange-currencyExchange',{ currencyName: this.props.currencyName });
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
            currencyName:this.props.currencyName,
            currencyBalance: this.state.balance,
            addr: this.state.currentAddr
        });
    }

    /**
     * 解析交易详情
     */
    public  parseTransactionDetails() {
        if (!this.state.currentAddr) return;

        let list = dataCenter.getAllTransactionsByAddr(this.state.currentAddr, this.props.currencyName);
        list = list.map(v => {
            const pay =  effectiveCurrencyNoConversion(v.value, this.props.currencyName, true);
            // tslint:disable-next-line:max-line-length
            const fees =  effectiveCurrencyNoConversion(v.fees, ERC20Tokens[this.props.currencyName] ? 'ETH' : this.props.currencyName, true);
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
                showPay:pay.show,
                currencyName: this.props.currencyName
            };
        });

        const addr = getAddrById(this.state.currentAddr,this.props.currencyName);
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
        const info = dataCenter.getAddrInfoByAddr(this.state.currentAddr,this.props.currencyName);
        // console.log('parseBalance',info);
        const r = effectiveCurrency(info.balance, this.props.currencyName, 'CNY', false);
        this.state.balance = r.num;
        this.state.showBalance = r.show;
        this.state.showBalanceConversion = r.conversionShow;
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

    private registerWalletsFun = (wallets:any) => {
        const wallet = getCurrentWallet(wallets);
        if (!wallet) return;
        this.resetCurrentAddr(wallet, this.props.currencyName);
        this.parseBalance();
        this.parseTransactionDetails();
        this.paint();
    }

    private registerAddrsFun = (addrs:any) => {
        if (addrs.length === 0) return;
        this.parseTransactionDetails();
        this.paint();
    }
}
