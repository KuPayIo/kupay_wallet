/**
 * about us
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class Aboutus extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            data:[
                { value:'隐私条款',components:'app-view-mine-aboutus-privacypolicy' },
                { value:'用户协议',components:'app-view-mine-aboutus-useragreement' },
                { value:'版本更新',components:'' },
                { value:'分享下载链接',components:'' }
            ]
        };
    }

    public itemClick(e:any,index:number) {   
        if (index < 2 && this.state.data[index].components !== '') {
            popNew(this.state.data[index].components);
        } else if (index === 2) {
            popNew('app-view-mine-aboutus-message', { type: 'success', content: '当前已是最新版本', center: true });
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