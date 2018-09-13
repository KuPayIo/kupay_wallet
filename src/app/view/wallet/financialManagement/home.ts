/**
 * wallet home 
 */
// ==============================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../store/interface';
import { register } from '../../../store/store';
import { fetchTotalAssets, fetchCloudTotalAssets, formatBalanceValue } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public ok:()=>void;
    public backPrePage(){
        this.ok && this.ok();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            tabs:[{
                tab:'推荐理财',
                components:'app-view-wallet-financialManagement-recommendFM'
            },{
                tab:'我的理财',
                components:'app-view-wallet-home-walletHome'
            }],
            activeNum:0,
            avatar:'',
            totalAsset:formatBalanceValue(fetchTotalAssets() + fetchCloudTotalAssets())
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }

}

// ==========================本地
