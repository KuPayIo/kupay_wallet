/**
 * add asset 
 */
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../logic/dataCenter';
import { getStore, setStore } from '../../../store/memstore';
import { fetchWalletAssetListAdded, getCurrentAddrInfo } from '../../../utils/tools';

export class AddAsset extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const assetList = fetchWalletAssetListAdded();
        this.props = {
            assetList,
            searchText:'',
            showAssetList:assetList
        };
        console.log(this.props);
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 处理滑块改变
     */
    public onSwitchChange(e: any, index: number) {
        const added = e.newType;
        const currencys = this.props.showAssetList[index];
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
        this.props.searchText = e.value;
        if (this.props.searchText) {
            // tslint:disable-next-line:max-line-length
            this.props.showAssetList = this.props.assetList.filter(v => v.currencyName.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0);
        } else {
            this.props.showAssetList = this.props.assetList;
        }
        this.paint();
    }

    public searchTextClear() {
        this.props.showAssetList = this.props.assetList;
        this.paint();
    }
    
}