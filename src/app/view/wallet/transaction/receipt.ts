/**
 * receipt
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { copyToClipboard, getCurrentAddrByCurrencyName, getLanguage, popNewMessage } from '../../../utils/tools';

interface Props {
    currencyName:string;
}
export class Receipt extends Widget {
    public ok:() => void;
    public props:Props;
    public language:any;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName)
        };
    }

    public copyClick() {
        copyToClipboard(this.state.fromAddr);
        popNewMessage(this.language.tips[0]);
    }

    public shareClick() {
        
        const stp = new ShareToPlatforms();
        stp.init();
        stp.makeScreenShot({
            success: (result) => { 
                popNew('app-components-share-share',{ shareType:ShareToPlatforms.TYPE_SCREEN });
            },
            fail: (result) => { 
                popNew('app-components-message-message',{ content:this.language.tips[1] });
            }
        });
    }
}