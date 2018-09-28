/**
 * about us
 */
// =======================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage } from '../../../utils/tools';
// =========================================导出
export class Aboutus extends Widget {
    public ok: () => void;
   
    public create() {
        super.create();
        const cfg = getLanguage(this);
        this.state = {
            data:[
                { value: cfg.itemTitle[0],components:'app-view-mine-other-privacypolicy' },
                { value: cfg.itemTitle[1],components:'' },
                { value: cfg.itemTitle[2],components:'' }
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