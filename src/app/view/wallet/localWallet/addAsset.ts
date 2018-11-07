/**
 * add asset 
 */
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../logic/dataCenter';
import { getStore, setStore } from '../../../store/memstore';
import { fetchWalletAssetListAdded, getCurrentAddrInfo, getLanguage } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';

export class AddAsset extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        const assetList = fetchWalletAssetListAdded();
        this.state = {
            assetList,
            searchText:'',
            showAssetList:assetList,
        };
        console.log(this.state);
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 处理滑块改变
     */
    public onSwitchChange(e: any, index: number) {
        const added = e.newType;
        const currencys = this.state.showAssetList[index];
        currencys.added = added;
        this.paint();

        // 处理search数据
        const wallet = getStore('wallet');
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.currencyName);
        if (added && oldIndex < 0) {
            showCurrencys.push(currencys.currencyName);
            const curAddr = getCurrentAddrInfo(currencys.currencyName);
            dataCenter.updateAddrInfo(curAddr.addr, currencys.currencyName);
            dataCenter.fetchErc20GasLimit(currencys.currencyName);
        } else {
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        setStore('wallet', wallet);
    }

    public searchTextChange(e:any) {
        this.state.searchText = e.value;
        if (this.state.searchText) {
            // tslint:disable-next-line:max-line-length
            this.state.showAssetList = this.state.assetList.filter(v => v.currencyName.toLowerCase().indexOf(this.state.searchText.toLowerCase()) >= 0);
        } else {
            this.state.showAssetList = this.state.assetList;
        }
        this.paint();
    }

    public searchTextClear() {
        this.state.showAssetList = this.state.assetList;
        this.paint();
    }
    
}