/**
 * rate description
 */
import { Widget } from '../../../pi/widget/widget';
interface Props {
    fee:number;
}
export class RateDescription extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {
            desc:'换币服务由shapeshift平台提供支持，换币汇率取决于国内外主流交易平台的实时相对价格，另外加上矿工费用及shapeshift平台收取的约0.5%服务费用。换币实际所得数量会因为实时价格有所浮动。换币矿工费会通过计算近期交易中矿工费得出'
        };
    }
    public cancelClick() {
        this.ok && this.ok();
    }
}