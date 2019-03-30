/**
 * about us
 */
// =======================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { popNewMessage, rippleShow } from '../../../utils/tools';
// =========================================导出
declare var pi_update;
declare var pi_modules;
export class Aboutus extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        this.props = {
            version: pi_update.updateJson.version,
            data: [
                { value: '', components: 'app-view-mine-other-privacypolicy' },
                { value: '', components: '' },
                { value: '', components: '' }
            ],
            walletLogo:getModulConfig('WALLET_LOGO'),
            walletName:getModulConfig('WALLET_NAME')
        };
        console.log('底层版本号  ===================',pi_modules.appUpdate.exports.getLocalVersion());
    }

    public itemClick(e: any, index: number) {
        if (index === 0 && this.props.data[index].components !== '') {
            popNew(this.props.data[index].components);
        } else if (index === 1) { // 版本更新
            const tips = { zh_Hans:'已是最新版本',zh_Hant:'已是最新版',en:'' };
            popNewMessage(tips[getLang()]);
        } else {
            // popNew('app-view-mine-other-shareDownload');
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
