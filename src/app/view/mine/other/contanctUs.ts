/**
 * 联系我们
 */
// ===============================================导入
import { Widget } from '../../../../pi/widget/widget';
// ==================================================导出

export class ContanctUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            data:[
                { value:'官方网站',desc:'www.Kupay.io' },
                { value:'微信客服',desc:'KuPay小助手' },
                { value:'微信公众号',desc:'KuPay' }
            ]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public itemClick(e:any,ind:any) {
        switch (ind) {
            // 点击KuPay官网
            case 0:
                window.open('http://www.KuPay.io'); 
                break;
            // KuPay小助手
            case 1:
                window.open('weixin://dl/officialaccounts');
                break;
            // KuPay公众号
            case 2:
                window.open('weixin://dl/officialaccounts');
                break;
            default:
                console.log('服务器异常请稍后重试');
        }
    }
}