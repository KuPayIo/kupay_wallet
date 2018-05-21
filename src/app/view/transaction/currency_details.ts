import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getCurrentWallet, getLocalStorage } from "../../utils/tools";

interface Props {
    currencyName: string;
    currencyBalance: string
    currencyBalanceConversion: string;
}



export class AddAsset extends Widget {
    public props: Props;

    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);

        this.state = {
            list: getTransactionDetails(wallet)
        }

    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理选择地址
     */
    public doSearch() {
        popNew("app-view-transaction-choose_address")
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e, index) {
        //todo 这里获取相信的交易信息
        let each = this.state.list[index];
        let getAddr = "0x58b0b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586";
        let setAddr = "0x58b0b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586";
        let tip = "0.0000200 ETH";
        let info = "无"
        let id = "0Xdffef52654d5f45d1f2s1f5sd1f5s1d2fs121d51sf2sd1f2s1f2s1f21f2sf12dfsdfsfsdfsfs15454f'd's'f'd"
        popNew("app-view-transaction-transaction_details", {
            pay: `${each.type === '收款' ? '+' : '-'}${each.pay}`,
            result: each.result,
            getAddr: getAddr,
            tip: tip,
            info: info,
            setAddr: setAddr,
            time: each.time,
            id: id
        })
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
        //todo 这里获取地址
        let addr = "1xdfsdfsfsdfgdsfgsddfg4d54g5sdg2sfgdsfgsddfg4d54g5sdg2sg4d54g5sdg2s";
        
        popNew("app-view-transaction-transfer", {
            currencyBalance: this.props.currencyBalance,
            setAddr: addr
        })
    }

    /**
     * 处理收款
     */
    public doReceipt() {
        //todo 这里获取地址
        let addr = "1xdfsdfsfsdfgdsfgsddfg4d54g5sdg2sfgdsfgsddfg4d54g5sdg2sg4d54g5sdg2s";
        popNew("app-view-transaction-receipt", {
            currencyBalance: this.props.currencyBalance,
            addr: addr
        })
    }


}


/**
 * 解析显示的账号信息
 * @param str 
 */
const parseAccount = (str: string) => {
    if (str.length <= 29) return str;
    return `${str.slice(0, 13)}...${str.slice(str.length - 13, str.length)}`;
}

const getTransactionDetails = (wallet) => {
    if (!wallet.transactionDetails) return [];

    //todo 获取交易记录
    // //显示18位  21位判断  9
    // this.state.list.push({
    //     type: "收款",
    //     account: parseAccount("0x58b0b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586"),
    //     pay: "0.0002 ETH",
    //     time: "2018-02-02 14:00:00",
    //     result: "交易成功"
    // });
    // this.state.list.push({
    //     type: "转账",
    //     account: parseAccount("0x58b0b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586b586b0b586"),
    //     pay: "0.0002 ETH",
    //     time: "2018-02-02 14:00:00",
    //     result: "交易中"
    // });
}