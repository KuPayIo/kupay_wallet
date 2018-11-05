/**
 * 添加好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getStore } from '../../../store/memstore';
import { copyToClipboard, getLanguage, getUserInfo } from '../../../utils/tools';

export class AddFriend extends Widget {
    public ok:() => void;
    public create() {
        super.create();

        const cfg = getLanguage(this);
        this.state = {
            userName:cfg.defaultName,
            userHead:'../../../res/image/default_avater_big.png',
            address:'FGGF1512151512sd78d4s51d8d44s51d8d4fd0260hg',
            cfgData:cfg
        };
        this.initData();
    }

    public initData() {
        const user = getUserInfo();
        const addr = getStore('user/id'); 
        if (user) {
            this.state.userHead = user.avatar ? user.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = user.nickName ? user.nickName :this.state.cfgData.defaultName;
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
                popNew('app-components-message-message',{ content:this.state.cfgData.tips[1] });
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
        popNew('app-components1-message-message',{ content:this.state.cfgData.tips[0] });
    }
}