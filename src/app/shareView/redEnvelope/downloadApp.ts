/**
 * download app
 */
import { popNew } from '../../../pi/ui/root';
import { userAgent } from '../../../pi/util/html';
import { Widget } from '../../../pi/widget/widget';

export class DownloadApp extends Widget {
    public create() {
        super.create();
        const res = userAgent({});
        const browserName = res.browser.name;
        this.state = {
            installTutorial:['点击“立即下载”按钮下载安装文件','成功安装KuPay','进入APP并创建钱包'],
            download:!(browserName === 'micromessenger' || browserName === 'mqqbrowser')
        };
    }
    public downloadClick(e:any) {
        popNew('app-shareView-redEnvelope-downloadTips');
    }
} 