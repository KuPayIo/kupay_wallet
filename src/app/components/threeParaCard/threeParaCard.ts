/**
 * 带三个参数的卡片组件，也可以只传两个参数或四个参数
 * {"name":["年华收益","本次分红","已分红天数"],"data":["8%","0","1"],style:""}
 * name:标题数组
 * data:数据数组
 * style:数据的额外CSS
 */
// ================================ 导入
import { Widget } from '../../../pi/widget/widget';

interface Props {
    name:any[];
    data:any[];
    style?:string;
}
// ================================ 导出

export class ImgRankItem extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}
