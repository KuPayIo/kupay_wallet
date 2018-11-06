/**
 * share mnemonic
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { deleteMnemonic } from '../../../logic/localWallet';
import { mnemonicFragmentEncrypt, popNewMessage } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';
interface Props {
    fragments:any[];
}
export class ShareMnemonic extends Widget {
    public props:Props;
    public language:any;
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        this.init();
    }
    public init() {
        const len = this.props.fragments.length;
        const encryptFragments = mnemonicFragmentEncrypt(this.props.fragments);
        console.log(encryptFragments);
        const successList = [];
        for (let i = 0;i < len;i ++) {
            successList[i] = false;
        }
        this.state = {
            encryptFragments,
            successList
        };
    }
    // 分享
    public shareItemClick(e:any,index:number) {
        const fragment = this.state.encryptFragments[index];
        popNew('app-components-share-share',{ text:fragment,shareType:ShareToPlatforms.TYPE_IMG },(success) => {
            this.state.successList[index] = true;
            this.paint();
            this.allShared();
        });
    }

    public allShared() {
        let allShared = true;
        for (let i = 0;i < this.state.successList.length;i++) {
            if (!this.state.successList[i]) {
                allShared = false;
            }
        }
        if (allShared) {
            deleteMnemonic();
            popNewMessage(this.language.tips);
            // this.ok && this.ok();
        }
    }
}