/**
 * about us
 */
// =======================================导入
import { rippleShow } from '../../../../chat/client/app/logic/logic';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getLocalVersion, popNewMessage } from '../../../utils/tools';
// =========================================导出
declare var pi_update;
export class Aboutus extends Widget {
    public ok: () => void;
    public language: any;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            version: pi_update.updateJson.version,
            data: [
                { value: this.language.itemTitle[0], components: 'app-view-mine-other-privacypolicy' },
                { value: this.language.itemTitle[1], components: '' },
                { value: this.language.itemTitle[2], components: '' }
            ],
            walletLogo:getModulConfig('WALLET_LOGO'),
            walletName:getModulConfig('WALLET_NAME')
        };
    }

    public itemClick(e: any, index: number) {
        if (index === 0 && this.props.data[index].components !== '') {
            popNew(this.props.data[index].components);
        } else if (index === 1) { // 版本更新
            popNewMessage('已是最新版本');
        } else {
            // TODO 分享下载
            // popNew('app-components-share-share', { 
            //     shareType: ShareToPlatforms.TYPE_LINK,
            //     url: shareDownload,
            //     title:`${this.props.walletName}钱包`,
            //     content:`我正在使用${this.props.walletName}，邀您一起来使用！` 
            // });
            // console.error(shareDownload);
            popNew('app-view-mine-other-shareDownload');
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
