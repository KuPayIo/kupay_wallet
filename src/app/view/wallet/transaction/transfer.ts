/**
 * 处理转账逻辑
 */
import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { decrypt, getLocalStorage, getCurrentWallet, wei2Eth, eth2Wei, setLocalStorage, parseAccount, parseDate, effectiveCurrencyStableConversion, getAddrById, resetAddrById } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";
import { Api } from "../../../core/eth/api";

interface Props {
    currencyBalance: string;
    from: string;
    currencyName: number
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
            title: "转账",
            fromShow: parseAccount(this.props.from),
            to: "0xa6e83b630BF8AF41A9278427b6F2A35dbC5f20e3",
            pay: 0,
            payConversion: `≈￥0.00`,
            gasPrice: 100000000,
            gasLimit: 21000,
            fees: 0,
            feesShow: "",
            feesConversion: "",
            info: "",
            urgent: false
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
            popNew("app-components-message-message", { type: "warn", content: "请输入收款地址", center: true });
            return
        }
        if (!this.state.pay) {
            popNew("app-components-message-message", { type: "warn", content: "请输入转账金额", center: true });
            return
        }

        let thisObj = this;

        popNew("app-components-message-messagebox", { type: "prompt", title: "输入密码", placeHolder: "密码" }, async function (r) {
            let wallets = getLocalStorage("wallets");
            const wallet = getCurrentWallet(wallets);
            let psw = decrypt(wallet.walletPsw)
            if (r === psw) {
                try {
                    let id = await doTransfer(wallet, thisObj.props.from, thisObj.state.to, psw, thisObj.state.gasPrice, thisObj.state.gasLimit
                        , eth2Wei(thisObj.state.pay), thisObj.props.currencyName, thisObj.state.info, thisObj.state.urgent)
                    //打开交易详情界面
                    thisObj.showTransactionDetails(id, wallet)
                    thisObj.doClose()
                } catch (error) {
                    console.log(error.message)
                    popNew("app-components-message-message", { type: "error", content: error.message, center: true })
                }
            }
        }, () => { })
    }

    /**
     * 收款地址改变
     */
    public onToChange(e) {
        this.state.to = e.value
    }

    /**
     * 收款金额改变
     */
    public onPayChange(e) {
        let num = parseFloat(e.value) || 0;
        this.state.pay = num;

        let r = effectiveCurrencyStableConversion(num, "ETH", "CNY", false, this.props.rate);
        this.state.payConversion = r.conversionShow;
        this.paint();
    }

    /**
     * 备注信息改变
     */
    public onInfoChange(e) {
        this.state.info = e.value;
        // let gas = await api.estimateGas({ to: acct2, data: e.value });
        // console.log(gas);
    }
    /**
     * 显示交易详情
     */
    public showTransactionDetails(id, wallet) {
        let t = new Date();
        var record = {
            id: id,
            type: "转账",
            from: this.props.from,
            to: this.state.to,
            pay: this.state.pay + this.state.fees,
            tip: this.state.feesShow,
            time: t.getTime(),
            showTime: parseDate(t),
            result: "交易中",
            info: this.state.info || "无"
        }
        popNew("app-view-wallet-transaction-transaction_details", record)

        addRecord(this.props.currencyName, this.props.from, record)

    }

    public changeUrgent(e, t) {
        this.state.urgent = t;
        this.paint();

        this.resetFees();
    }

    private resetFees() {
        let price = this.state.gasPrice;
        if (this.state.urgent) {
            price *= 2;
        }
        let r = effectiveCurrencyStableConversion(price * this.state.gasLimit, "ETH", "CNY", true, this.props.rate);

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
    let addr = getAddrById(currentAddr);
    if (!addr) return
    addr.record.push(record)

    resetAddrById(this.state.currentAddr, addr, true);
}


/**
 * 处理转账
 */
async function doTransfer(wallet, acct1, acct2, psw, gasPrice, gasLimit, value, currencyName, info, urgent) {
    let api = new Api();
    if (urgent) gasPrice *= 2;
    let nonce = await api.getTransactionCount(acct1);
    let txObj = {
        to: acct2,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        data: info
    }

    let gwlt = getGwltByAddr(acct1)
    if (!gwlt) return

    let tx = gwlt.signRawTransaction(psw, txObj);
    let id = await api.sendRawTransaction(tx);
    return id;
}

/**
 * 获取钱包
 */
const getGwltByAddr = (addr) => {
    let currentAddr = getAddrById(addr)
    if (!currentAddr) return
    return GaiaWallet.fromJSON(currentAddr.gwlt);
}