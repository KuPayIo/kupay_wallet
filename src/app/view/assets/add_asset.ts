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
            title: "添加资产",
            list: [{
                name: "ETH",
                description: "Ethereum",
                isChoose: true
            }]
        }
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理查找
     */
    public doSearch() {
        popNew("app-view-assets-search_asset", { list: this.state.list })
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange(e, index) {
        console.log("onSwitchChange", e, index)
        this.state.list[index].isChoose = e.newType;
        
        // todo 这里处理数据变化
    }

}