import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../publicLib/modulConfig';

/**
 * 找客服
 */

export class CustomerService extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.props = {
            wachatQrcode:getModulConfig('WECHAT_ACCOUNT'),
            qq:getModulConfig('QQ_CODE')
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}