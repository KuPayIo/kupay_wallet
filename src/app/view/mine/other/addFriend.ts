/**
 * 添加好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getStore } from '../../../store/memstore';
import { copyToClipboard, getLanguage, getUserInfo } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';

export class AddFriend extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            userName:this.language.defaultName,
            userHead:'../../../res/image/default_avater_big.png',
            address:'FGGF1512151512sd78d4s51d8d44s51d8d4fd0260hg',
        };
        this.initData();
    }

    public initData() {
        const user = getUserInfo();
        const addr = getStore('user/id'); 
        if (user) {
            this.state.userHead = user.avatar ? user.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = user.nickName ? user.nickName :this.language.defaultName;
            this.state.address = addr;
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
                popNew('app-components-share-share',{ shareType:ShareToPlatforms.TYPE_SCREEN });
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
        copyToClipboard(this.state.address);
        popNew('app-components1-message-message',{ content:this.language.tips[0] });
    }
}