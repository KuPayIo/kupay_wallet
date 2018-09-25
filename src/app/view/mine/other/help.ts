/**
 * help
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { Config } from '../../base/config';
// ================================================导出
export class FAQ extends Widget {
    public ok: () => void;
    
    public create() {
        super.create();
        let cfg = this.config.value.simpleChinese;
        const lan = find('languageSet');
        if (lan) {
            cfg = this.config.value[lan.languageList[lan.selected]];
        }
        this.state = {        
            htmlStrList:Config.helpAnswer,
            cfgData:cfg
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}