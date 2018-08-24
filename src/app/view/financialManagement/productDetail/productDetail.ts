/**
 * 理财产品详情页面
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { buyProduct,getPurchaseRecord } from '../../../net/pull';
import { find,register } from '../../../store/store';
import { openBasePage } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';
// =====================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props: any, oldProps: any) {
        super.setProps(props, oldProps);
        this.state = find('productList')[props.i];
        this.state.isReadedDeclare = false;
        this.state.showStep = true;
        this.state.amount = 1;
        this.state.holdAmout = this.getHoldAmout();
    }
    public getHoldAmout() {
        const productId = this.state.id;
        const record = this.props.record;
        let holdAmout = 0;
        for (let i = 0;i < record.length;i++) {
            const one = record[i];
            if (one.id.toString() === productId && one.state === 1) {
                holdAmout += one.amount;
            }
        }
        console.log('holdAmout',holdAmout);

        return holdAmout;
    }

    public goBackPage() {
        this.ok && this.ok();
    }

    // 阅读声明
    public async readNotice() {
        this.hideStep();
        await openBasePage('app-view-financialManagement-notice-notice').then((r) => {
            this.state.isReadedDeclare = r;
            this.showStep();
        });
        
    }
    // 点击购买
    public async purchaseClicked() {
        this.hideStep();// 隐藏步骤条，应为步骤条样式应用了z-index，不隐藏的话影响后续弹出的页面
        const props = {
            money:this.state.amount * Number(this.state.unitPrice),
            unitPrice:this.state.unitPrice,
            productName:this.state.productName,
            amount:this.state.amount,
            expectedEarnings:this.state.profit,
            lockday:this.state.lockday
        };
        props.money = strip(props.money);
        if (!this.state.isReadedDeclare) {
            const readPromice = this.readNotice();
            await readPromice.then((r) => {
                this.hideStep();
                openBasePage('app-view-financialManagement-purchase-purchase',props).then(async (r)  => {
                    // TODO 购买
                    // 返回值r是输入的密码
                    if (!r) {
                        this.showStep();
    
                        return;
                    }// r为null，说明点击取消
                    this.doPurchase(r);
                    this.showStep();
                });
            });
        } else {
            openBasePage('app-view-financialManagement-purchase-purchase',props).then(async (r) => {
                // TODO 购买
                // 返回值r是输入的密码
                if (!r) {
                    this.showStep();

                    return;
                }// r为null，说明点击取消
                this.doPurchase(r);
                this.showStep();
            });
        }
        
    }
    // 购买理财
    public async doPurchase(r:any) {
        const close = popNew('app-components_level_1-loading-loading', { text: '正在购买...' });    
        const pswCorrect = await VerifyIdentidy(find('curWallet'),r,false);
        close.callback(close.widget);
        if (!pswCorrect) {
            popNew('app-components-message-message', { itype: 'error', content: '密码不正确', center: true });
            
            return;
        }
        const data = await buyProduct(this.state.id,this.state.amount);
        console.log('data',data);
        await getPurchaseRecord();
        if (data) {
            popNew('app-components-message-message', { itype: 'success', content: '购买成功', center: true });
            this.ok && this.ok(); 
        } else {
            popNew('app-components-message-message', { itype: 'error', content: '购买失败', center: true });
        }
        
    }
    public hideStep() {
        this.state.showStep = false;
        this.paint();
    }
    public showStep() {
        this.state.showStep = true;
        this.paint();
    }
    public minus(e:any) {
        if (this.state.amount === 1) {
            return;
        }
        this.state.amount -= 1;
        e.node.link.value = this.state.amount;
        this.paint();
    }
    public add(e:any) {
        const limit = Number(this.state.limit);
        if (this.state.amount + this.state.holdAmout === limit) {
            return;
        }
        this.state.amount += 1;
        e.node.link.value = this.state.amount;
        this.paint();
    }
    // public amountInput(e:any) {

    //     const value = Number(e.currentTarget.value);
    //     const limit = Number(this.state.limit);
    //     if (value <= limit) {
    //         this.state.amount = value;
    //     } else {
    //         this.state.amount = limit;
    //     }
    //     console.log(e.node.link.attributes.value);
    //     e.node.link.value = this.state.amount;
    //     this.paint();
    // }
}
// ===========================================本地
// 解决js浮点数运算误差 3*0.1=0.3000000000004
const strip = (num, precision = 12) => {
    return +parseFloat(num.toPrecision(precision));
};
register('productList', async (productList) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.state =  productList[w.props.i];
        w.paint();
    }
    
});