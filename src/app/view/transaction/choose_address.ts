import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

export class AddAsset extends Widget {
    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        this.state = {
            list: [{ name: "地址1", balance: 0.001, isChoose: false }
                , { name: "地址2", balance: 0.001, isChoose: false }
                , { name: "地址3", balance: 0.001, isChoose: false }
                , { name: "地址4", balance: 0.001, isChoose: false }]
        }

        // todo 这里获取当前地址
        let currencyAddr = "地址1";
        this.state.list.map((v) => {
            if (currencyAddr == v.name) v.isChoose = true;
            return v;
        })
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
    public chooseAddr(e, index) {
        if (!this.state.list[index].isChoose) {
            //todo 这里出来地址切换
        }
        this.doClose()
    }

    /**
     * 处理添加地址
     */
    public addAddr(e, index) {
        popNew("pi-components-message-messagebox", { type: "prompt", title: "添加地址", content: "地址信息" }, (r) => {
            //todo 这里验证输入，并根据输入添加地址，且处理地址切换
            this.doClose();
        }, () => {
            this.doClose();
        })
    }

}
