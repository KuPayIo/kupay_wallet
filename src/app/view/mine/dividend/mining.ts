/**
 * 挖矿总信息页面  
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getMineRank, getMining } from '../../../store/conMgr';
import { kpt2kt } from '../../../utils/tools';

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
    public async initData() {
        const msg = await getMining();
        const totalNum = kpt2kt(msg.mine_total);
        const holdNum = kpt2kt(msg.mines);
        const today = kpt2kt(msg.today);
        let nowNum = (totalNum - holdNum + today) * 0.25 - today;  // 本次可挖数量为矿山剩余量的0.25减去今日已挖
        if (nowNum <= 0) {
            nowNum = 0;  // 如果本次可挖小于等于0，表示现在不能挖
        } else if ((totalNum - holdNum) > 100) {
            nowNum = (nowNum < 100 && (totalNum - holdNum) > 100) ? 100 :nowNum;  // 如果本次可挖小于100，且矿山剩余量大于100，则本次可挖100
        } else {
            nowNum = totalNum - holdNum;  // 如果矿山剩余量小于100，则本次挖完所有剩余量
        }
        
        this.state.totalNum = totalNum;
        this.state.thisNum = nowNum;
        this.state.holdNum = holdNum; 

        const mineRank = await getMineRank(100);
        this.state.mineRank = mineRank.me;
        this.paint();
        
    }

    /**
     * 去增加储备矿
     */
    public goAddMine() {
        popNew('app-view-mine-dividend-addMine');
    }
}