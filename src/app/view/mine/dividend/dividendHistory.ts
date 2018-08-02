/**
 * 分红领取记录，挖矿记录
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';

interface Item {
    name:string;
    num:string;
    time:string;
    total:string;
}

export class Dividend extends Widget {
    public ok: () => void;
    public state: {data:Item[]};
    constructor() {
        super();
    }

    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.state = {
            data:[
                {
                    name:'分红',
                    num:'0.02',
                    time:'04-30 14:32:00',
                    total:'10.2'
                },{
                    name:'分红',
                    num:'0.04',
                    time:'04-27 14:32:00',
                    total:'2.4'
                },{
                    name:'分红',
                    num:'0.02',
                    time:'04-27 14:32:00',
                    total:'2.2'
                },{
                    name:'分红',
                    num:'0.032',
                    time:'04-24 14:32:00',
                    total:'7.2'
                },{
                    name:'分红',
                    num:'0.052',
                    time:'04-21 14:32:00',
                    total:'1.2'
                },{
                    name:'分红',
                    num:'0.04',
                    time:'04-27 14:32:00',
                    total:'2.4'
                },{
                    name:'分红',
                    num:'0.02',
                    time:'04-27 14:32:00',
                    total:'2.2'
                },{
                    name:'分红',
                    num:'0.032',
                    time:'04-24 14:32:00',
                    total:'7.2'
                },{
                    name:'分红',
                    num:'0.052',
                    time:'04-21 14:32:00',
                    total:'1.2'
                },{
                    name:'分红',
                    num:'0.04',
                    time:'04-27 14:32:00',
                    total:'2.4'
                },{
                    name:'分红',
                    num:'0.02',
                    time:'04-27 14:32:00',
                    total:'2.2'
                },{
                    name:'分红',
                    num:'0.032',
                    time:'04-24 14:32:00',
                    total:'7.2'
                },{
                    name:'分红',
                    num:'0.052',
                    time:'04-21 14:32:00',
                    total:'1.2'
                }
            ]
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}