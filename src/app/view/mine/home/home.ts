/**
 * wallet home 
 */
import { rippleShow } from '../../../../chat/client/app/logic/logic';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { doScanQrCode, openNewActivity } from '../../../logic/native';
import { getModulConfig } from '../../../modulConfig';
import { getStore, register } from '../../../store/memstore';
import { copyToClipboard, getUserInfo, hasWallet, popPswBox } from '../../../utils/tools';
import { backupMnemonic } from '../../../utils/walletTools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
        const hasBackupMnemonic = false;
        const hasWallet = false;
        const address = '';
        this.props = {
            list:[
                { img:'../../../res/image1/28.png',name: '',components:'' },
                { img:'../../../res/image1/10.png',name: '',components:'app-view-mine-other-help' },
                { img:'../../../res/image1/21.png',name: '',components:'app-view-mine-setting-setting' },
                { img:'../../../res/image1/23.png',name: '',components:'app-view-mine-other-contanctUs' },
                { img:'../../../res/image1/24.png',name: '',components:'app-view-mine-other-aboutus' }
                
            ],
            address,
            userName:'',
            avatar:'',
            close:false,
            hasWallet,
            hasBackupMnemonic,
            offline:false,
            walletName : getModulConfig('WALLET_NAME')
        };
        if (getModulConfig('GITHUB')) {
            this.props.list.push({ img:'../../../res/image1/43.png',name: '',components:'' });
        }
        this.initData();
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 更新数据
     */
    public initData() {
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.userName = userInfo.nickName ? userInfo.nickName :this.language.defaultUserName;
            this.props.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
        }

        const wallet = getStore('wallet');
        if (wallet) {
            this.props.hasWallet = true;
            this.props.address = getStore('user/id');
            this.props.hasBackupMnemonic = wallet.isBackup;            
        } else {
            this.props.hasWallet = false;
            this.props.address = '';
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
        }
    }

    /**
     * 点击跳转
     */
    public itemClick(ind:number) {
        if (ind === 0) {
            if (!hasWallet()) return;
            popNew('app-view-mine-account-home');
        } else if (ind === 5) {
            // window.open('https://github.com/KuPayIo/kupay_wallet');
            openNewActivity('https://github.com/KuPayIo/kupay_wallet',this.props.walletName);
        } else {
            popNew(this.props.list[ind].components);
        }
        // this.backPrePage();
    }

    /**
     * 复制地址
     */
    public copyAddr() {
        copyToClipboard(this.props.address);
        popNew('app-components1-message-message',{ content:this.language.tips });
    }

    /**
     * 关闭侧边栏
     */
    public closePage() {
        this.props.close = true;
        setTimeout(() => {
            this.backPrePage();
        }, 200);
        this.paint();
    }

    /**
     * 扫描二维码
     */
    public scanQrcode() {
        doScanQrCode((res) => {
            console.log(res);
        });
    }

    /**
     * 展示我的二维码
     */
    public showMyQrcode() {
        popNew('app-view-mine-other-addFriend');
        // this.backPrePage();
    }

    /**
     * 展示我的勋章
     */
    public showMyMedal() {
        popNew('earn-client-app-view-medal-medal');
        // this.backPrePage();
    }

    /**
     * 创建钱包
     */
    public login() {
        if (this.props.hasWallet) {
            popNew('app-view-mine-account-home');
        } else {
            popNew('app-view-wallet-create-home');
        }
        // this.backPrePage();
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

register('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('user/info', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});
register('user/offline',(r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.props.offline = r;
        w.paint();
    }
});