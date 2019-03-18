/**
 * 添加好友
 */
import { ShareToPlatforms, ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getStore } from '../../../store/memstore';
import { copyToClipboard, getUserInfo } from '../../../utils/tools';

export class AddFriend extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            userName:this.language.defaultName,
            userHead:'../../../res/image/default_avater_big.png',
            address:'FGGF1512151512sd78d4s51d8d44s51d8d4fd0260hg',
            walletName:getModulConfig('WALLET_NAME')
        };
        this.initData();
    }

    public initData() {
        const user = getUserInfo();
        const addr = getStore('user/id'); 
        if (user) {
            this.props.userHead = user.avatar ? user.avatar :'../../../res/image/default_avater_big.png';
            this.props.userName = user.nickName ? user.nickName :this.language.defaultName;
            this.props.address = addr;
        }
        this.paint();
    }

    /**
     * 分享二维码
     */
    public share() {
        const stp = new ShareToPlatforms();
        stp.init();
        stp.makeScreenShot({
            success: (result) => { 
                popNew('app-components-share-share',{ shareType:ShareType.TYPE_SCREEN });
            },
            fail: (result) => { 
                popNew('app-components-message-message',{ content:this.language.tips[1] });
            }
        });
    }

    public backPrePage() {
        this.ok && this.ok();
    } 

    /**
     * 复制地址
     */
    public copyAddr() {
        copyToClipboard(this.props.address);
        popNew('app-components1-message-message',{ content:this.language.tips[0] });
    }
}