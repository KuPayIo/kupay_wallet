import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';

export class Home extends Widget {
    public ok: (r) => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            menuList: ["ETH", "BTC", "GAIA"],
            resultList: [],
            initResultList: [
                [
                    { icon: "../../res/image/BTC.png", name: "BTC/ETH", currency1: "BTC", currency2: "ETH" },
                    { icon: "../../res/image/GAIA.WORLD.png", name: "GAIA/ETH", currency1: "GAIA", currency2: "ETH" }
                ],
                [
                    { icon: "../../res/image/ETH.png", name: "ETH/BTC", currency1: "ETH", currency2: "BTC" },
                    { icon: "../../res/image/GAIA.WORLD.png", name: "GAIA/BTC", currency1: "GAIA", currency2: "BTC" }
                ],
                [
                    { icon: "../../res/image/ETH.png", name: "ETH/GAIA", currency1: "ETH", currency2: "GAIA" },
                    { icon: "../../res/image/BTC.png", name: "BTC/GAIA", currency1: "BTC", currency2: "GAIA" }
                ]
            ],
            select: null
        };

        this.state.resultList = this.state.initResultList[0]
    }

    public choose(e, index) {
        this.state.select = this.state.resultList[index]
        this.close();
    }

    public close() {
        this.ok && this.ok(this.state.select)
    }

    public onTabsChange(e) {
        this.state.resultList = this.state.initResultList[e.value]
        this.paint();
    }

}