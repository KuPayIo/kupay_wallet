/**
 * 创建 导入页面顶部提示卡片
 */
import { Widget } from '../../../../pi/widget/widget';
interface Props {
    title:string;
    content:string;
    titleStyle?:string;
    contentStyle?:string;
}
export class TipsCard extends Widget {
    public props:Props;
}