import { Widget } from '../../../../pi/widget/widget';

/**
 * 地址选择框
 */
interface Props {
    addrsInfo:any[];
}
export class ChooseWithdrawAddr extends Widget {
    public ok:(index:number) => void;
    public cancel:() => void;
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log(props);
        this.state = {};
    }

    public chooseAddrClick(e:any,index:number) {
        this.ok && this.ok(index);
    }
    public doClose() {
        this.cancel && this.cancel();
    }

}