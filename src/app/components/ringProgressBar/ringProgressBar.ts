/**
 * 圆环进度条
 */
// =====================================导入
import { Widget } from '../../../pi/widget/widget';

interface Props {
    width:number;// width
    borderWidth:number;// border width
    activeColor:string;// active color
    bgColor:string;// background color
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