/**
 * earn home 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAward, getCloudBalance, getMining, getMiningRank } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { find, getBorn, register } from '../../../store/store';
import { formatBalance, getLanguage } from '../../../utils/tools';

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
        if (this.props.isActive && this.state.hasWallet) {
            this.initEvent();
        }
    }
    /**
     * 初始化数据
     */
    public init() {
        this.state = {
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            mines: 0,// 今日可挖数量
            hasWallet:false, // 是否已经创建钱包
            mineLast:0,// 矿山剩余量
            rankNum:1,// 挖矿排名
            page:[
                'app-view-earn-mining-rankList',
                'app-view-earn-mining-dividend',
                'app-view-earn-redEnvelope-writeRedEnv',
                'app-view-earn-exchange-exchange',
                'app-view-earn-mining-addMine'
            ],
            doMining:false,  // 点击挖矿，数字动画效果执行
            firstClick:true,
            isAbleBtn:false,  // 点击挖矿，按钮动画效果执行
            miningNum:` <div class="miningNum" style="animation:{{it1.doMining?'move 0.5s':''}}">
                <span>+{{it1.thisNum}}</span>
            </div>`,
            cfgData:getLanguage(this)
        };

        this.initDate();
    }
    /**
     * 判断当前用户是否已经创建钱包
     */
    public judgeWallet() {
        if (this.state.hasWallet) {
            return true;
        }
        popNew('app-components-modalBox-modalBox',this.state.cfgData.login,() => {
            popNew('app-view-wallet-create-home');
        });
        
        return false;
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
        if (!this.judgeWallet()) {
            return;
        }
        popNew(this.state.page[ind],{ ktBalance:this.state.ktBalance });
    }

    /**
     * 挖矿说明
     */
    public miningDesc() {
        // tslint:disable-next-line:max-line-length
        popNew('app-components-modalBox-modalBox1',this.state.cfgData.miningDesc);
    }

    /**
     * 点击挖矿按钮
     */
    public async doPadding() {
        if (!this.judgeWallet()) {
            return;
        }
        if (this.state.mines > 0 && this.state.firstClick) { // 如果本次可挖大于0并且是首次点击，则需要真正的挖矿操作并刷新数据
            await getAward();
            this.state.firstClick = false;

            setTimeout(() => {// 数字动画效果执行完后刷新页面
                this.initEvent();
                this.paint();
            },300);

        } else {  // 添加一个新的数字动画效果并移除旧的
            const child = document.createElement('span');
            child.setAttribute('class','miningNum');
            child.setAttribute('style','animation:miningEnlarge 0.5s');
            // tslint:disable-next-line:no-inner-html
            child.innerHTML = '<span>+0</span>';
            document.getElementsByClassName('miningNum').item(0).remove();
            document.getElementById('mining').appendChild(child);
            
        }
        this.state.doMining = true;        
        this.state.isAbleBtn = true;
        this.paint();

        setTimeout(() => {// 按钮动画效果执行完后将领分红状态改为未点击状态，则可以再次点击
            this.state.isAbleBtn = false;
            this.paint();
        },100);
        
    }

    /**
     * 获取更新数据
     */
    private initDate() {
        const wallet = find('curWallet');
        if (!wallet) {
            this.paint();

            return;
        }
        this.state.hasWallet = true;
        
        const cloudBalance = getBorn('cloudBalance');
        if (cloudBalance) {
            this.state.ktBalance = formatBalance(cloudBalance.get(CurrencyType.KT));
            this.state.ethBalance = formatBalance(cloudBalance.get(CurrencyType.ETH));
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

        const rank = find('miningRank');
        if (rank) {
            this.state.rankNum = rank.myRank;
        }
        
        this.paint();
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getCloudBalance();
        getMining();
        getMiningRank(100);
    }

}

// ===================================================== 本地
// ===================================================== 立即执行
register('cloudBalance', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});

register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});
register('miningRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});
register('curWallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init(); // 注销钱包后初始化
    }
});
register('languageSet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});