/**
 * 搜索货币
 */
import { Widget } from "../../../pi/widget/widget";

interface Props {
    list: any[];
}
export class AddAsset extends Widget {
    public props: Props;

    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.state = { list: [] }
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理添加
     */
    public doAdd(e, index) {
        console.log("doSearch", e, index)
        this.state.list[index].isChoose = true;
        this.paint();
        // todo 这里处理search数据
    }

    /**
     * 处理滑块改变
     */
    public onInputChange(e) {
        let list = [];
        if (e.value) {
            list = this.props.list.filter(v => v.name.toLowerCase().indexOf(e.value.toLowerCase()) >= 0)
        }
        this.state.list = list;
        this.paint();
    }

}