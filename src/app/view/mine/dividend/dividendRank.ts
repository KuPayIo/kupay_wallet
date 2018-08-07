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
            mineSecond:false,
            mineThird:false,
            mineRank:[
                {
                    index:1,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:2,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:3,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:4,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:5,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:6,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:7,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:8,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:9,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                },{
                    index:10,
                    name:'昵称未设置',
                    num:'96,554,000.00'
                }
            ],
            miningSecond:false,
            miningThird:false,
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
     * @param ind 挖矿排名或矿山排名
     */
    public gotoMore(ind:number) {
        popNew('app-view-mine-dividend-rankList',  ind);
    }

    public getMore(ind:number) {
        this.state.gainRank.push({
            index:1,
            name:'昵称未设置',
            num:'96,554,000.00'
        },{
            index:2,
            name:'昵称未设置',
            num:'96,554,000.00'
        },{
            index:3,
            name:'昵称未设置',
            num:'96,554,000.00'
        });
        this.paint();
    }

    public async initData() {
        const msg1 = await getMineRank(100);
        const msg2 = await getMiningRank(100);
        window.localStorage.mineRank = JSON.stringify(msg1);
        window.localStorage.miningRank = JSON.stringify(msg2);

        if (msg1.value.length > 1) {
            this.state.mineSecond = true;
        }
        if (msg1.value.length > 2) {
            this.state.mineSecond = true;
            this.state.mineThird = true;
        }
        if (msg2.value.length > 1) {
            this.state.miningSecond = true;
        }
        if (msg2.value.length > 2) {
            this.state.miningSecond = true;
            this.state.miningThird = true;
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