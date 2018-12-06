/**
 * about us
 */
// =======================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { shareDownload } from '../../../config';
import { getModulConfig } from '../../../modulConfig';
import { getLocalVersion, popNewMessage } from '../../../utils/tools';
// =========================================导出
declare var pi_modules;
declare var pi_update;
export class Aboutus extends Widget {
    public ok: () => void;
    public language: any;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            version: getLocalVersion(),
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
            const updateMod = pi_modules.update.exports;
            updateMod.checkUpdate((needUpdate,cancelUpdate) => {
                if (cancelUpdate) return;  // 用户选择不更新
                if (!needUpdate) {  // 没有更新版本
                    popNewMessage('已是最新版本');
                    
                    return;
                }

                // 注：必须堵住原有的界面操作，不允许任何触发操作
                updateMod.update((e) => {
                    // {type: "saveFile", total: 4, count: 1}
                    console.log('update progress: ', e);
                    pi_update.updateProgress(e);
                });
            });
            
            // popNew('app-components-message-message', { content: this.props.cfgData.tips });
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

    public backPrePage() {
        this.ok && this.ok();
    }
}
