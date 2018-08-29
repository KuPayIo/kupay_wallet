/**
 * 理财产品详情页面
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { buyProduct,getCloudBalance, getPurchaseRecord } from '../../../net/pull';
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
        this.state.isReadedDeclare = false;// 是否阅读理财声明
        this.state.showStep = true;// 此属性用于控制页面步骤条组件的显示与隐藏，应为主键用了z-index属性，页面跳转时不隐藏会显示到其他页面上，所有此页面关闭或弹出下一级页面时应当将步骤条隐藏
        this.state.amount = 1;// 购买数量
        this.state.holdAmout = this.getHoldAmout();// 计算已经持有的该理财产品量，用于计算限购
    }
    /**
     * 获取理财产品持有量，不算已经赎回的
     */
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
            money:this.state.amount * Number(this.state.unitPrice),// 计算价格
            unitPrice:this.state.unitPrice,
            productName:this.state.productName,
            amount:this.state.amount,// 购买数量
            expectedEarnings:this.state.profit,// 预期年化收益
            lockday:this.state.lockday
        };
        props.money = strip(props.money);// 处理浮点数运算误差，如0.1+0.3=1.4000000000000001;
        if (!this.state.isReadedDeclare) {
            const readPromice = this.readNotice();
            await readPromice.then((r) => {
                this.hideStep();
                openBasePage('app-view-financialManagement-purchase-purchase',props).then(async (r)  => {
                    // TODO 购买
                    // 返回值r是输入的密码,r为null时表明输入框被直接关闭则不进行验证密码操作
                    if (!r) {
                        this.showStep();
    
                        return;
                    }// r为null，说明输入取消
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
                }// r为null，说明输入取消
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
        getCloudBalance();
        console.log('data',data);
        await getPurchaseRecord();// 购买之后获取购买记录
        if (data) {
            popNew('app-components-message-message', { itype: 'success', content: '购买成功', center: true });
            this.ok && this.ok(); 
        } else {
            popNew('app-components-message-message', { itype: 'error', content: '购买失败', center: true });
        }
        
    }
    // 对步骤条隐藏
    public hideStep() {
        this.state.showStep = false;
        this.paint();
    }
    // 对步骤条显示
    public showStep() {
        this.state.showStep = true;
        this.paint();
    }
    // 减少购买数量
    public minus(e:any) {
        if (this.state.amount === 1) {
            return;
        }
        this.state.amount -= 1;
        e.node.link.value = this.state.amount;
        this.paint();
    }
    // 增加购买数量
    public add(e:any) {
        const limit = Number(this.state.limit);
        // 超过限购量直接返回
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