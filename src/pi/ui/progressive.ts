/*
 * 渐进显示数组
 * props={direction:2, arr:[], showStart:0, showEnd:0, initCount:10, addCount:5, checkPixel:100,scrollEnd:false }
 */

// ============================== 导入
import { Json } from '../lang/type';
import { set as task } from '../util/task_mgr';
import { notify } from '../widget/event';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class Progressive extends Widget {
    // 滚动位置的状态，0表示滚动位置为开头，1表示为中间，2表示为底部
    public state: number = 0;
    /**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
    public setProps(props: Json, oldProps?: Json): void {
        props.arr = props.arr || [];
        props.orientation = props.orientation || 2;
        props.initCount = props.initCount || 10;
        props.addCount = props.addCount || 5;
        props.checkPixel = props.checkPixel || 0.5;
        props.showStart = props.showStart || 0;
        props.showEnd = props.showEnd || Math.min(props.showStart + props.initCount, props.arr.length);
        this.props = props;
    }

    /**
	 * @description 滚动监听
	 * @example
	 */
    public scroll(e:any) {
        const el = this.tree.link as Element;
        const p = this.props;
        let start, clientSize, scrollSize, check;
        if (p.orientation === 2) {
            start = el.scrollTop;
            clientSize = el.clientHeight;
            scrollSize = el.scrollHeight;
        } else {
            start = el.scrollLeft;
            clientSize = el.clientWidth;
            scrollSize = el.scrollWidth;
        }
        if (start === 0) {
            this.state = 0;
        } else if (start + clientSize >= scrollSize) {
            this.state = 2;
        } else {
            this.state = 1;
        }
        check = Number.isInteger(p.checkPixel) ? p.checkPixel : ((p.checkPixel * clientSize) | 0);
        if (start + clientSize + check >= scrollSize && p.showEnd < p.arr.length) {
            // 向尾部添加数据
            p.showEnd = Math.min(p.showEnd + p.addCount, p.arr.length);
            return this.paint();
        }
    }
}

// ============================== 本地

// ============================== 立即执行
