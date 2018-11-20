/**
 * account home
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { resize } from '../../../../pi/widget/resize/resize';
import { Widget } from '../../../../pi/widget/widget';
import { selectImage } from '../../../logic/native';
import { uploadFile } from '../../../net/pull';
import { getStore, register, setStore } from '../../../store/memstore';
import { walletNameAvailable } from '../../../utils/account';
import { getUserInfo, popNewMessage, popPswBox } from '../../../utils/tools';
import { backupMnemonic, getMnemonic } from '../../../utils/walletTools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AccountHome extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.init();
    }
    public init() {
        const userInfo = getUserInfo();
        const wallet = getStore('wallet');
        const backup = wallet.isBackup;

        this.state = {
            avatar:'',
            nickName:'',
            isUpdatingWalletName: false,
            phone:'',
            backup,
            userInput:false,
            chooseImage:false,
            avatarHtml:''
        };
        if (userInfo.phoneNumber) {
            const str = String(userInfo.phoneNumber).substr(3,6);
            this.state.phone = userInfo.phoneNumber.replace(str,'******');
        }
        this.state.nickName = userInfo.nickName ? userInfo.nickName :this.language.defaultName;
        this.state.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
        this.paint();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 修改名字输入框取消聚焦
     */
    public walletNameInputBlur(e: any) {
        const v = e.value;
        this.state.userInput = false;
        if (!walletNameAvailable(v)) {
            popNewMessage(this.language.tips[0]);
            this.state.isUpdatingWalletName = false;

            return;
        }
        if (v !== this.state.nickName) {
            this.state.nickName = v;
            const userInfo = getStore('user/info');
            userInfo.nickName = v;
            setStore('user/info',userInfo);
        }
        this.state.isUpdatingWalletName = false;
        this.paint();
    }

     // 修改钱包名称
    public walletNameInputFocus() {
        this.state.isUpdatingWalletName = true;
    }
    // 备份助记词
    public async backupWalletClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index',{ ...ret });
        }

    }

    // 导出私钥
    public async exportPrivateKeyClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNew('app-components1-loading-loading', { text: this.language.loading });
        try {
            const mnemonic = await getMnemonic(psw);
            if (mnemonic) {
                popNew('app-view-mine-account-exportPrivateKey', { mnemonic });
            } else {
                popNewMessage(this.language.tips[1]);
            }
        } catch (error) {
            console.log(error);
            popNewMessage(this.language.tips[1]);
        }
        close.callback(close.widget);
    }

    public uploadAvatar() {
        selectImage((width, height, base64) => {
            resize({ url:base64, width: 140, ratio: 0.3, type: 'jpeg' },(res) => {
                console.log('resize---------',res);
                this.state.chooseImage = true;
                // tslint:disable-next-line:max-line-length
                this.state.avatarHtml = `<div style="background-image: url(${res.base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
                this.state.avatar = res.base64;
                this.paint();
                uploadFile(this.state.avatar);
            });
        });

    }

    /**
     * 绑定手机号
     */
    public changePhone() {
        popNew('app-view-mine-setting-phone');
    }

    /**
     * 修改密码
     */
    public changePsw() {
        popNew('app-view-mine-setting-changePsw');
    }

    /**
     * 点击可输入用户名
     */
    public changeInput() {
        this.state.userInput = true;
        this.paint();
    }
}

register('user/info', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

register('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});