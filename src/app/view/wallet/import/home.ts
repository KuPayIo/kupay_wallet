/**
 * import enter 
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class ImportHome extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const cfg = getLanguage(this);
        this.state = {
            tabList:[{
                tab:cfg.tabs[0],
                components:'app-view-wallet-import-standardImport'
            },{
                tab:cfg.tabs[1],
                components:'app-view-wallet-import-imageImport'
            },{
                tab:cfg.tabs[2],
                components:'app-view-wallet-import-fragmentImport'
            }]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public importSuccess() {
        console.log('-----------success');
        this.ok && this.ok();
        popNew('app-components-modalBox-modalBox',this.state.cfgData.modalBox,() => {
            // popNew('app-view-wallet-create-createEnter');
        });
    }
}