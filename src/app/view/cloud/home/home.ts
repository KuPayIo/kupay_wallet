/**
 * 云端首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            ktBalance:'5,000.00KT',// kt余额
            ethBalance:'70.00',// eth余额
            bonus:'0.9152'// 累计分红
           
        };
    }

    /**
     * 点击云端账户
     */
    public cloudAccountClicked() {
        // TODO
        popNew('app-view-cloud-cloudAccount-cloudAccount');
    }

    /**
     * 点击发红包
     */
    public packetsClicked() {
        // TODO
        popNew('app-view-redEnvelope-send-sendRedEnvelope');
    }

    /**
     * 点击兑换领奖
     */
    public awardsClicked() {
        // TODO
        popNew('app-view-redEnvelope-receive-convertRedEnvelope');
    }
    /**
     * 领分红
     */
    public bonusClicked() {
        // TODO
    }
    /**
     * 点击邀请好友
     */
    public friendsClicked() {
        // TODO
    }
    public toTradingPlaces() {
        // TODO
    }
}