/**
 * wallet home 
 */
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';

export class Home extends Widget {
    public ok:()=>void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            tabs:[{
                tab:'挖矿排名',
                components:'app-view-earn-mining-miningRank'
            },{
                tab:'矿山排名',
                components:'app-view-earn-mining-miningRank'
            }],
            activeNum:0
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }

    public goHistory(){
        popNew('app-view-earn-mining-miningHistory');
    }

    public backPrePage() {
        this.ok && this.ok();
    } 
}