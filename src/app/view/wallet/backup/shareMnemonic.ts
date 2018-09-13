/**
 * share mnemonic
 */
import { Widget } from "../../../../pi/widget/widget";
interface Props {
    mnemonic: string;
    passwd: string;
}
export class ShareMnemonic extends Widget{
    public props:Props;

    public ok:() => void;
    
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        // this.init();
    }
}