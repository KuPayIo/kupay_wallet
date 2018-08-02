/**
 * 挖矿或矿山排名详细列表 
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';

export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props: Json, oldProps?: Json) {
        super.setProps(props,oldProps);
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

    public backPrePage() {
        this.ok && this.ok();
    }

}