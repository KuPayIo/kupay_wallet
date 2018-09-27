/**
 * ThreeParaItem
 */
// ================================ 导入
import { Widget } from '../../../pi/widget/widget';

interface Props {
    img:string;
    title:string;
    desc:string;
}
// ================================ 导出

export class ThreeParaItem extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }
}
