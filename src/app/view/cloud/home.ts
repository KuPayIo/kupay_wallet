/**
 * 云端首页
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
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
            cloudBalance: '￥50.050',// 云端账户余额
            exchangeRate: '0.000000109',// 兑换率
            totalDeal: '2652125.624',// 交易量
            totalDealYNC: '￥106,088.98',// 交易量换算人名币
            increase: '-2.63%'// 涨跌幅
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