import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';

export class KLine extends Widget {
    public ok: () => void;
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
            open: 916.10,
            close: 916.10,
            done: 120.981,
            high: 916.10,
            low: 916.10,
            time: "10.24.17 4:00:01 PM",
            blance: "766.1.8991",
            up: "-3.19%",
            list: [
                { buyCount: 0.01, buyPrice: 919.23, salePrice: 919.23, saleCount: 0.01 },
                { buyCount: 0.55, buyPrice: 919.16, salePrice: 919.16, saleCount: 0.55 },
                { buyCount: 0.01, buyPrice: 919.23, salePrice: 919.23, saleCount: 0.01 },
                { buyCount: 0.55, buyPrice: 919.16, salePrice: 919.16, saleCount: 0.55 },
                { buyCount: 0.01, buyPrice: 919.23, salePrice: 919.23, saleCount: 0.01 },
                { buyCount: 0.55, buyPrice: 919.16, salePrice: 919.16, saleCount: 0.55 },
                { buyCount: 0.01, buyPrice: 919.23, salePrice: 919.23, saleCount: 0.01 },
                { buyCount: 0.55, buyPrice: 919.16, salePrice: 919.16, saleCount: 0.55 },
                { buyCount: 0.01, buyPrice: 919.23, salePrice: 919.23, saleCount: 0.01 },
                { buyCount: 0.55, buyPrice: 919.16, salePrice: 919.16, saleCount: 0.55 },
                { buyCount: 0.01, buyPrice: 916.73, salePrice: 919.23, saleCount: 0.01 },
                { buyCount: 0.55, buyPrice: 916.71, salePrice: 919.16, saleCount: 0.55 },
                { buyCount: 0.01, buyPrice: 916.73, salePrice: 919.23, saleCount: 0.01 }
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
        popNew("app-view-exchange-choose", {}, (r) => {
            if (r) {
                this.state.currency1 = r.currency1;
                this.state.currency2 = r.currency2;
                this.paint();
            }
        });
    }

    public backPrePage(event: any) {
        this.ok && this.ok()
    }
}