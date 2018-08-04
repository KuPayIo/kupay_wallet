/**
 * 云端首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyType, getAllBalance } from '../../../store/conMgr';
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
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            bonus: 0.00// 累计分红
        };

        this.initDate();
    }

    /**
     * 点击云端账户
     */
    public async cloudAccountClicked() {
        popNew('app-view-cloud-cloudAccount-cloudAccount', { ktBalance: this.state.ktBalance, ethBalance: this.state.ethBalance });
    }

    /**
     * 点击发红包
     */
    public packetsClicked() {
        // TODO
        popNew('app-view-redEnvelope-send-sendRedEnvelope',{ balance:this.state.ktBalance });
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
        popNew('app-view-mine-dividend-dividend');
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
    /**
     * 点击挖矿
     */
    public mining() {
        popNew('app-view-mine-dividend-mining');
    }
    public inviteRedEnvelopeClick() {
        popNew('app-view-redEnvelope-send-inviteRedEnvelope');
    }

    private async initDate() {
        const balanceInfo = await getAllBalance();
        for (let i = 0; i < balanceInfo.value.length; i++) {
            const each = balanceInfo.value[i];
            if (each[0] === CurrencyType.KT) {
                this.state.ktBalance = each[1];
            } else if (each[0] === CurrencyType.ETH) {
                this.state.ethBalance = each[1];
            }
        }
        this.paint();
    }
}