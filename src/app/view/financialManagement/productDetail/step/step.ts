/**
 * 步骤条
 */
interface Props {
    itemList:any[];
}
// ===================================================导入
import { Widget } from '../../../../../pi/widget/widget';
// ====================================================导出
export class Step extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    
}
