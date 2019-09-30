/**
 * help
 */
// =============================================导入
import { Widget } from '../../../pi/widget/widget';
import { getHelpAnswer } from './helpText';
// ================================================导出
export class FAQ extends Widget {
    public ok: () => void;
    
    public create() {
        super.create();
        this.props = {        
            htmlStrList:getHelpAnswer()
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}