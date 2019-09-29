/**
 * 添加好友
 */
import { ShareType } from '../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../publicLib/modulConfig';
import { copyToClipboard, getUserInfo, popNewMessage } from '../../utils/tools';
import { makeScreenShot } from '../../viewLogic/native';

export class AddFriend extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            userName:this.language.defaultName,
            userHead:'../../res/image/default_avater_big.png',
            acc_id:'000000',
            walletName:getModulConfig('WALLET_NAME')
        };
        this.initData();
    }

    public initData() {
        getUserInfo().then(user => {
            if (user) {
                this.props.userHead = user.avatar ? user.avatar :'../../res/image/default_avater_big.png';
                this.props.userName = user.nickName ? user.nickName :this.language.defaultName;
                this.props.acc_id = user.acc_id ? user.acc_id :'000000';
                this.paint();
            }
        });
        
    }

    /**
     * 分享二维码
     */
    public share() {
        makeScreenShot((result) => { 
            popNew('app-components-share-share',{ shareType:ShareType.TYPE_SCREEN });
        },(result) => { 
            popNewMessage(this.language.tips[1]);
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
        popNewMessage(this.language.tips[0]);
    }
}