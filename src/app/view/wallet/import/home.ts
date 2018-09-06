/**
 * import enter 
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
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
    public importSuccess() {
        console.log('-----------success');
        this.ok && this.ok();
        popNew('app-components-modalBox-modalBox',{ 
            title:'导入成功',
            content:'记得删除助记词片段的本地记录，以免被盗取。',
            sureText:'好的',
            cancelText:'知道了' 
        },() => {
            // popNew('app-view-wallet-create-createEnter');
        });
    }
}