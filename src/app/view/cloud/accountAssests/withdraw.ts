/**
 * 提币记录
 */
import { Widget } from '../../../../pi/widget/widget';
export class Withdraw extends Widget {
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
                behavior:'提币',// 名称
                behaviorIcon:'cloud_withdraw_icon.png',// 对应的图标
                time:'2018-05-03 12:00:02',// 时间
                amount:'-0.0001',// 金额
                status:'发送中'
            },{
                behavior:'提币',
                behaviorIcon:'cloud_withdraw_icon.png',
                time:'2018-05-03 12:00:02',
                amount:'-0.0001',
                status:'发送中'
            },{
                behavior:'提币',
                behaviorIcon:'cloud_withdraw_icon.png',
                time:'2018-05-03 12:00:02',
                amount:'-0.0001',
                status:'完成'
            }]
        };
    }
}