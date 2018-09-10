/**
 * RedEnvHistory
 */
import { Widget } from '../../../../pi/widget/widget';

export class RedEnvHistory extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        this.state = {
            list:[
                { name:'拼手气红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                { name:'普通红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'拼手气红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'普通红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'拼手气红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'普通红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'拼手气红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'普通红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'拼手气红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },
                // { name:'普通红包',data:'1 ETH',time:'04-30 14:32:00',describe:'1/4个' },    
                { name:'拼手气红包',data:'1 ETH',time:'04-30 14:32:00',describe:'已过期 1/4个' }               
            ],
            scroll:false,
            more:false
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 页面滑动
     */
    public pageScroll() {
        if (document.getElementById('content').scrollTop > 0) {
            this.state.scroll = true;
            if (this.state.scroll) {
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }
}