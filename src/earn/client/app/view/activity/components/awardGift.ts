/**
 * 礼物奖励
 * {"width":82,"borderWidth":4,"activeColor":"#F7931A","activePercent":0.4,
 * "centerImage":"../../../../res/image/award_gold_hoe.png",
 * firstText:"1/2",secondText:"每日登录",centerStyle:""}
 * width:环形直径
 * borderWidth:环宽度
 * activeColor：有效部分颜色
 * centerImage：图片路径
 * centerStyle:中间文字额外CSS
 */
import { Widget } from '../../../../../../pi/widget/widget';

// =====================================导入

interface Props {
    width:number;// width
    borderWidth:number;// border width
    activeColor:string;// active color
    activePercent:number;// active percent
    centerImage:string;// center image url
    firstText:string; // first text
    secondText:string; // second text
    centerStyle?:string;// center style
}

export class AwardGift extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log();
        //
    }
}