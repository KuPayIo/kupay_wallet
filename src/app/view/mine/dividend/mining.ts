/**
 * 挖矿总信息页面  
 * 
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find, register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    public state: {
        totalNum:number; // 矿山总量
        thisNum:number;  // 本次可挖
        holdNum:number;  // 已挖数量
        mineRank:number;  // 当前用户的矿山排名
    };
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.init();
        this.initData();
    }

    /**
     * 初始化state参数
     */
    public init() {
        this.state = {
            totalNum:0,
            thisNum:0,
            holdNum:0,
            mineRank:1
        };
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
        this.state.totalNum = data.totalNum;
        this.state.thisNum = data.thisNum;
        this.state.holdNum = data.holdNum; 
        // const msg = find('');
        this.paint();
        
    }

    /**
     * 去增加储备矿
     */
    public goAddMine() {
        popNew('app-view-mine-dividend-addMine');
    }
}

register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});