/**
 * 分红领取记录，挖矿记录
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { wei2Eth } from '../../../shareView/utils/tools';
import { getDividHistory, getMiningHistory } from '../../../store/conMgr';
import { kpt2kt, parseDate, transDate } from '../../../utils/tools';

interface Item {
    num:number;
    time:string;
    total:number;
}

export class Dividend extends Widget {
    public ok: () => void;
    public state: {refresh:boolean; data:Item[]};
    constructor() {
        super();
    }

    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.init();
        this.initData();
    }

    public init() {
        this.state = {
            refresh:true,
            data:[
                {
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                },{
                    num:0.02,
                    time:'04-30 14:32:00',
                    total:10.2
                }                
            ]
        };
    }
    
    public async initData() {
        if (this.props === 2) { // 挖矿记录列表
            const msg = await getMiningHistory();
            const data = [];
            for (let i = 0;i < msg.value.length;i++) {
                data.push({
                    num:kpt2kt(msg.value[i][0]),
                    total:kpt2kt(msg.value[i][1]),
                    time:transDate(new Date(msg.value[i][2]))
                });
            }
            this.state.data = data;
        } else {  // 分红记录列表
            const msg = await getDividHistory();
            const data = [];
            for (let i = 0;i < msg.value.length;i++) {
                data.push({
                    num:wei2Eth(msg.value[i][1][0]),
                    total:wei2Eth(msg.value[i][1][1]),
                    time:transDate(new Date(msg.value[i][0]))
                });
            }
            this.state.data = data;
        }        
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 滚动加载更多列表数据
     * h1 滚动条高度+滚动模块的可见高度=当前屏幕最底端高度
     * h2 最低端元素的绝对高度
     */
    // public getMoreList() {
    //     const h1 = document.getElementById('historylist').scrollTop + document.getElementById('historylist').offsetHeight; 
    //     const h2 = document.getElementById('more').offsetTop; 
    //     if (h2 - h1 < 20 && this.state.refresh) {
    //         this.state.refresh = false;
    //         console.log('加载中，请稍后~~~');
    //         setTimeout(() => {
    //             this.state.data.push({
                    
    //                 num:0.02,
    //                 time:'04-27 14:32:00',
    //                 total:'2.2'
    //             },{
                    
    //                 num:'0.032',
    //                 time:'04-24 14:32:00',
    //                 total:'7.2'
    //             },{
                    
    //                 num:'0.052',
    //                 time:'04-21 14:32:00',
    //                 total:'1.2'
    //             });
    //             this.state.refresh = true;
    //             this.paint();
    //         }, 1000);
    //     } 
    // }
}