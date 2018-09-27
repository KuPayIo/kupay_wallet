/**
 * wallet home 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { copyToClipboard, getFirstEthAddr, getLanguage, getUserInfo, popPswBox } from '../../../utils/tools';
import { backupMnemonic } from '../../../utils/walletTools';

export class Home extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const userInfo = getUserInfo();
        const cfg = getLanguage(this);
        this.state = {
            list:[
                { img:'../../../res/image1/28.png',name: cfg.itemTitle[0],components:'' },
                { img:'../../../res/image1/10.png',name: cfg.itemTitle[1],components:'app-view-mine-other-help' },
                { img:'../../../res/image1/21.png',name: cfg.itemTitle[2],components:'app-view-mine-setting-setting' },
                { img:'../../../res/image1/23.png',name: cfg.itemTitle[3],components:'app-view-mine-other-contanctUs' },
                { img:'../../../res/image1/24.png',name: cfg.itemTitle[4],components:'app-view-mine-other-aboutus' },
                { img:'../../../res/image1/43.png',name: 'GitHub Repository',components:'' }
            ],
            address:'FGGF1512151512sd78d4s51af45466',
            userName:userInfo.nickName,
            avatar:userInfo.avatar,
            close:false,
            hasWallet:false,
            cfgData:cfg
        };
        const wallet = find('curWallet');
        const addr = getFirstEthAddr(); 
        if (wallet) {
            this.state.hasWallet = true;
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
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index',{ ...ret });
            this.ok && this.ok();
        }
    }

    /**
     * 点击跳转
     */
    public itemClick(ind:number) {
        if (ind === 0) {
            popNew('app-view-mine-account-home');
        } else if (ind === 5) {
            window.open('https://github.com/KuPayIo/kupay_wallet');
        } else {
            popNew(this.state.list[ind].components);
        }
        this.ok && this.ok();
    }

    /**
     * 复制地址
     */
    public copyAddr() {
        copyToClipboard(this.state.address);
        popNew('app-components-message-message',{ content:this.state.cfgData.tips });
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
        if (this.state.hasWallet) {
            return;
        }
        popNew('app-view-wallet-create-home');
    }
}