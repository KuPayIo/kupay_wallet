/**
 * 货币添加
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find, updateStore } from '../../../store/store';

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
        const wallet = find('curWallet');
        const currencyList = find('currencyList');

        const showCurrencys = (wallet && wallet.showCurrencys) || [];

        this.state = {
            title: '添加资产',
            currencyList: currencyList,
            list: currencyList.map(v => {
                v.isChoose = showCurrencys.indexOf(v.name) >= 0;

                return v;
            })
        };
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
        popNew('app-view-wallet-assets-search_asset', { list: this.state.list });
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange(e: any, index: number) {
        const currencys = this.state.list[index];
        const newType = !currencys.isChoose;
        currencys.isChoose = newType;
        this.paint();

        // 处理search数据
        const wallet = find('curWallet');
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.name);
        if (newType && oldIndex < 0) {
            showCurrencys.push(currencys.name);
        } else if (!newType && oldIndex >= 0) {
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        updateStore('curWallet', wallet);
    }

}