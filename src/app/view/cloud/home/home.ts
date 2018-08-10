/**
 * 云端首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { cloudAccount } from '../../../store/cloudAccount';
import {  getAward, getDividend, getInviteCode, getInviteCodeDetail, getMining } from '../../../store/conMgr';
import { register, unregister } from '../../../store/store';
import { formatBalance, kpt2kt, wei2Eth } from '../../../utils/tools';
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
            bonus: 0.00,// 累计分红
            mines: 0,// 今日可挖数量
            isAbleBtn: true // 挖矿按钮是否可点击
        };

        this.initDate();
    }
    /**
     * 点击eth跳转充值提现
     */
    public ethHoldingsClicked() {
        // 跳转充值提现
        // popNew('app-view-cloud-accountAssests-accountAssests',{ coinType:'ETH' });
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
        popNew('app-view-mine-dividend-dividend',this.state.ktBalance);
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
     * 显示挖矿详情
     */
    public mining() {
        popNew('app-view-mine-dividend-mining');
    }
    /**
     * 挖矿
     */
    public async doPadding() {
        const r = await getAward();
        if (r.result !== 1) {
            popNew('app-components-message-message', { itype: 'outer', center: true, content: `挖矿失败(${r.result})` });

            return;
        }
        cloudAccount.updateBalance();
        popNew('app-components-message-message', { itype: 'outer', center: true, content: '挖矿成功' });
    }
    /**
     * 邀请红包
     */
    public async inviteRedEnvelopeClick() {
        const inviteCodeInfo = await getInviteCode();
        const inviteCodeDetailInfo = await getInviteCodeDetail();
        if (inviteCodeInfo.result !== 1 || inviteCodeDetailInfo.result !== 1) return;
        popNew('app-view-redEnvelope-send-inviteRedEnvelope', {
            inviteCode: inviteCodeInfo.cid, inviteCodeDetailInfo: inviteCodeDetailInfo.value
        });
    }

    public destroy() {
        unregister('cloudBalance',null);

        return super.destroy();
    }
    private async initDate() {
        const cloudBalance = cloudAccount.cloudBalance;
        this.state.ktBalance = formatBalance(cloudBalance.KT);
        this.state.ethBalance = formatBalance(cloudBalance.ETH);
        register('cloudBalance',(cloudBalance) => {
            this.state.ktBalance = formatBalance(cloudBalance.KT);
            this.state.ethBalance = formatBalance(cloudBalance.ETH);
            this.paint();
        });
        const msg = await getMining();
        const totalNum = kpt2kt(msg.mine_total);
        const holdNum = kpt2kt(msg.mines);
        const today = kpt2kt(msg.today);
        let nowNum = (totalNum - holdNum + today) * 0.25 - today;  // 今日可挖数量为矿山剩余量的0.25减去今日已挖
        if (nowNum <= 0) {
            nowNum = 0;  // 如果今日可挖小于等于0，表示现在不能挖
            this.state.isAbleBtn = false;
        } else if ((totalNum - holdNum) > 100) {
            nowNum = (nowNum < 100 && (totalNum - holdNum) > 100) ? 100 :nowNum;  // 如果今日可挖小于100，且矿山剩余量大于100，则今日可挖100
        } else {
            nowNum = totalNum - holdNum;  // 如果矿山剩余量小于100，则本次挖完所有剩余量
        }        
        this.state.mines = nowNum;

        const divid = await getDividend();
        this.state.bonus = wei2Eth(divid.value[0]);
        this.paint();
    }
}