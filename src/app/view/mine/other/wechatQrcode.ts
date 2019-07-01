/**
 * 联系我们
 */
// ===============================================导入
import { ShareToPlatforms, ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { makeScreenShot } from '../../../logic/native';
import { getModulConfig } from '../../../modulConfig';
import { popNewMessage } from '../../../utils/tools';
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
        makeScreenShot((result) => { 
            popNew('app-components-share-share',{ shareType:ShareType.TYPE_SCREEN });
        },(result) => { 
            const tips = { zh_Hans:'分享截图失败',zh_Hant:'分享截圖失敗',en:'' };
            popNewMessage(tips[getLang()]);
        });
        console.log('截图截图截图');
    }
}