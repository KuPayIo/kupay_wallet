/**
 * help
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage } from '../../../utils/tools';
import { Config } from '../../base/config';
// ================================================导出
export class FAQ extends Widget {
    public ok: () => void;
    
    public create() {
        super.create();
        this.state = {        
            htmlStrList:Config.helpAnswer,
            cfgData:getLanguage(this)
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}