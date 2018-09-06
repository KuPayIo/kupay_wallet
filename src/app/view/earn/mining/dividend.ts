/**
 * 挖矿总信息页面  
 * 
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAward, getMining, getDividend, getDividHistory } from '../../../net/pull';
import { find, register } from '../../../store/store';
import { Json } from '../../../../pi/lang/type';

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

    public setProps(props: Json, oldProps: Json) {
        super.setProps(props, oldProps);
        this.state = {
            totalDivid:0,
            totalDays:0,
            thisDivid:0,
            yearIncome: '暂未分红' ,
            doMining:false,  // 点击挖矿，数字动画效果执行
            firstClick:true,
            isAbleBtn:false,  // 点击挖矿，按钮动画效果执行
            miningNum:` <div class="miningNum" style="animation:{{it1.doMining?'move 0.5s':''}}">
                <span>+{{it1.thisNum}}</span>
            </div>`,
            scroll:false,
            dividHistory:[], // 分红历史记录
            more:true, // 是否还有更多历史记录
            ktBalance:this.props.ktBalance  // KT持有量 
        };

        this.initData();
        this.initEvent();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看分红说明
     */
    public goDetail() {
        popNew('app-view-earn-mining-dividendDetail');
    }

    /**
     * 获取更新数据
     */
    public initData() {
        const data = find('dividTotal');
        if(data){
            this.state.totalDivid = data.totalDivid;
            this.state.totalDays = data.totalDays;
            this.state.thisDivid = data.thisDivid;
            this.state.yearIncome = Number(data.yearIncome) === 0 ? '暂未分红' :data.yearIncome;
        }

        const history = find('dividHistory');
        // const history = [{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"},{num:0.02,time:"04-30  14:32:00"}]
        if(history){
            this.state.dividHistory = history;
            this.state.more = false;
        }
        this.paint();
    }

    /**
     * 页面滑动
     */
    public scroll(){
        if(document.getElementById('content').scrollTop > 0){
            this.state.scroll = true;
            if(this.state.scroll){
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }

    /**
     * 点击领分红
     */
    public async doMining() {
        if (this.state.thisDivid > 0 && this.state.firstClick) { // 如果本次可挖大于0并且是首次点击，则需要真正的挖矿操作并刷新数据
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
        getDividend();
        getDividHistory();
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('dividTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('dividHistory', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});