/**
 * 联系我们
 */
// ===============================================导入
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
// ==================================================导出

interface Props {
    walletName:string;
    wachatHelperQrcode:string;
    wachatQrcode:string;
    fg:number;
}

export class WechatQrcode extends Widget {
    public ok: () => void;
    public language:any;
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        this.initData();
    }

    public initData() {
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            walletName:getModulConfig('WALLET_NAME'),
            wachatHelperQrcode:getModulConfig('WECHAT_HELPER'),
            wachatQrcode:getModulConfig('WECHAT_ACCOUNT')
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public shareImg() {
        const stp = new ShareToPlatforms();
        stp.init();
        stp.makeScreenShot({
            success: (result) => { 
                popNew('app-components-share-share',{ shareType:ShareToPlatforms.TYPE_SCREEN });
            },
            fail: (result) => { 
                const tips = { zh_Hans:'分享截图失败',zh_Hant:'分享截圖失敗',en:'' };
                popNew('app-components-message-message',{ content:tips[getLang()] });
            }
        });
        console.log('截图截图截图');
    }
}