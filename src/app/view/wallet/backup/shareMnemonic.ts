/**
 * share mnemonic
 */
import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
interface Props {
    fragments:[];
}
export class ShareMnemonic extends Widget{
    public props:Props;
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init(){
        const len = this.props.fragments.length;
        const successList = [];
        for(let i = 0;i <len;i ++){
            successList[i] = false;
        }
        this.state = {
            successList
        }
    }
    //分享
    public shareItemClick(e:any,index:number){
        const fragment = this.props.fragments[index];
        popNew('app-components-share-share',{ text:fragment },(success)=>{
            this.state.successList[index] = true;
            this.paint();
        });
    }
}