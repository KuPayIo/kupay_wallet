/**
 * 挖矿或矿山排名详细列表 
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { kpt2kt } from '../../../shareView/utils/tools';

export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }   

    public setProps(props: Json, oldProps?: Json) {
        super.setProps(props,oldProps);
        this.init();
        this.initData();
    }

    public init() {
        this.state = {
            refresh:true,
            gainRank:[
                // {
                //     index:1,
                //     name:'昵称未设置',
                //     num:'96,554,000.00'
                // }
            ]
        };
    }

    /**
     * 滚动加载更多列表数据
     * h1 滚动条高度+滚动模块的可见高度=当前屏幕最底端高度
     * h2 最低端元素的绝对高度
     */
    // public getMoreList() {
    //     const h1 = document.getElementById('ranklist').scrollTop + document.getElementById('ranklist').offsetHeight;  
    //     const h2 = document.getElementById('more').offsetTop; 
    //     if (h2 - h1 < 20 && this.state.refresh) {
    //         this.state.refresh = false;
    //         console.log('加载中，请稍后~~~');
    //         setTimeout(() => {
    //             this.state.gainRank.push({
    //                 index:1,
    //                 name:'昵称未设置',
    //                 num:'96,554,000.00'
    //             },{
    //                 index:2,
    //                 name:'昵称未设置',
    //                 num:'96,554,000.00'
    //             },{
    //                 index:3,
    //                 name:'昵称未设置',
    //                 num:'96,554,000.00'
    //             });
    //             this.state.refresh = true;
    //             this.paint();
    //         }, 1000);
    //     } 
    // }

    public backPrePage() {
        this.ok && this.ok();
    }

    public async initData() {
        const msg = this.props.data;
        const data = [];
        for (let i = 0;i < msg.length;i++) {
            data.push({
                index: i + 1,
                name: msg[i][1] === '' ? '昵称未设置' : msg[i][1],
                num: kpt2kt(msg[i][2])
            });
        }
        this.state.gainRank = data;
        this.paint();
    }
}