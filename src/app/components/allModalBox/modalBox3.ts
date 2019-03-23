/**
 * 中奖提示
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    fadeOut:boolean;
    tipTitle:string;  // 提醒标题
    tipContent:string;   // 提醒内容
    btn:string;// 按钮1 
    img:string;// 图片
}

export class ModalBox3 extends Widget {
    public cancel: () => void;
    public ok:() => void;     // flag 点击某个按钮
    public props:Props;
    public setProps(props:any) {
        this.props = {
            ...props,
            fadeOut:false
        };
        super.setProps(props);
    } 
    
    public close() {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.cancel && this.cancel();
        },300);
    }
    public btnClick() {
        this.ok && this.ok();
    }
}