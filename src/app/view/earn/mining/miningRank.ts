/**
 * 挖矿及矿山排名
 */
// ============================== 导入
import { Json } from '../../../../pi/lang/type';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class DividendItem extends Widget {
    public ok: () => void;
    public state:{
        data:any[];
        totalNum:number;
        more:boolean;
    };

    public backPrePage() {
        this.ok && this.ok();
    }

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            data:this.props.data,
            totalNum:this.props.totalNum,
            more:false
        };
        console.log('》》》》》',this.props);
    }

}
