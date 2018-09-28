/**
 * 矿工费选择框
 */
import { Widget } from '../../../pi/widget/widget';
import { MinerFeeLevel } from '../../store/interface';
import { getLanguage } from '../../utils/tools';
interface Props {
    currencyName:string;
    minerFeeList:any[];
    curLevel:MinerFeeLevel;
    minLevel?:MinerFeeLevel;
}
export class ChooseModalBox extends Widget {
    public ok:(index:number) => void;
    public cancel:() => void;
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            minerFeeList:this.props.minerFeeList,
            level:this.props.curLevel ? this.props.curLevel : MinerFeeLevel.STANDARD,
            cfgData:getLanguage(this)
        };
    }

    public chooseMinerLevel(e:any,index:number) {
        const chooseLevel = this.state.minerFeeList[index].level;
        if (this.props.minLevel && chooseLevel < this.props.minLevel) return;
        // this.state.level = chooseLevel;
        // this.paint();
        this.ok && this.ok(index);
    }

    public doClose() {
        this.cancel && this.cancel();
    }
}