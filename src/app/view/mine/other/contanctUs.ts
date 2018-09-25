/**
 * 联系我们
 */
// ===============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
// ==================================================导出

export class ContanctUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        let cfg = this.config.value.simpleChinese;
        const lan = find('languageSet');
        if (lan) {
            cfg = this.config.value[lan.languageList[lan.selected]];
        }
        this.state = {
            data:[
                { value: cfg.itemTitle[0],desc:'www.Kupay.io' },
                { value: cfg.itemTitle[1],desc:cfg.itemTitle[2] },
                { value: cfg.itemTitle[3],desc:'KuPay' }
            ],
            cfgData:cfg
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
                console.log(this.state.cfgData.tips);
        }
    }
}