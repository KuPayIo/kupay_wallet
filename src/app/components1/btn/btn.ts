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
    name:any;
    types?:string;
    color?:string;
    style?:string;
    cannotClick?:boolean;
}
// ================================ 导出

export class Btn extends Widget {
    public props:any;
    public ok: () => void;
    public setProps(props:JSON) {
        super.setProps(props);
        this.props = {
            ...this.props,
            isAbleBtn:false,
            isString:typeof this.props.name === 'string'
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(event: any) {
        if (!this.props.cannotClick) {
            this.props.isAbleBtn = true;
            this.paint();

            setTimeout(() => {// 按钮动画效果执行完后改为未点击状态，则可以再次点击
                this.props.isAbleBtn = false;
                this.paint();
            }, 200);
            notify(event.node, 'ev-btn-tap', {});
        }
    }
}
