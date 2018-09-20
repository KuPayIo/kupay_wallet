/**
 * 矿工费选择框
 */
import { Widget } from '../../../pi/widget/widget';
import { MinerFeeLevel } from '../../store/interface';
interface Props {
    currencyName:string;
    minerFeeList:[];
    curLevel:MinerFeeLevel;
    minLevel?:MinerFeeLevel;
}
export class ChooseModalBox extends Widget {
    public ok:(index:number) => void;
    public cancel:()=>void;
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {
            minerFeeList:this.props.minerFeeList,
            level:this.props.curLevel ? this.props.curLevel : MinerFeeLevel.STANDARD
        };
    }

    public chooseMinerLevel(e:any,index:number) {
        const chooseLevel = this.state.minerFeeList[index].level;
        if (this.props.minLevel && chooseLevel < this.props.minLevel) return;
        // this.state.level = chooseLevel;
        // this.paint();
        this.ok && this.ok(index);
    }

    public doClose(){
        this.cancel && this.cancel();
    }
}