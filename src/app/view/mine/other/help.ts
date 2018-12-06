/**
 * help
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { getStaticLanguage } from '../../../utils/tools';
// ================================================导出
export class FAQ extends Widget {
    public ok: () => void;
    
    public create() {
        super.create();
        this.props = {        
            htmlStrList:getStaticLanguage().helpAnswer
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}