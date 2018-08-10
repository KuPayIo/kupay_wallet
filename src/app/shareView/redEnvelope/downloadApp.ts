/**
 * download app
 */
import { Widget } from '../../../pi/widget/widget';

export class DownloadApp extends Widget {
    public create() {
        super.create();
        this.state = {
            installTutorial:['点击“立即下载”按钮下载安装文件','成功安装KuPay','进入APP并创建钱包']
        };
    }
}