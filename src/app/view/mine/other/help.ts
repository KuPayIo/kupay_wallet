/**
 * help
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { Config } from '../../base/config';
// ================================================导出
export class FAQ extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {        
            htmlStrList:Config.helpAnswer
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}