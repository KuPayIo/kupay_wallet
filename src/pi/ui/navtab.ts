/*
 * 导航选项卡
 * 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
 * props={cur:0, btn:"btn$", arr:[{tab:"input$", btn:{} }], old:{}, type:0 }
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
export class NavTab extends Widget {

    public old: any = {};
    /**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
    public setProps(props: Json, oldProps?: Json): void {
        if (!Number.isInteger(props.cur)) {
            props.cur = this.props ? this.props.cur : 0;
        }
        this.old[props.cur] = true;
        props.old = this.old;
        this.props = props;
    }
    /**
	 * @description 选择按钮切换
	 * @example
	 */
    public change(e:any) {
        console.log('===');
        if (e.cmd === this.props.cur) {
            return;
        }
        const old = this.props.cur;
        this.props.cur = e.cmd;
        this.old[e.cmd] = true;
        this.paint();
        task(notify, [this.parentNode, 'ev-change', e], 90000, 1);
    }
}

// ============================== 本地

// ============================== 立即执行
