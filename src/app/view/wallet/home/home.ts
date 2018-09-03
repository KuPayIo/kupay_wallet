/**
 * wallet home 
 */
import { Widget } from '../../../../pi/widget/widget';

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
            activeNum:1
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }
}