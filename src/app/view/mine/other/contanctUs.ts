/**
 * 联系我们
 */
// ===============================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { findModulConfig } from '../../../modulConfig';
import { getLocalVersion } from '../../../utils/tools';
// ==================================================导出

export class ContanctUs extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            version:getLocalVersion(),
            data:[
                { value: this.language.itemTitle[0],desc:`www.${findModulConfig('WALLET_NAME')}.io` },
                { value: this.language.itemTitle[1],desc:findModulConfig('WALLET_NAME') + this.language.itemTitle[2] },
                { value: this.language.itemTitle[3],desc:findModulConfig('WALLET_NAME') }
            ],
            walletName:findModulConfig('WALLET_NAME')
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public itemClick(e:any,ind:any) {
        switch (ind) {
            // 点击KuPay官网
            case 0:
                openNewActivity('http://www.KuPay.io',this.state.walletName);
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
                // console.log(this.state.cfgData.tips);
        }
    }
}