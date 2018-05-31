/**
 * application home page
 */
import { Widget } from '../../../pi/widget/widget';

export class App extends Widget {

    constructor() {
        super();
        this.state = {
            activeIndex:0,
            data:[{
                type:'1',
                img:'../../res/image/img_dapp_1.png',
                title:'建筑队传奇',
                mess:'建造大楼，挑战高度',
                islike:false       
            },{
                type:'1',
                img:'../../res/image/img_dapp_2.png',
                title:'天天来挖矿',
                mess:'看你能挖到什么',
                islike:true       
            },{
                type:'1',
                img:'../../res/image/img_dapp_3.png',
                title:'鱼市',
                mess:'今天出现一只怪鱼',
                islike:true       
            },{
                type:'1',
                img:'../../res/image/img_dapp_4.png',
                title:'每日一氪',
                mess:'试试今天的手气',
                islike:false       
            },{
                type:'2',
                img:'../../res/image/img_dapp_5.png',
                title:'换币',
                mess:'币换币',
                islike:false       
            },{
                type:'1',
                img:'../../res/image/img_dapp_6.png',
                title:'幸运蛋',
                mess:'天啦！买的鸡蛋孵出了恐龙',
                islike:false       
            }]
        };
    }

    public create() {
        window.localStorage.alldata =  JSON.stringify(this.state.data);
    }

    public tabClick(ind:number) {
        this.state.activeIndex = ind;
        const thisdata = JSON.parse(window.localStorage.alldata);
        if (ind === 0) {
            this.state.data = thisdata;
        }
        if (ind === 1) {
            const data = [];
            for (const i in thisdata) {
                if (thisdata[i].type === '1') {
                    data.push(thisdata[i]);
                }
            }
            this.state.data = data;
        }
        if (ind === 2) {
            const data = [];
            for (const i in thisdata) {
                if (thisdata[i].type === '2') {
                    data.push(thisdata[i]);
                }
            }
            this.state.data = data;
        }
        if (ind === 3) {
            const data = [];
            for (const i in thisdata) {
                if (thisdata[i].islike) {
                    data.push(thisdata[i]);
                }
            }
            this.state.data = data;
        }
        this.paint();
    }

}