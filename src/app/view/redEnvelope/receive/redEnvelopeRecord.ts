/**
 * red-envelope record
 */
import { Widget } from '../../../../pi/widget/widget';

export class RedEnvelopeRecord extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            redEnvelopeList:[
                {
                    type:'等额红包',
                    time:'04-12  14:32:00',
                    currencyName:'ETH',
                    amount:1,
                    leaveMessage:'恭喜发财,大吉大利'
                },
                {
                    type:'等额红包',
                    time:'04-13  16:32:00',
                    currencyName:'ETH',
                    amount:3,
                    leaveMessage:'大吉大利,今晚吃鸡'
                }
            ]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}