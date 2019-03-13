/**
 * share mnemonic
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { deleteMnemonic, sharePart } from '../../../logic/localWallet';
import { getModulConfig } from '../../../modulConfig';
import { mnemonicFragmentEncrypt, popNewMessage } from '../../../utils/tools';
interface Props {
    fragments:any[];
}
export class ShareMnemonic extends Widget {
    public props:any;
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const len = this.props.fragments.length;
        const encryptFragments = mnemonicFragmentEncrypt(this.props.fragments);
        const successList = [];
        for (let i = 0;i < len;i ++) {
            successList[i] = false;
        }
        this.props = {
            ...this.props,
            encryptFragments,
            successList,
            walletName:getModulConfig('WALLET_NAME')
        };
    }
    // 分享
    public shareItemClick(e:any,index:number) {
        const fragment = this.props.encryptFragments[index];
        popNew('app-components-share-share',{ text:fragment,shareType:ShareToPlatforms.TYPE_IMG },(success) => {
            this.props.successList[index] = true;
            this.paint();
            this.allShared();
        });
    }

    public allShared() {
        let allShared = true;
        for (let i = 0;i < this.props.successList.length;i++) {
            if (!this.props.successList[i]) {
                allShared = false;
            }
        }
        if (allShared) {
            deleteMnemonic();
            sharePart();
            const tips = { zh_Hans:'分享成功',zh_Hant:'分享成功',en:'' };
            popNewMessage(tips[getLang()]);
            // this.ok && this.ok();
        }
    }
}