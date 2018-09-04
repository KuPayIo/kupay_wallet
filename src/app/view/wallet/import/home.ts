/**
 * import enter 
 */
import { Widget } from '../../../../pi/widget/widget';

export class ImportHome extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            tabList:[{
                tab:'助记词',
                components:'app-view-wallet-import-standardImport'
            },{
                tab:'照片',
                components:'app-view-wallet-import-imageImport'
            },{
                tab:'片段',
                components:'app-view-wallet-import-fragmentImport'
            }]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}