/**
 * about us
 */
// =======================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
// =========================================导出
export class Aboutus extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            data:[
                { value:'协议及隐私',components:'privacypolicy$' },
                { value:'版本更新',components:'' },
                { value:'分享下载链接',components:'' }
            ]
        };
    }

    public itemClick(e:any,index:number) {   
        if (index === 0 && this.state.data[index].components !== '') {
            popNew(this.state.data[index].components);
        } else if (index === 1) {
            popNew('app-components-message-message', { type: 'success', content: '已是最新版', center: true });
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