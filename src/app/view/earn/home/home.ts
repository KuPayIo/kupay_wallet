/**
 * earn home 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAward, getCloudBalance, getMineRank, getMining } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { find, getBorn, register } from '../../../store/store';
import { formatBalance } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props: Json, oldProps: Json) {
        super.setProps(props, oldProps);
        this.init();
    }
    
    public init(): void {
        this.state = {
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            mines: 0,// 今日可挖数量
            isAbleBtn: false, // 挖矿按钮是否可点击
            hasWallet:true, // 是否已经创建钱包
            mineLast:0,// 矿山剩余量
            rankNum:1,// 挖矿排名
            page:[
                'app-view-earn-mining-rankList',
                'app-view-earn-mining-dividend',
                'app-view-earn-redEnvelope-writeRedEnv',
                'app-view-earn-mining-dividend',
                'app-view-earn-mining-addMine'
            ]
        };

        this.initDate();
        if (this.props.isActive) {
            this.initEvent();
        }
        
    }

    /**
     * 打开我的设置
     */
    public showMine() {
        popNew('app-view-mine-home-home');
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 跳转到下一页
     */
    public goNextPage(ind:number) {
        popNew(this.state.page[ind],{ ktBalance:this.state.ktBalance });
    }

    /**
     * 挖矿说明
     */
    public miningDetail() {
        // tslint:disable-next-line:max-line-length
        popNew('app-components-modalBox-modalBox1',{ title:'挖矿说明',content:'完成任务会产生相应的KT，KT被储存在矿山中，每日可挖取矿储量的25%，最高10000KT，如果当天领取额度低于100，且矿山剩余大于100，则按照100领取，若储矿量小于100KT，则把剩下的一次性挖完。挖矿结算后，挖到的数量将从储矿量中减去。',tips:'曾经拥有1000KT才具有提现权限' });
    }

    /**
     * 点击挖矿按钮
     */
    public async doPadding() {
        if (this.state.isAbleBtn) {
            const r = await getAward();
            if (r.result !== 1) {
                popNew('app-components-message-message', { itype: 'outer', center: true, content: `挖矿失败(${r.result})` });
    
                return;
            }
            popNew('app-components-message-message', { itype: 'outer', center: true, content: '挖矿成功' });
            this.state.isAbleBtn = false;
            this.initEvent();
            this.paint();
        }
        
    }

    /**
     * 刷新云端余额
     */
    public refreshCloudBalance() {
        const cloudBalance = getBorn('cloudBalance');
        if (cloudBalance) {
            this.state.ktBalance = formatBalance(cloudBalance.get(CurrencyType.KT));
            this.state.ethBalance = formatBalance(cloudBalance.get(CurrencyType.ETH));
        }
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
        if (mining) {
            if (mining.thisNum > 0) {
                this.state.isAbleBtn = true;
            }
            this.state.mines = mining.thisNum;
            this.state.mineLast = mining.totalNum - mining.holdNum;

        } else {
            this.state.isAbleBtn = false;
        }

        const rank = find('mineRank');
        if (rank) {
            this.state.rankNum = rank.myRank;
        }
        
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getCloudBalance();
        getMining();
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
register('mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});