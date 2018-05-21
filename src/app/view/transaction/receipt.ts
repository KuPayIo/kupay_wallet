import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

interface Props {
    currencyBalance: string;
    addr: string
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
        this.state = { title: "收款" }
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理复制地址
     */
    public doCopy() {
        //todo 这里处理地址拷贝
    }

}
