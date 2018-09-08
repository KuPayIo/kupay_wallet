/**
 * 添加好友
 */
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';
import { find } from '../../../store/store';
import { getFirstEthAddr, copyToClipboard } from '../../../utils/tools';

export class AddFriend extends Widget {
    public ok:()=>void;
    public create() {
        super.create();
        this.state={
            userName:'用户名',
            userHead:'../../../res/image/default_avater_big.png',
            address:'FGGF1512151512sd78d4s51d8d44s51d8d4fd0260hg'
        }
    }

    public initData(){
        const wallet = find('curWallet');
        const addr = getFirstEthAddr();        
        if (wallet) {
            const gwlt = JSON.parse(wallet.gwlt);
            this.state.userHead = wallet.avatar;
            this.state.userName = gwlt.nickName;
            this.state.address = addr;
        }
    }

    /**
     * 分享二维码
     */
    public share(){
        popNew('app-components-share-share');
    }

    public backPrePage() {
        this.ok && this.ok();
    } 

     /**
     * 复制地址
     */
    public copyAddr(){
        copyToClipboard(this.state.address);
        popNew('app-components-message-message',{content:"复制成功"});
    }
}