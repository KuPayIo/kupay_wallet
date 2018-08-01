/**
 * 其他操作记录
 */
import { Widget } from '../../../../pi/widget/widget';
export class Others extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            infoList:[{
                behavior:'发红包',// 名称
                behaviorIcon:'cloud_others_pockets.png',// 对应的图标
                time:'2018-05-03 12:00:02',// 时间
                amount:'-0.0001'// 金额
            },{
                behavior:'分红',
                behaviorIcon:'cloud_others_bonus.png',
                time:'2018-05-03 12:00:02',
                amount:'-0.0001'
            },{
                behavior:'挖坑',
                behaviorIcon:'cloud_others_drag.png',
                time:'2018-05-03 12:00:02',
                amount:'-0.0001'
            }]
        };
    }
}