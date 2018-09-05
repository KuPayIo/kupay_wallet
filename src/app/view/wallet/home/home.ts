/**
 * wallet home 
 */
// ==============================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { register } from '../../../store/store';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            tabs:[{
                tab:'云账户',
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:'本地钱包',
                components:'app-view-wallet-home-walletHome'
            }],
            activeNum:1,
            avatar:''
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }

    public avatarChange(avatar:string) {
        this.state.avatar = avatar;
        console.log('----------avatar change111111',avatar);
        this.paint();
    }
}

// ==========================本地
register('avatar',(avatar:string) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        console.log('----------avatar change',avatar);
        w.avatarChange(avatar);
    }
});