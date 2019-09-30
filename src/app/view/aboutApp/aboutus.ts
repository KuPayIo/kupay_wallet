/**
 * about us
 */
// =======================================导入
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../public/config';
import { popNewMessage, rippleShow } from '../../utils/pureUtils';
// =========================================导出
declare var pi_update;
declare var pi_modules;
export class Aboutus extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        this.props = {
            version: pi_update.updateJson.version,
            appVersion:pi_modules.appUpdate.exports.getLocalVersion().join('.') || '1.0.0',
            data: [
                { value: '', components: 'app-view-aboutApp-privacypolicy' },
                { value: '', components: '' },
                { value: '', components: '' }
            ],
            walletLogo:getModulConfig('WALLET_LOGO'),
            walletName:getModulConfig('WALLET_NAME'),
            desc:getModulConfig('ABOUTUSDESC')
        };
    }

    public itemClick(e: any, index: number) {
        if (index === 0 && this.props.data[index].components !== '') {
            popNew(this.props.data[index].components);
        } else if (index === 1) { // 版本更新
            const tips = { zh_Hans:'已是最新版本',zh_Hant:'已是最新版',en:'' };
            popNewMessage(tips[getLang()]);
        } else {
            popNew('earn-client-app-view-activity-inviteFriend');
        }
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    
    public backPrePage() {
        this.ok && this.ok();
    }
}
