import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';

export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            currency1: "BTC",
            currency2: "ETH",
            isSelect: "buy",
            price: 7835.59,
            priceConversion: "≈51283.93 CNY",
            count: 1,
            all: 7835.59,
            allConversion: "￥51283.93",
            change: "-2.63%",
            buyList: [
                { price: 919.23, count: 0.010, schedule: 0.2 },
                { price: 919.16, count: 0.550, schedule: 0.8 },
                { price: 919.23, count: 0.010, schedule: 0.5 },
                { price: 919.16, count: 0.550, schedule: 0.6 },
                { price: 919.23, count: 0.010, schedule: 0.1 },
                { price: 919.16, count: 0.550, schedule: 0.4 },
                { price: 919.23, count: 0.010, schedule: 0.9 }
            ],
            saleList: [
                { price: 919.23, count: 0.010, schedule: 0.2 },
                { price: 919.16, count: 0.550, schedule: 0.8 },
                { price: 919.23, count: 0.010, schedule: 0.5 },
                { price: 919.16, count: 0.550, schedule: 0.6 },
                { price: 919.23, count: 0.010, schedule: 0.1 },
                { price: 919.16, count: 0.550, schedule: 0.4 },
                { price: 919.23, count: 0.010, schedule: 0.9 }
            ]
        }
    }


    public clkBuy(e, index) {
        this.state.isSelect = "buy";
        this.paint();
    }

    public clkSale(event: any) {
        this.state.isSelect = "sale";
        this.paint();
        // popNew("app-view-messageList-messageList");
    }

    /**
     * 显示K线图
     */
    public showKLine() {

    }

    /**
     * 更换货币信息
     */
    public changeCurrency() {

    }
}