/**
 * 联系我们
 */
// ===============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { getLanguage, getLocalVersion } from '../../../utils/tools';
// ==================================================导出

export class ContanctUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        const cfg = getLanguage(this);
        this.state = {
            version:getLocalVersion(),
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
                openNewActivity('http://www.KuPay.io','KuPay');
                break;
            // KuPay小助手
            case 1:
                popNew('app-view-mine-other-wechatQrcode',{ fg:0 });
                break;
            // KuPay公众号
            case 2:
                popNew('app-view-mine-other-wechatQrcode',{ fg:1 });
                break;
            default:
                console.log(this.state.cfgData.tips);
        }
    }
}