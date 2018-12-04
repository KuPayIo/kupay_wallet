/**
 * 推荐理财
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getProductList } from '../../../net/pull';
import { Product } from '../../../store/interface';
import { register } from '../../../store/memstore';

interface Props {
    isActive:boolean;
}
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class RecommendFM extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        if (this.props.isActive) {
            getProductList();
        }
    }

    public fmListItemClick(e:any,index:number) {
        const product = this.state.productList[index];
        popNew('app-view-wallet-financialManagement-productDetail',{ product });
    }
}

const localState:any = {};
// 理财产品变化
register('activity/financialManagement/products', (productList:Product[]) => {
    localState.productList = productList;
    forelet.paint(localState);
});