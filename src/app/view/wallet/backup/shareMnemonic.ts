/**
 * share mnemonic
 */
import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { ShareToPlatforms } from "../../../../pi/browser/shareToPlatforms";
import { deleteMnemonic } from "../../../logic/localWallet";
import { popNewMessage } from "../../../utils/tools";
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
        popNew('app-components-share-share',{ text:fragment,shareType:ShareToPlatforms.TYPE_IMG },(success)=>{
            this.state.successList[index] = true;
            this.paint();
            this.allShared();
        });
    }

    public allShared(){
        let allShared = true;
        for(let i=0;i<this.state.successList.length;i++){
            if(!this.state.successList[i]){
                allShared = false;
            }
        }
        if(allShared){
            deleteMnemonic();
            popNewMessage('备份完成');
            this.ok && this.ok();
        }
    }
}