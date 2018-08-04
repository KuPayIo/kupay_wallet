/**
 * 挖矿及矿山排名
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

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
        this.state = {
            gainRank:[
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
}