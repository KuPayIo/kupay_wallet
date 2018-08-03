/**
 * 云端首页
 */
import { request } from '../../../../pi/net/ui/con_mgr';
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
            ktBalance: '5,000.00',// kt余额
            ethBalance: '70.00',// eth余额
            bonus: '0.9152'// 累计分红
        };

        const msg = { type: 'wallet/account@get', param: { list: '[100, 101]' } };
        request(msg, (resp) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
            } else if (resp.result !== undefined) {
                for (let i = 0; i < resp.value.length; i++) {
                    const each = resp.value[i];
                    if (each[0] === 100) {
                        this.state.ktBalance = each[1];
                    } else if (each[0] === 101) {
                        this.state.ethBalance = each[1];
                    }
                }
                this.paint();
            }
        });
    }

    /**
     * 点击云端账户
     */
    public async cloudAccountClicked() {
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
}