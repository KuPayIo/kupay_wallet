/**
 * 矿工费选择框
 */
import { Widget } from '../../../pi/widget/widget';
import { MinerFeeLevel } from '../../public/interface';
interface Props {
    currencyName:string;
    minerFeeList:any[];
    curLevel:MinerFeeLevel;
    minLevel?:MinerFeeLevel;
}
export class ChooseModalBox extends Widget {
    public ok:(index:number) => void;
    public cancel:() => void;
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.props = {
            ...this.props,
            minerFeeList:this.props.minerFeeList,
            level:this.props.curLevel ? this.props.curLevel : MinerFeeLevel.Standard
        };
    }

    public chooseMinerLevel(e:any,index:number) {
        const chooseLevel = this.props.minerFeeList[index].level;
        if (this.props.minLevel && chooseLevel < this.props.minLevel) return;
        // this.props.level = chooseLevel;
        // this.paint();
        this.ok && this.ok(index);
    }

    public doClose() {
        this.cancel && this.cancel();
    }
}