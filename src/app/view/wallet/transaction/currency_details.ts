import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getCurrentWallet, getLocalStorage, wei2Eth, parseAccount, setLocalStorage, effectiveCurrency, effectiveCurrencyNoConversion, parseDate } from "../../../utils/tools";
import { Api } from "../../../core/eth/api";
import { register } from "../../../store/store";

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
        register("wallets", (wallets) => {
            const wallet = getCurrentWallet(wallets);
            this.resetCurrentAddr(wallet, this.props.currencyName)
            this.parseBalance();
            this.parseTransactionDetails()
            this.paint();
        });
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);

        this.state = { list: [], currentAddr: "", currentAddrRecords: [], balance: 0, showBalance: "0 ETH", showBalanceConversion: "≈￥0" };
        this.resetCurrentAddr(wallet, this.props.currencyName)
        this.parseBalance();
        this.parseTransactionDetails()

        // 启动定时器，每10秒更新一次记录
        this.openCheck()

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
        popNew("app-view-wallet-transaction-choose_address", { currencyName: this.props.currencyName })
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e, index) {
        popNew("app-view-wallet-transaction-transaction_details", this.state.list[index])
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
    public doTransfer() {
        if (!this.state.currentAddr) return
        popNew("app-view-wallet-transaction-transfer", {
            currencyBalance: this.state.balance,
            from: this.state.currentAddr,
            currencyName: this.props.currencyName
        })
    }

    /**
     * 处理收款
     */
    public doReceipt() {
        //todo 这里获取地址
        if (!this.state.currentAddr) return
        popNew("app-view-wallet-transaction-receipt", {
            currencyBalance: this.state.balance,
            addr: this.state.currentAddr
        })
    }

    private resetCurrentAddr(wallet, currencyName) {
        if (!wallet.currencyRecords || !currencyName) return [];

        let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0]
        if (!currencyRecord) return [];

        this.state.currentAddr = currencyRecord.currentAddr || wallet.walletId;
        let currentAddr = currencyRecord.addrs.filter(v => v.addr === this.state.currentAddr)[0];
        this.state.currentAddrRecords = currentAddr ? currentAddr.record : [];
    }

    async parseTransactionDetails() {
        if (!this.state.currentAddr) return

        let api = new Api();
        let r: any = await api.getAllTransactionsOf(this.state.currentAddr);

        let removeList = [];
        let list = r.result.map(v => {
            let pay = effectiveCurrencyNoConversion(parseFloat(v.value), "ETH", true);
            let fees = effectiveCurrencyNoConversion(parseFloat(v.gasUsed) * parseFloat(v.gasPrice), "ETH", true);
            let isHave = this.state.currentAddrRecords.some(v1 => v1.id == v.hash);
            if (isHave) removeList.push(v.hash);
            let isFromMe = v.from.toLowerCase() === this.state.currentAddr.toLowerCase();
            let isToMe = v.to.toLowerCase() === this.state.currentAddr.toLowerCase();
            let t = parseInt(v.timeStamp) * 1000;
            //info--input  0x636573--ces
            return {
                id: v.hash,
                type: isFromMe ? (isToMe ? "自己" : "转账") : "收款",
                from: v.from,
                to: v.to,
                pay: pay.num + fees.num,
                tip: fees.show,
                time: t,
                showTime: parseDate(new Date(t)),
                result: "已完成",
                info: "无",
                account: parseAccount(isFromMe ? (isToMe ? v.from : v.to) : v.from),
                showPay: pay.show
            }
        })
        this.state.currentAddrRecords = this.state.currentAddrRecords.filter(v => removeList.indexOf(v.id) < 0);
        list = list.concat(this.state.currentAddrRecords.map(v => {
            v.account = parseAccount(v.to);
            v.showPay = `${v.pay} ETH`;
            return v
        }))
        // console.log(list, r)

        this.state.list = list.sort((a, b) => b.time - a.time);
        this.paint();

        this.resetRecord(this.state.currentAddrRecords, false)

    }

    async parseBalance() {
        if (!this.state.currentAddr) return
        let api = new Api();

        let balance: any = await api.getBalance(this.state.currentAddr);
        let r = await effectiveCurrency(balance, "ETH", "CNY", true);
        this.state.balance = r.num;
        this.state.showBalance = r.show;
        this.state.showBalanceConversion = r.conversionShow;
        this.paint();
    }

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 10 * 1000);

        this.parseTransactionDetails();
    }

    private resetRecord(record, notified) {
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);
        let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
        if (!currencyRecord) return;
        let addr = currencyRecord.addrs.filter(v => v.addr === this.state.currentAddr)[0];
        if (!addr) return
        addr.record = record;
        setLocalStorage("wallets", wallets, notified)
    }
}

