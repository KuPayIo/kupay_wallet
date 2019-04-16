/**
 * receipt
 */
import { ShareToPlatforms, ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { makeScreenShot } from '../../../logic/native';
import { copyToClipboard, getCurrentAddrByCurrencyName, getUserInfo, popNewMessage } from '../../../utils/tools';

interface Props {
    currencyName:string;
    avatar:string;
}
export class Receipt extends Widget {
    public ok:() => void;
    public props:any;
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
        const userInfo = getUserInfo();
        this.props = {
            ...this.props,
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName)
        };
        if (userInfo) {
            this.props.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
        }
        
    }

    public copyClick() {
        copyToClipboard(this.props.fromAddr);
        popNewMessage(this.language.tips[0]);
    }

    public shareClick() {
        makeScreenShot((result) => { 
            popNew('app-components-share-share',{ shareType:ShareType.TYPE_SCREEN });
        },(result) => { 
            popNewMessage(this.language.tips[1]);
        });
    }
}