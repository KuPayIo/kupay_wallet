/**
 * 按钮组件
 * {"name":"塞钱进红包","types":"big","color":"blue","style":""}
 * name:按钮名字
 * type:big|small,默认big
 * color:blue|green|orange|yellow|white|transparent，可选
 * style:额外CSS，可选
 * 外部监听 ev-btn-tap 点击事件
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    name:string;
    types?:string;
    color?:string;
    style?:string;
}
// ================================ 导出

export class Btn extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            isAbleBtn:false
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(event:any) {
        this.state.isAbleBtn = true;
        this.paint();

        setTimeout(() => {// 按钮动画效果执行完后改为未点击状态，则可以再次点击
            this.state.isAbleBtn = false;
            this.paint();
        },200);
        notify(event.node,'ev-btn-tap',{});
    }
}
