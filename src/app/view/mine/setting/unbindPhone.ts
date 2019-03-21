/**
 * 解绑手机号
 */
import { Widget } from '../../../../pi/widget/widget';

export class UnbindPhone extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
}