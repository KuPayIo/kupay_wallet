/**
 * about us
 */
// =======================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { shareDownload } from '../../../net/pull';
import { getLocalVersion, popNewMessage } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';
// =========================================导出
declare var pi_modules;
export class Aboutus extends Widget {
    public ok: () => void;
    public language: any;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            version: getLocalVersion(),
            data: [
                { value: this.language.itemTitle[0], components: 'app-view-mine-other-privacypolicy' },
                { value: this.language.itemTitle[1], components: '' },
                { value: this.language.itemTitle[2], components: '' }
            ],
        };
    }

    public itemClick(e: any, index: number) {
        if (index === 0 && this.state.data[index].components !== '') {
            popNew(this.state.data[index].components);
        } else if (index === 1) { // 版本更新
            const updateMod = pi_modules.update.exports;
            // 测试更新模块
            updateMod.checkUpdate((needUpdate) => {
                if (!needUpdate) {
                    popNewMessage('已是最新版本');
                    
                    return;
                }

                // 注：必须堵住原有的界面操作，不允许任何触发操作

                updateMod.update((e) => {
                    console.log('update progress: ', e);
                });
            });
            // popNew('app-components-message-message', { content: this.state.cfgData.tips });
        } else {
            // TODO 分享下载
            popNew('app-components-share-share', { shareType: ShareToPlatforms.TYPE_LINK, url: shareDownload }, (result) => {
                // alert(result);
            }, (result) => {
                // alert(result);
            });
            console.error(shareDownload);
        }
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}
