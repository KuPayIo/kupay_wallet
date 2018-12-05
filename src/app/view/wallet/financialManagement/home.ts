/**
 * wallet home 
 */
// ==============================导入
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getProductList, getPurchaseRecord } from '../../../net/pull';
import { getStore } from '../../../store/memstore';
import { fetchCloudTotalAssets, fetchLocalTotalAssets, formatBalanceValue } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    activeNum:number;
}
export class Home extends Widget {
    public ok:() => void;
    public language:any;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        getProductList();
        if (getStore('user/id')) {
            getPurchaseRecord();
        }
       
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            tabs:[{
                tab:this.language.tabs[0],
                components:'app-view-wallet-financialManagement-recommendFM'
            },{
                tab:this.language.tabs[1],
                components:'app-view-wallet-financialManagement-holdedFM'
            }],
            avatar:'',
            totalAsset:formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets()),
            refreshing:false
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.props.activeNum = value;
        this.paint();
    }

    public refreshClick() {
        this.props.refreshing = true;
        this.paint();
        if (this.props.activeNum === 0) {
            getProductList().then(() => {
                this.props.refreshing = false;
                console.log('getProductList refresh');
                this.paint();
            });
        } else {
            getPurchaseRecord().then(() => {
                this.props.refreshing = false;
                console.log('getPurchaseRecord refresh');
                this.paint();
            });
        }
    }
}

// ==========================本地
