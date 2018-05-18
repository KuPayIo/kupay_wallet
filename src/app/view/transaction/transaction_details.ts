import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

interface Props {
    pay: string;
    result: string
    getAddr: string;
    tip: string;
    info: string;
    setAddr: string
    time: string;
    id: string;
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
        this.state = { title: "交易详情" }
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

}
