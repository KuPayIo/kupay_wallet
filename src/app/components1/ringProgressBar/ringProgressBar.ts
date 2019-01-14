/**
 * 圆环进度条
 * {"width":82,"borderWidth":4,"activeColor":"#F7931A","activePercent":0.4,"centerText":"售罄",centerStyle:""}
 * width:环形直径
 * borderWidth:环宽度
 * activeColor：有效部分颜色
 * centerText：中间显示文字，可选
 * centerStyle:中间文字额外CSS
 */
// =====================================导入
import { Widget } from '../../../pi/widget/widget';

interface Props {
    width:number;// width
    borderWidth:number;// border width
    activeColor:string;// active color
    activePercent:number;// active percent
    centerStyle?:string;// center style
    centerText?:string;// center text
}
export class RingProgressBar extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log();
        //
    }
}