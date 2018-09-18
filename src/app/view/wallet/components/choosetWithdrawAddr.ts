import { Widget } from "../../../../pi/widget/widget";

/**
 * 地址选择框
 */
interface Props {
    addrsInfo:[];
}
export class ChooseWithdrawAddr extends Widget {
    public ok:(index:number) => void;
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        console.log(props);
    }
    public init() {
    }

    public chooseAddrClick(e:any,index:number) {
        this.ok && this.ok(index);
    }
}