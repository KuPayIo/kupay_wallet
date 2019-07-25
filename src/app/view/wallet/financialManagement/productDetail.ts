/**
 * 理财详情
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetPurchaseRecord,getStoreData } from '../../../middleLayer/wrap';
import { Product, PurchaseHistory } from '../../../publicLib/interface';
import { calPercent, popNewMessage } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';

// ====================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    product:Product;
}
export class ProductDetail extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        getStoreData('user/id').then(uid => {
            if (uid) {
                // 获取购买记录
                callGetPurchaseRecord();
            }
        });
        const product = this.props.product;
        const res = calPercent(product.surplus,product.total);
        // console.log(res);
        this.props = {
            ...this.props,
            holdedAmout:0,
            amount:1,
            leftPercent:  res.left,
            usePercent: res.use,

            scrollHeight:0
        };
        console.log(this.props.product);
    }

    // 减少购买数量
    public minus(e:any) {
        if (this.props.amount === 1) {
            return;
        }
        this.props.amount -= 1;
        this.paint();
    }
    // 增加购买数量
    public add(e:any) {
        const limit = Number(this.props.product.limit);
        // 超过限购量直接返回
        if (this.props.amount + this.props.holdedAmout >= limit) {
            return;
        }
        this.props.amount += 1;
        this.paint();
    }

    // 购买记录改变
    public updatePurchaseRecord(purchaseRecord:PurchaseHistory[]) {
        // this.props.holdedAmout = fetchHoldedProductAmount(this.props.product.id);
    }

    // 页面滚动
    public pageScroll() {
        const scrollTop = document.getElementById('body').scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
        
    }

    /**
     * 点击购买按钮
     */
    public purchaseClicked() {
        const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
        popNewMessage(tips[getLang()]);

        return;
        popNew('app-view-wallet-financialManagement-productStatement',{ product:this.props.product,amount:this.props.amount });
    }

    /**
     * 点击阅读声明
     */
    public readAgree() {
        popNew('app-view-wallet-financialManagement-productStatement',{ fg:1 });        
    }
}

// =====================================本地
registerStoreData('activity/financialManagement/purchaseHistories', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updatePurchaseRecord(purchaseRecord);
    }
});