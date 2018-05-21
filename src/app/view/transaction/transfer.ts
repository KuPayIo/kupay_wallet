import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

interface Props {
    currencyBalance: string;
    setAddr: string
}



export class AddAsset extends Widget {
    public props: Props;

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
            setAddrShow: parseAccount(this.props.setAddr),
            getAddr: "",
            pay: "",
            payConversion: conversion(0),
            fees: 0.002,
            feesShow: "0.002 ETH",
            feesConversion: conversion(0.002),
            info: "",
        }
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
        //todo 这里进行当前验证，处理下一步
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: this.state.setAddrShow }, (r) => {
            //todo 这里需要验证密码是否正确
            //todo 处理转账逻辑
            //todo 通知交易数据改变
            console.log(r)
            //todo 这里获取相信的交易信息
            let id = "0Xdffef52654d5f45d1f2s1f5sd1f5s1d2fs121d51sf2sd1f2s1f2s1f21f2sf12dfsdfsfsdfsfs15454f'd's'f'd"
            this.showTransactionDetails(id)
            //打开交易详情界面
            this.doClose()
        }, () => { })
    }

    /**
     * 收款地址改变
     */
    public onGetAddrChange(e) {
        this.state.getAddr = e.value
    }

    /**
     * 收款金额改变
     */
    public onPayChange(e) {
        console.log(e.value)
        let num = parseFloat(e.value);
        this.state.pay = num || 0;
        this.state.payConversion = conversion(num);
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
    public showTransactionDetails(id) {

        popNew("app-view-transaction-transaction_details", {
            pay: `-${this.state.pay + this.state.fees}`,
            result: "交易中",
            getAddr: this.state.getAddr,
            tip: this.state.feesShow,
            info: this.state.info || "无",
            setAddr: this.props.setAddr,
            time: parseDate(new Date()),
            id: id
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

/**
 * 转化价格
 * @param num 
 */
const conversion = (num: number) => {
    if (!num || num <= 0) return "￥ 0.00";
    return `≈￥ ${num * 60}`;
}

/**
 * 转化显示时间
 * @param t 
 */
const parseDate = (t: Date) => {
    return `${t.getUTCFullYear()}-${t.getUTCMonth() + 1}-${t.getUTCDate()} ${t.getHours()}:${t.getMinutes()}`;
}