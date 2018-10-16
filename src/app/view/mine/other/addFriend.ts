/**
 * 添加好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { copyToClipboard, getFirstEthAddr, getLanguage } from '../../../utils/tools';

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
        const user = find('userInfo');
        const addr = getFirstEthAddr(); 
        if (user) {
            this.state.userHead = user.avatar ? user.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = user.nickName;
            this.state.address = addr;
        }
        this.paint();
    }

    /**
     * 分享二维码
     */
    public share() {
        popNew('app-components-share-share', { text: this.state.address, shareType: ShareToPlatforms.TYPE_IMG }, (result) => {
            // alert(result);
        }, (result) => {
            // alert(result);
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
        popNew('app-components1-message-message',{ content:this.state.cfgData.tips });
    }
}