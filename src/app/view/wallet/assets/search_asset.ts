/**
 * 搜索货币
 */
import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet, setLocalStorage } from "../../../utils/tools";

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
        let currencys = this.state.list[index];
        currencys.isChoose = true;
        this.paint();

        // 处理search数据
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);
        let showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.name);
        if (oldIndex < 0) {
            showCurrencys.push(currencys.name)
            wallet.showCurrencys = showCurrencys;

            setLocalStorage("wallets", wallets, true);
        }

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