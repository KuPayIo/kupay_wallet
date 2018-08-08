/**
 * 挖矿及矿山排名
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getMineRank, getMiningRank } from '../../../store/conMgr';
import { kpt2kt } from '../../../utils/tools';

export class DividendItem extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public create() {
        super.create();
        this.init();
        this.initData();
    }

    public init() {
        this.state = {
            mineSecond:false,  // 矿山排名第二名是否存在
            mineThird:false,   // 矿山排名第三名是否存在
            minePage:1,  // 矿山排名列表页码
            mineMore:false,  // 矿山排名是否还有更多  
            mineList:[],  // 矿山排名列表
            mineRank:[
                {
                    index:1,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                }
            ],
            miningSecond:false,   // 挖矿排名第二名是否存在
            miningThird:false,   // 挖矿排名第三名是否存在
            miningPage:1,  // 挖矿排名列表页码
            miningMore:false,  // 挖矿排名是否还有更多
            miningList:[],  // 挖矿排名列表
            miningRank:[
                {
                    index:1,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                }
            ]
        };
    }
    
    /**
     * 查看排名详情列表
     * @param ind 1 为矿山排名，2 为挖矿排名
     */
    public gotoMore(ind:number) {
        if (ind === 1) {
            popNew('app-view-mine-dividend-rankList', { data:this.state.mineList });
        } else {
            popNew('app-view-mine-dividend-rankList',  { data:this.state.miningList });
        }
        
    }

    public getMore(ind:number) {
        if (ind === 1) {
            const msg = this.state.mineList;
            for (let i = this.state.minePage * 10;i < msg.length && i < (this.state.minePage + 1) * 10; i++) {
                this.state.mineRank.push({
                    index: i + 1,
                    name: msg[i][1] === '' ? '昵称未设置' : msg[i][1],
                    num: kpt2kt(msg[i][2])
                });
            }
        } else {
            const msg = this.state.miningList;
            for (let i = this.state.minePage * 10;i < msg.length && i < (this.state.minePage + 1) * 10; i++) {
                this.state.miningRank.push({
                    index: i + 1,
                    name: msg[i][1] === '' ? '昵称未设置' : msg[i][1],
                    num: kpt2kt(msg[i][2])
                });
            }
        }
        this.paint();
    }

    public async initData() {
        const msg1 = await getMineRank(100);
        const msg2 = await getMiningRank(100);
        this.state.mineList = msg1.value;
        this.state.miningList = msg2.value;

        if (msg1.value.length > 10) {
            this.state.mineMore = true;
            this.state.mineSecond = true;
            this.state.mineThird = true;
        } else if (msg1.value.length > 2) {
            this.state.mineSecond = true;
            this.state.mineThird = true;
        } else if (msg1.value.length > 1) {
            this.state.mineSecond = true;
        }
        
        if (msg2.value.length > 10) {
            this.state.miningMore = true;
            this.state.miningSecond = true;
            this.state.miningThird = true;
        } else if (msg2.value.length > 2) {
            this.state.miningSecond = true;
            this.state.miningThird = true;
        } else if (msg2.value.length > 1) {
            this.state.miningSecond = true;
        }
        
        const data1 = [];
        for (let i = 0;i < msg1.value.length && i < 10;i++) {
            data1.push({
                index: i + 1,
                name: msg1.value[i][1] === '' ? '昵称未设置' : msg1.value[i][1],
                num: kpt2kt(msg1.value[i][2])
            });
        }
        this.state.mineRank = data1;

        const data2 = [];
        for (let i = 0;i < msg2.value.length && i < 10;i++) {
            data2.push({
                index: i + 1,
                name: msg2.value[i][1] === '' ? '昵称未设置' : msg2.value[i][1],
                num: kpt2kt(msg2.value[i][2])
            });
        }
        this.state.miningRank = data2;
        this.paint();
    }
}