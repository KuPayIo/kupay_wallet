/**
 * 搜索货币
 */
import { Widget } from '../../../../pi/widget/widget';
import { find, updateStore } from '../../../store/store';

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
        this.state = { list: [],search:'' };
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
    public doAdd(e: any, index: number) {
        const currencys = this.state.list[index];
        currencys.isChoose = true;
        this.paint();

        // 处理search数据
        const wallet = find('curWallet');
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.name);
        if (oldIndex < 0) {
            showCurrencys.push(currencys.name);
            wallet.showCurrencys = showCurrencys;
            updateStore('curWallet', wallet);
        }

    }

    /**
     * 处理滑块改变
     */
    public onInputChange(e: any) {
        let list = [];
        if (e.value) {
            list = this.props.list.filter(v => v.name.toLowerCase().indexOf(e.value.toLowerCase()) >= 0);
            this.state.search = e.value.toUpperCase();
        }
        this.state.list = list;
        this.paint();
    }

}