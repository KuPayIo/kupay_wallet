/**
 * receipt
 */
import { Widget } from "../../../../pi/widget/widget";
import { getCurrentAddrByCurrencyName, copyToClipboard, popNewMessage } from "../../../utils/tools";
import { popNew } from "../../../../pi/ui/root";
import { ShareToPlatforms } from "../../../../pi/browser/shareToPlatforms";

interface Props{
    currencyName:string;
}
export class Receipt extends Widget{
    public ok:()=>void;
    public props:Props;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props){
        super.setProps(props,oldProps);
        this.init();
    }
    public init(){
        this.state = {
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName),
        }
    }

    public copyClick(){
        copyToClipboard(this.state.fromAddr);
        popNewMessage('复制成功');
    }

    public shareClick(){
        popNew('app-components-share-share',{text:this.state.from,shareType:ShareToPlatforms.TYPE_IMG});
    }
}