/**
 * 联系我们
 */
// ===============================================导入
import { CUSTOMER_SERVICE } from '../../../../chat/server/data/constant';
import { GENERATOR_TYPE } from '../../../../chat/server/data/db/user.s';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { rippleShow } from '../../../utils/tools';
// ==================================================导出
declare var pi_update;
declare var pi_modules;
export class ContanctUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        const tips = { zh_Hans:'客服',zh_Hant:'客服',en:'' };
        this.props = {
            version:pi_update.updateJson.version,
            appVersion:pi_modules.appUpdate.exports.getLocalVersion().join('.') || '1.0.0',
            data:[
                { value: '',desc:getModulConfig('WALLET_WEBSITE') },
                { value: '',desc:getModulConfig('WALLET_NAME') + tips[getLang()] },
                // tslint:disable-next-line:prefer-template
                { value: '',desc:getModulConfig('WALLET_NAME') + '游戏' }
            ],
            walletLogo:getModulConfig('WALLET_LOGO'),
            walletName:getModulConfig('WALLET_NAME'),
            desc:getModulConfig('CONTACTUSDESC')
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    
    public itemClick(e:any,ind:any) {
        switch (ind) {
            // 点击钱包官网
            case 0:
                // openNewActivity(this.props.data[0].desc,this.props.walletName);
                break;
            // 客服
            case 1:
                popNew('chat-client-app-view-chat-chat', { id: CUSTOMER_SERVICE, chatType: GENERATOR_TYPE.USER });
                break;
            // KuPay公众号
            case 2:
                popNew('app-view-mine-other-wechatQrcode',{ fg:1 });
                break;
            default:
                console.log(this.props.cfgData.tips);
        }
    }
}