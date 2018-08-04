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
            refresh:true,
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
     * 滚动加载更多列表数据
     * h1 滚动条高度+滚动模块的可见高度=当前屏幕最底端高度
     * h2 最低端元素的绝对高度
     */
    public getMoreList() {
        const h1 = document.getElementById('ranklist').scrollTop + document.getElementById('ranklist').offsetHeight;  
        const h2 = document.getElementById('more').offsetTop; 
        if (h2 - h1 < 20 && this.state.refresh) {
            this.state.refresh = false;
            console.log('加载中，请稍后~~~');
            setTimeout(() => {
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
                this.state.refresh = true;
                this.paint();
            }, 1000);
        } 
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}