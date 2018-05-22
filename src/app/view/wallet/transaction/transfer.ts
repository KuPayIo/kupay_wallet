/**
 * 处理转账逻辑
 */
import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { decrypt, getLocalStorage, getCurrentWallet, wei2Eth, Eth2RMB, eth2Wei, setLocalStorage } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";
import { Api } from "../../../core/eth/api";

interface Props {
    currencyBalance: string;
    from: string;
    currencyName: number

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
            to: "",
            pay: 0,
            payConversion: `￥ 0.00`,
            gasPrice: 100000000,
            gasLimit: 21000,
            fees: 0,
            feesShow: "",
            feesConversion: "",
            info: "",
        }

        this.state.fees = wei2Eth(this.state.gasPrice * this.state.gasLimit);
        this.state.feesShow = `${this.state.fees} ETH`;
        this.state.feesConversion = `≈￥ ${Eth2RMB(this.state.fees)}`;
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
        // getTransaction(this.props.from,"0xfe62dd012daa0c8f1e753e91e1bf019868fa5541e4ea4f8b0eb9b52f554e8223");


        if (!this.state.to) {
            popNew("pi-components-message-message", { type: "warn", content: "请输入收款地址", center: true });
            return
        }
        if (!this.state.pay) {
            popNew("pi-components-message-message", { type: "warn", content: "请输入转账金额", center: true });
            return
        }


        //todo 这里进行当前验证，处理下一步
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: this.state.fromShow }, (r) => {
            //todo 这里需要验证密码是否正确
            //todo 处理转账逻辑
            //todo 通知交易数据改变
            let wallets = getLocalStorage("wallets");
            const wallet = getCurrentWallet(wallets);
            let psw = decrypt(wallet.walletPsw)
            if (r === psw) {
                try {
                    let id = doTransfer(wallet, this.props.from, this.state.to, psw, this.state.gasPrice, this.state.gasLimit, eth2Wei(this.state.pay))
                    // console.log(id)
                    //打开交易详情界面
                    this.showTransactionDetails(id, wallet)
                    this.doClose()
                } catch (error) {
                    console.log(error.message)
                    if (error.message.indexOf("insufficient funds") >= 0) {
                        popNew("pi-components-message-message", { type: "error", content: "余额不足", center: true })
                    }
                }
            }
        }, () => { })
    }

    private doNext1() {
        try {
            // let wallets = getLocalStorage("wallets");
            // const wallet = getCurrentWallet(wallets);
            // let psw = decrypt(wallet.walletPsw)
            // let id = doTransfer(wallet, this.props.from, this.state.to, psw, 100000000, 21000, 10000000000)
            // console.log(id)
            getAccount("0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1")
            getAccount(this.props.from)
            let id = sendTx(this.props.from)
            console.log(id)
            getAccount("0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1")
            getAccount(this.props.from)
        } catch (error) {
            console.log(error.message)
            if (error.message.indexOf("insufficient funds") >= 0) {
                popNew("pi-components-message-message", { type: "error", content: "余额不足", center: true })
            }
        }
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
        let num = parseFloat(e.value);
        this.state.pay = num || 0;
        this.state.payConversion = `≈￥ ${Eth2RMB(num)}`;
        this.paint();
    }

    /**
     * 备注信息改变
     */
    public onInfoChange(e) {
        this.state.info = e.value;
    }
    /**
     * 显示交易详情
     */
    public showTransactionDetails(id, wallet) {

        let api = new Api();
        let r = api.getTransaction(id)
        var record = {
            id: id,
            type: "转账",
            from: this.props.from,
            to: this.state.to,
            pay: this.state.pay + this.state.fees,
            tip: this.state.feesShow,
            time: parseDate(new Date()),
            result: "交易中",
            info: this.state.info || "无"
        }

        addRecord(this.props.currencyName, this.props.from, record)

        popNew("app-view-wallet-transaction-transaction_details", record)
    }

}

/**
 * 添加记录
 */
const addRecord = (currencyName, currentAddr, record) => {
    let wallets = getLocalStorage("wallets");
    const wallet = getCurrentWallet(wallets);
    if (!wallet.currencyRecords || !currencyName) return;

    let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0]
    if (!currencyRecord) return;

    let addr = currencyRecord.addrs.filter(v => v.addr === currentAddr)[0];
    if (!addr) return
    addr.record.push(record)

    setLocalStorage("wallets", wallets, true)
}


/**
 * 解析显示的账号信息
 * @param str 
 */
const parseAccount = (str: string) => {
    if (str.length <= 29) return str;
    return `${str.slice(0, 13)}...${str.slice(str.length - 13, str.length)}`;
}



/**
 * 转化显示时间
 * @param t 
 */
const parseDate = (t: Date) => {
    return `${t.getUTCFullYear()}-${t.getUTCMonth() + 1}-${t.getUTCDate()} ${t.getHours()}:${t.getMinutes()}`;
}

/**
 * 处理转账
 */
const doTransfer = (wallet, acct1, acct2, psw, gasPrice, gasLimit, value) => {
    let api = new Api();
    let nonce = api.getTransactionCount(acct1);

    let txObj = {
        to: acct2,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        data: ''
    }

    let gwlt = GaiaWallet.fromJSON(wallet.gwlt);

    let tx = gwlt.signRawTransaction(psw, txObj);

    return api.sendRawTransaction(tx);
}

const sendTx = (acct2) => {
    let acct1 = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
    // let acct2 = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"

    let sk1 = "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
    let sk2 = "6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1"

    let api = new Api();
    let nonce = api.getTransactionCount(acct1);

    let txObj = {
        to: acct2,
        nonce: nonce,
        gasPrice: 100000000,
        gasLimit: 21000,
        value: 10000000000,
        data: ''
    }

    let gwlt = GaiaWallet.fromPrivateKey("123", sk1);
    let tx = gwlt.signRawTransaction("123", txObj);

    return api.sendRawTransaction(tx);
}

const getAccount = (acct) => {
    let api = new Api();
    let r: any = api.getBalance(acct);
    console.log(r, r.toNumber())
}

const getTransaction = (acct1, hash) => {
    let api = new Api();
    let r;
    //获取交易数量
    // let r = api.getTransactionCount(acct1);
    r = api.getTransactionReceipt(hash)
    console.log(r)
}