/**
 * 货币添加
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../store/dataCenter';
import { getCurrentWallet, getLocalStorage, setLocalStorage } from '../../../utils/tools';

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
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);

        const currencyList = dataCenter.currencyList;

        const showCurrencys = wallet.showCurrencys || [];

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
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.name);
        if (newType && oldIndex < 0) {
            showCurrencys.push(currencys.name);
        } else if (!newType && oldIndex >= 0) {
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        setLocalStorage('wallets', wallets, true);
    }

}