/**
 * 挖矿总信息页面  
 * 
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAward, getCloudBalance, getMineDetail, getMining, getMiningHistory, getMiningRank } from '../../../net/pull';
import { find, register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = {};
        this.initData();
        this.initEvent();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看挖矿记录
     */
    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',2);
    }

    /**
     * 查看总排名情况
     */
    public goRank() {
        popNew('app-view-mine-dividend-dividendRank');
    }
  
    /**
     * 获取更新数据
     */
    public initData() {
        const data = find('miningTotal');
        const rank = find('mineRank');
        this.state = {
            totalNum:data.totalNum,
            thisNum:data.thisNum,
            holdNum:data.holdNum,
            mineRank:rank.myRank,
            doMining:false,  // 点击挖矿，数字动画效果执行
            firstClick:true,
            isAbleBtn:false,  // 点击挖矿，按钮动画效果执行
            miningNum:` <div class="miningNum" style="animation:{{it1.doMining?'move 0.5s':''}}">
            <span>+{{it1.thisNum}}</span>
        </div>`
        };
        this.paint();
    }

    /**
     * 去增加储备矿
     */
    public goAddMine() {
        popNew('app-view-mine-dividend-addMine');
    }

    /**
     * 点击挖矿
     */
    public async doMining() {
        if (this.state.thisNum > 0 && this.state.firstClick) { // 如果本次可挖大于0并且是首次点击，则需要真正的挖矿操作并刷新数据
            await getAward();
            this.state.firstClick = false;

            setTimeout(() => {// 数字动画效果执行完后刷新页面
                getMining();
                this.initEvent();
                this.paint();
            },500);

        } else {  // 添加一个新的数字动画效果并移除旧的
            const child = document.createElement('div');
            child.setAttribute('class','miningNum');
            child.setAttribute('style','animation:move 0.5s');
            // tslint:disable-next-line:no-inner-html
            child.innerHTML = '<span>+0</span>';
            document.getElementsByClassName('miningNum').item(0).remove();
            document.getElementById('miningBtn').appendChild(child);
            
        }
        this.state.doMining = true;        
        this.state.isAbleBtn = true;
        this.paint();

        setTimeout(() => {// 按钮动画效果执行完后将挖矿状态改为未点击状态，则可以再次点击
            this.state.isAbleBtn = false;
            this.paint();
        },100);
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getMiningHistory();
        getMineDetail();
        getMiningRank(100);
        getCloudBalance();
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('mineItemJump',(arg) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        if (arg === 'buyFinancial') {
            w.backPrePage();
        }
    }
});