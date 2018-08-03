/**
 * 云端首页
 */
import { request } from '../../../../pi/net/ui/con_mgr';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { EthWallet } from '../../../core/eth/wallet';
import { sign } from '../../../core/genmnemonic';
import { GlobalWallet } from '../../../core/globalWallet';
import { dataCenter } from '../../../store/dataCenter';
import { getCurrentWallet, getLocalStorage, openBasePage } from '../../../utils/tools';
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
            ktBalance: '5,000.00KT',// kt余额
            ethBalance: '70.00',// eth余额
            bonus: '0.9152'// 累计分红

        };
    }

    /**
     * 点击云端账户
     */
    public async cloudAccountClicked() {
        const passwd = await openBasePage('app-components-message-messageboxPrompt', {
            title: '输入密码', content: '', inputType: 'password'
        });
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const wlt: EthWallet = await GlobalWallet.createWlt('ETH', passwd, wallet, 0);
        console.log(dataCenter.getConRandom(), wlt.exportPrivateKey());
        const signStr = sign(dataCenter.getConRandom(), wlt.exportPrivateKey());
        const msgLogin = { type: 'login', param: { sign: signStr } };
        request(msgLogin, (resp) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
            } else if (resp.result !== undefined) {
                console.log(resp.result);
                // dataCenter.setConRandom(resp.rand);
            }
        });

        return;
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