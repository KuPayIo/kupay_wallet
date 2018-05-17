/*
 * 可以使用html语法来设置文字
 */

// ============================== 导入
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class InnerHTML extends Widget {

	public firstPaint() {
		(this.tree.link as HTMLElement).innerHTML = this.props;
	}
	public afterUpdate() {
		(this.tree.link as HTMLElement).innerHTML = this.props;
	}
}

// ============================== 本地

// ============================== 立即执行
