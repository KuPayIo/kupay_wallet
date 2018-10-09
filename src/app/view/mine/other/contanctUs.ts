/**
 * 联系我们
 */
// ===============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { getLanguage } from '../../../utils/tools';
import { version } from '../../../config';
// ==================================================导出

export class ContanctUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        const cfg = getLanguage(this);
        this.state = {
            version,
            data:[
                { value: cfg.itemTitle[0],desc:'www.Kuplay.io' },
                { value: cfg.itemTitle[1],desc:cfg.itemTitle[2] },
                { value: cfg.itemTitle[3],desc:'KuPlay' }
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
                // window.open('http://www.KuPay.io'); 
                openNewActivity('http://www.KuPay.io','KuPay');
                break;
            // KuPay小助手
            case 1:
                // window.open('weixin://dl/officialaccounts');
                openNewActivity('weixin://dl/officialaccounts');
                break;
            // KuPay公众号
            case 2:
                // window.open('weixin://dl/officialaccounts');
                openNewActivity('weixin://dl/officialaccounts');
                break;
            default:
                console.log(this.state.cfgData.tips);
        }
    }
}