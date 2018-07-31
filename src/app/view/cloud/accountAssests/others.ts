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
                behaviorIcon:'cloud_packets.png',// 对应的图标
                time:'2018-05-03 12:00:02',// 时间
                amount:'-0.0001'// 金额
            },{
                behavior:'发红包2',
                behaviorIcon:'cloud_packets.png',
                time:'2018-05-03 12:00:02',
                amount:'-0.0001'
            },{
                behavior:'发红包3',
                behaviorIcon:'cloud_packets.png',
                time:'2018-05-03 12:00:02',
                amount:'-0.0001'
            }]
        };
    }
}