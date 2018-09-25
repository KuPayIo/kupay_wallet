/**
 * 添加好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { copyToClipboard, getFirstEthAddr } from '../../../utils/tools';

export class AddFriend extends Widget {
    public ok:() => void;
    public create() {
        super.create();

        let cfg = this.config.value.simpleChinese;
        const lan = find('languageSet');
        if (lan) {
            cfg = this.config.value[lan.languageList[lan.selected]];
        }
        this.state = {
            userName:cfg.defaultName,
            userHead:'../../../res/image/default_avater_big.png',
            address:'FGGF1512151512sd78d4s51d8d44s51d8d4fd0260hg',
            cfgData:cfg
        };
        this.initData();
    }

    public initData() {
        const wallet = find('curWallet');
        const addr = getFirstEthAddr(); 
        if (wallet) {
            const gwlt = JSON.parse(wallet.gwlt);
            this.state.userHead = wallet.avatar ? wallet.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = gwlt.nickName;
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
        popNew('app-components-message-message',{ content:this.state.cfgData.tips });
    }
}