/**
 * wallet home 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { copyToClipboard, popPswBox, getFirstEthAddr } from '../../../utils/tools';
import { backupMnemonic } from '../../../utils/walletTools';

export class Home extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            list:[
                { img:'../../../res/image1/28.png',name:'账户',components:'' },
                { img:'../../../res/image1/10.png',name:'帮助',components:'app-view-mine-other-help' },
                { img:'../../../res/image1/21.png',name:'设置',components:'app-view-mine-setting-setting' },
                { img:'../../../res/image1/23.png',name:'联系我们',components:'app-view-mine-other-contanctUs' },
                { img:'../../../res/image1/24.png',name:'关于KuPay',components:'app-view-mine-other-aboutus' },
                { img:'../../../res/image1/43.png',name:'GitHub Repository',components:'' }
            ],
            address:'FGGF1512151512sd78d4s51af45466',
            userName:'用户名',
            userHead:'../../../res/image/default_avater_big.png',
            close:false,
            hasWallet:false
        };
        const wallet = find('curWallet');
        const addr = getFirstEthAddr(); 
        if (wallet) {
            this.state.hasWallet = true;
            const gwlt = JSON.parse(wallet.gwlt);
            this.state.userHead = wallet.avatar ? wallet.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = gwlt.nickName;
            this.state.address = addr;
        }
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    } 

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if(!psw) return;
        const ret = await backupMnemonic(psw);
        if(ret){
            popNew('app-view-wallet-backup-index',{...ret});
            this.ok && this.ok();
        }
    }

    /**
     * 点击跳转
     */
    public itemClick(ind:number) {
        if (ind === 0) {
            console.log('账户');
        } else if (ind === 5) {
            window.open('https://github.com/KuPayIo/kupay_wallet');
        } else {
            popNew(this.state.list[ind].components);
        }
    }

    /**
     * 复制地址
     */
    public copyAddr() {
        copyToClipboard(this.state.address);
        popNew('app-components-message-message',{ content:'复制成功' });
    }

    /**
     * 关闭侧边栏
     */
    public closePage() {
        this.state.close = true;
        setTimeout(() => {
            this.backPrePage();
        }, 200);
        this.paint();
    }

    /**
     * 展示我的二维码
     */
    public showMyQrcode() {
        popNew('app-view-mine-other-addFriend');
    }

    /**
     * 创建钱包
     */
    public login() {
        popNew('app-view-wallet-create-home');
    }
}