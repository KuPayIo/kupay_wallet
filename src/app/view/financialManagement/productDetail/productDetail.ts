/**
 * 理财产品详情页面
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { openBasePage,VerifyIdentidy } from '../../../utils/tools';
// =====================================================导出
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props: any, oldProps: any) {
        super.setProps(props, oldProps);
        this.state = props.item;
        this.state.isReadedDeclare = false;
        this.state.showStep = true;
        this.state.amount = 1;
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
                    this.doPurchase(r);
                    this.showStep();
                });
            });
        } else {
            openBasePage('app-view-financialManagement-purchase-purchase',props).then(async (r) => {
                // TODO 购买
                // 返回值r是输入的密码
                this.doPurchase(r);
                this.showStep();
            });
        }
        
    }
    public async doPurchase(r:any) {
        const close = popNew('pi-components-loading-loading', { text: '正在购买...' });    
        const pswCorrect = await VerifyIdentidy(find('curWallet'),r,false);
        close.callback(close.widget);
        if (!pswCorrect) {
            popNew('app-components-message-message', { itype: 'error', content: '密码不正确', center: true });
            
            return;
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
    public minus() {
        if (this.state.amount === 1) {
            return;
        }
        this.state.amount -= 1;
        this.paint();
    }
    public add() {
        const limit = Number(this.state.limit);
        if (this.state.amount === limit) {
            return;
        }
        this.state.amount += 1;
        this.paint();
    }
}
// ===========================================本地
// 解决js浮点数运算误差 3*0.1=0.3000000000004
const strip = (num, precision = 12) => {
    return +parseFloat(num.toPrecision(precision));
};