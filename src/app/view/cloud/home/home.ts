/**
 * 云端首页
 */
// ===================================================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAward, getCloudBalance, getDividend, getInviteCode, getInviteCodeDetail, getMineRank, getMining } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { find, getBorn, register } from '../../../store/store';
import { formatBalance } from '../../../utils/tools';

// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        this.state = {
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            bonus: 0.00,// 累计分红
            mines: 0,// 今日可挖数量
            isAbleBtn: false, // 挖矿按钮是否可点击
            hasWallet:true // 是否已经创建钱包
        };

        this.initDate();

        if (this.props.isActive) {
            this.initEvent();
        }
    }
    
    /**
     * 点击云端账户
     */
    public async cloudAccountClicked() {
        if (!this.state.hasWallet) {
            popNew('app-components-linkMessage-linkMessage',{ 
                tip:'还没有钱包',
                linkTxt:'去创建',
                linkCom:'app-view-wallet-walletCreate-createWalletEnter' 
            });
                
        } else {
            popNew('app-view-cloud-cloudAccount-cloudAccount', { ktBalance: this.state.ktBalance, ethBalance: this.state.ethBalance });
        }
    }

    /**
     * 点击发红包
     */
    public packetsClicked() {
        // TODO
        if (!this.state.hasWallet) {
            popNew('app-components-linkMessage-linkMessage',{ 
                tip:'还没有钱包',
                linkTxt:'去创建',
                linkCom:'app-view-wallet-walletCreate-createWalletEnter' 
            });
                
        } else {
            popNew('app-view-redEnvelope-send-sendRedEnvelope');
        }
    }

    /**
     * 点击兑换领奖
     */
    public awardsClicked() {
        // TODO
        if (!this.state.hasWallet) {
            popNew('app-components-linkMessage-linkMessage',{ 
                tip:'还没有钱包',
                linkTxt:'去创建',
                linkCom:'app-view-wallet-walletCreate-createWalletEnter' 
            });
                
        } else {
            popNew('app-view-redEnvelope-receive-convertRedEnvelope');
        }
    }
    /**
     * 领分红
     */
    public bonusClicked() {
        // TODO
        if (!this.state.hasWallet) {
            popNew('app-components-linkMessage-linkMessage',{ 
                tip:'还没有钱包',
                linkTxt:'去创建',
                linkCom:'app-view-wallet-walletCreate-createWalletEnter' 
            });
                
        } else {
            popNew('app-view-mine-dividend-dividend', { totalHold: this.state.ktBalance });
        }
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
        if (!this.state.hasWallet) {
            popNew('app-components-linkMessage-linkMessage',{ 
                tip:'还没有钱包',
                linkTxt:'去创建',
                linkCom:'app-view-wallet-walletCreate-createWalletEnter' 
            });
                
        } else {
            // popNew('app-view-mine-dividend-mining');
            popNew('app-view-mine-dividend-test');
        }
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
        getCloudBalance();
        popNew('app-components-message-message', { itype: 'outer', center: true, content: '挖矿成功' });
        this.state.isAbleBtn = false;
        getMining();
        this.paint();
    }
    /**
     * 邀请红包
     */
    public async inviteRedEnvelopeClick() {
        if (!this.state.hasWallet) {
            popNew('app-components-linkMessage-linkMessage',{ 
                tip:'还没有钱包',
                linkTxt:'去创建',
                linkCom:'app-view-wallet-walletCreate-createWalletEnter' 
            });
                
        } else {
            const inviteCodeInfo = await getInviteCode();
            const inviteCodeDetailInfo = await getInviteCodeDetail();
            if (inviteCodeInfo.result !== 1 || inviteCodeDetailInfo.result !== 1) return;
            popNew('app-view-redEnvelope-send-inviteRedEnvelope', {
                inviteCode: inviteCodeInfo.cid, inviteCodeDetailInfo: inviteCodeDetailInfo.value
            });
        }
    }

    /**
     * 刷新云端余额
     */
    public refreshCloudBalance() {
        const cloudBalance = getBorn('cloudBalance');
        this.state.ktBalance = formatBalance(cloudBalance.get(CurrencyType.KT));
        this.state.ethBalance = formatBalance(cloudBalance.get(CurrencyType.ETH));
        this.paint();
    }

    /**
     * 获取更新数据
     */
    private async initDate() {
        this.refreshCloudBalance();

        const walletList = find('walletList');
        if (!walletList || walletList.length === 0) {
            this.state.hasWallet = false;
        }

        const mining = find('miningTotal');
        if (mining !== null && mining.thisNum > 0) {
            this.state.isAbleBtn = true;
            this.state.mines = mining.thisNum;
        } else {
            this.state.isAbleBtn = false;
        }

        const divid = find('dividTotal');
        this.state.bonus = divid ? divid.totalDivid : 0;
        this.paint();
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getMining();
        getDividend();
        getMineRank(100);
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('cloudBalance', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.refreshCloudBalance();
    }
});

register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});

register('dividTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});
/**
 * 矿山增加项目进入分享好友页面
 */
register('mineItemJump',(arg) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        if (arg === 'shareFriend') {
            w.inviteRedEnvelopeClick();
        }
    }
});

interface Props {
    isActive: boolean;
}
