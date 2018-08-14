/**
 * rate description
 */
import { Widget } from '../../../pi/widget/widget';
import { estimateMinerFee } from '../../net/pullWallet';
interface Props {
    currencyName:string;
    toAddr:string;
    gasPrice:number;
    pay:number;
}
export class RateDescription extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        console.log('props',props);
    }
    public async init() {
        this.state = {
            minerFee:0,
            desc:'换币服务由shapeshift平台提供支持，换币汇率取决于国内外主流交易平台的实时相对价格，另外加上矿工费用及shapeshift平台收取的约0.5%服务费用。换币实际所得数量会因为实时价格有所浮动。换币矿工费会通过计算近期交易中矿工费得出'
        };
        
        try {
            // tslint:disable-next-line:max-line-length
            const obj = await estimateMinerFee(this.props.currencyName,{ toAddr:this.props.toAddr,gasPrice:this.props.gasPrice,pay:this.props.pay });
            this.state.minerFee = obj.minerFee;
            this.paint();
        } catch (err) {
            console.error(err);
        }        
    }
    public cancelClick() {
        this.ok && this.ok();
    }

}