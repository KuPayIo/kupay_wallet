import { Widget } from "../../../pi/widget/widget";

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
                name: "货币",
                description: "货币描述",
                isChoose: true
            }, {
                name: "货币1",
                description: "货币描述1",
                isChoose: true
            }, {
                name: "货币2",
                description: "货币描述2",
                isChoose: false
            }, {
                name: "货币3",
                description: "货币描述3",
                isChoose: false
            }, {
                name: "货币4",
                description: "货币描述4",
                isChoose: false
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
        console.log("doSearch")
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange(e, index) {
        console.log("onSwitchChange", e, index)
    }

}