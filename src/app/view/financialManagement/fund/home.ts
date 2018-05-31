/**
 * fund home Page
 */
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class FundHome extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        console.log(props);
    }
    public init() {
        this.state = {
            chartsImgs:['p1.jpg','p3.jpg','p6.jpg','p12.jpg'],
            showChartsIndex:0,
            historyPerformances:[{
                date:'近一月',
                change:'+2.75%'
            },{
                date:'近三月',
                change:'+4.16%'
            },{
                date:'近半年',
                change:'+8.66%'
            },{
                date:'近一年',
                change:'+31.41%'
            },{
                date:'成立以来',
                change:'+30.53%'
            }],
            historicalNetValue:[{
                date:'20180525',
                unitNetValue:'0.9743',
                cumulativeNetValue:'0.9743',
                changeDay:0.06
            },{
                date:'20180524',
                unitNetValue:'0.9737',
                cumulativeNetValue:'0.9737',
                changeDay:-0.6
            },{
                date:'20180523',
                unitNetValue:'0.9796',
                cumulativeNetValue:'0.9796',
                changeDay:-1.13
            },{
                date:'20180522',
                unitNetValue:'0.9908',
                cumulativeNetValue:'0.9908',
                changeDay:0.04
            },{
                date:'20180521',
                unitNetValue:'0.9986',
                cumulativeNetValue:'0.9986',
                changeDay:1.22
            }],
            showHistoryPerformances:true,
            otherFundItem:['基金概况','基金公告','基金经理','基金公司','费率结构','基金问答']

        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public chartsSwitchClick(e:any,index:number) {
        this.state.showChartsIndex = index;
        this.paint();
    }
    public fundShareClick() {
        popNew('app-view-financialManagement-fund-share');
    }
    public historyPerformanceClick() {
        this.state.showHistoryPerformances = true;
        this.paint();
    }
    public historyNetValueClick() {
        this.state.showHistoryPerformances = false;
        this.paint();
    }
}