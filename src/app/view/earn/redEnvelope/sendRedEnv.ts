/**
 * sendRedEnv
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    title:string;
    content:string;
    sureText:string;
    cancelText:string;
    style?:string; // 修改content的样式
}
export class SendRedEnv extends Widget {
    public props: Props;
    public ok: () => void;

    /**
     * 发红包
     */
    public sendRedEnv() {
        popNew('app-components-share-share',{});
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}