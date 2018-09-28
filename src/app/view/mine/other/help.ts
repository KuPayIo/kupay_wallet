/**
 * help
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage, getStaticLanguage } from '../../../utils/tools';
// ================================================导出
export class FAQ extends Widget {
    public ok: () => void;
    
    public create() {
        super.create();
        this.state = {        
            htmlStrList:getStaticLanguage().helpAnswer,
            cfgData:getLanguage(this)
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}