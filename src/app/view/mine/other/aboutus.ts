/**
 * about us
 */
// =======================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
// =========================================导出
export class Aboutus extends Widget {
    public ok: () => void;
   
    public create() {
        super.create();

        let cfg = this.config.value.simpleChinese;
        const lan = find('languageSet');
        if (lan) {
            cfg = this.config.value[lan.languageList[lan.selected]];
        }
        this.state = {
            data:[
                { value: cfg.itemTitle[0],components:'app-view-mine-other-privacypolicy' },
                { value: cfg.itemTitle[0],components:'' },
                { value: cfg.itemTitle[0],components:'' }
            ],
            cfgData:cfg
        };
    }

    public itemClick(e:any,index:number) {   
        if (index === 0 && this.state.data[index].components !== '') {
            popNew(this.state.data[index].components);
        } else if (index === 1) {
            popNew('app-components-message-message', { content: this.state.cfgData.tips });
        } else {
            // TODO 分享下载
            popNew('app-components-share-share', { text: 'This is a test QRCode', shareType: ShareToPlatforms.TYPE_IMG }, (result) => {
                // alert(result);
            }, (result) => {
                // alert(result);
            });
        }
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}