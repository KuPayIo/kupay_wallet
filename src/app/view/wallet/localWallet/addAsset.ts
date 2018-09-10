/**
 * add asset 
 */
import { Widget } from "../../../../pi/widget/widget";
import { fetchWalletAssetListAdded } from "../../../utils/tools";
import { find, updateStore } from "../../../store/store";

export class AddAsset extends Widget{
    public ok:()=>void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            assetList:fetchWalletAssetListAdded()
        };
        console.log(this.state);
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    /**
     * 处理滑块改变
     */
    public onSwitchChange(e: any, index: number) {
        const added = e.newType;
        const currencys = this.state.assetList[index];
        currencys.added = added;
        this.paint();

        // 处理search数据
        const wallet = find('curWallet');
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.currencyName);
        if (added && oldIndex < 0) {
            showCurrencys.push(currencys.currencyName);
        } else{
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        updateStore('curWallet', wallet);
    }
}