/**
 * 推荐理财
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getProductList } from '../../../net/pull';
import { Product } from '../../../publicLib/interface';
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
        this.props = {
            ...this.props,
            productList:[]
        };
        if (this.props.isActive) {
            getProductList();
        }
    }

    public updateProductList(productList:Product[]) {
        this.props.productList = productList;
        this.paint();
    }

    public fmListItemClick(e:any,index:number) {
        const product = this.props.productList[index];
        popNew('app-view-wallet-financialManagement-productDetail',{ product });
    }
}

// 理财产品变化
register('activity/financialManagement/products',(productList) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateProductList(productList);
    }
    
});