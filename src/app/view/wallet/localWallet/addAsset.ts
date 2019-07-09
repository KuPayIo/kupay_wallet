/**
 * add asset 
 */
import { Widget } from '../../../../pi/widget/widget';
import { callUpdateShowCurrencys,getStoreData } from '../../../middleLayer/wrap';
import { calCurrencyLogoUrl, fetchWalletAssetListAdded } from '../../../utils/tools';

export class AddAsset extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        
        this.props = {
            assetList:[],
            searchText:'',
            showAssetList:[]
        };
        getStoreData('wallet').then(wallet => {
            const assetList = fetchWalletAssetListAdded(wallet);
            assetList.map(item => {
                item.logo = calCurrencyLogoUrl(item.currencyName);
            });
            this.props.assetList = assetList;
            this.props.showAssetList = assetList;
            this.paint();
        });
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
        callUpdateShowCurrencys(currencys.currencyName,added);
        this.paint();

        // 处理search数据
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