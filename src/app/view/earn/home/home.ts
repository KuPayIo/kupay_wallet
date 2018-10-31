/**
 * earn home 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAward, getMining, getMiningRank, getServerCloudBalance } from '../../../net/pull';
import { CloudCurrencyType, Mining } from '../../../store/interface';
import { getCloudBalances, getStore, register } from '../../../store/memstore';
import { formatBalance, getLanguage, getUserInfo } from '../../../utils/tools';

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
        this.initEvent();

    }
    /**
     * 初始化数据
     */
    public init() {
        this.state = {
            ktBalance: 0.00,// kt余额
            ethBalance: 0.00,// eth余额
            holdMines: 0,// 累计挖矿
            mines: 0,// 今日可挖数量
            hasWallet: false, // 是否已经创建钱包
            mineLast: 0,// 矿山剩余量
            rankNum: 1,// 挖矿排名
            page: [
                'app-view-earn-mining-rankList', // 挖矿排名
                'app-view-earn-mining-dividend', // 领分红
                'app-view-earn-redEnvelope-writeRedEnv', // 发红包
                'app-view-earn-exchange-exchange', // 兑换
                'app-view-earn-mining-addMine'  // 任务
            ],
            doMining: false,  // 点击挖矿，数字动画效果执行
            firstClick: true,
            isAbleBtn: false,  // 点击挖矿，按钮动画效果执行
            miningNum: ` <div class="miningNum" style="animation:{{it1.doMining?'move 0.5s':''}}">
                <span>+{{it1.thisNum}}</span>
            </div>`,
            cfgData: getLanguage(this),
            scroll: false,
            scrollHeight: 0,
            refresh: false,
            avatar: '../../../res/image1/default_avatar.png'
        };
        this.initData();
    }
    /**
     * 判断当前用户是否已经创建钱包
     */
    public judgeWallet() {
        if (this.state.hasWallet) {
            return true;
        }
        popNew('app-components-modalBox-modalBox', this.state.cfgData.login, () => {
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
    public goNextPage(ind: number) {
        if (!this.judgeWallet()) {
            return;
        }
        popNew(this.state.page[ind], { ktBalance: this.state.ktBalance });
    }

    /**
     * 挖矿说明
     */
    public miningDesc() {
        // tslint:disable-next-line:max-line-length
        popNew('app-components-modalBox-modalBox1', this.state.cfgData.miningDesc);
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
            }, 300);

        } else {  // 添加一个新的数字动画效果并移除旧的
            const child = document.createElement('span');
            child.setAttribute('class', 'miningNum');
            child.setAttribute('style', 'animation:miningEnlarge 0.5s');
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
        }, 100);

    }

    /**
     * 屏幕滑动
     */
    public scrollPage(e: any) {
        const scrollTop = e.target.scrollTop;
        this.state.scrollHeight = scrollTop;
        if (scrollTop > 0) {
            this.state.scroll = true;
            if (this.state.scroll) {
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.state.refresh = true;
        this.initEvent();
        this.paint();
        setTimeout(() => {
            this.state.refresh = false;
            this.paint();
        }, 1000);

    }

    /**
     * 获取更新数据
     */
    private initData() {
        const wallet = getStore('wallet');
        if (!wallet) {
            this.paint();

            return;
        }
        this.state.hasWallet = true;

        const cloudBalances = getCloudBalances();

        if (cloudBalances) {
            this.state.ktBalance = formatBalance(cloudBalances.get(CloudCurrencyType.KT));
            this.state.ethBalance = formatBalance(cloudBalances.get(CloudCurrencyType.ETH));
        }

        const mining: Mining = getStore('activity/mining');
        if (mining.total) {
            if (mining.total.thisNum > 0) {
                this.state.isAbleBtn = true;
            }
            this.state.mines = formatBalance(mining.total.thisNum);
            this.state.mineLast = formatBalance(mining.total.totalNum - mining.total.holdNum);
            this.state.holdMines = formatBalance(mining.total.holdNum);
        } else {
            this.state.isAbleBtn = false;
        }

        if (mining.total && mining.miningRank) {
            this.state.rankNum = mining.miningRank.myRank;
        }

        const userInfo = getUserInfo();
        if (userInfo) {
            this.state.avatar = userInfo.avatar ? userInfo.avatar : '../../../res/image1/default_avatar.png';
        }
        this.paint();
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        if (this.props.isActive && this.state.hasWallet) {
            getServerCloudBalance();
            getMining();
            getMiningRank(100);
            this.paint();
        }
    }

}

// ===================================================== 本地
// ===================================================== 立即执行
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

register('activity/mining/total', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('activity/mining/miningRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init(); // 注销钱包后初始化
        w.initEvent();
    }
});
register('setting/language', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
register('user/conRandom', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initEvent();
    }
});