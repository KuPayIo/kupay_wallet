/**
 * account home
 */
import { popNew } from '../../../../pi/ui/root';
import { resize } from '../../../../pi/widget/resize/resize';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { selectImage } from '../../../logic/native';
import { uploadFile } from '../../../net/pull';
import { find, updateStore } from '../../../store/store';
import { walletNameAvailable } from '../../../utils/account';
import { getLanguage, getUserInfo, popNewMessage, popPswBox } from '../../../utils/tools';
import { backupMnemonic, getMnemonic } from '../../../utils/walletTools';

export class AccountHome extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const userInfo = getUserInfo();
        const wallet = find('curWallet');
        const gwlt = wallet ? JSON.parse(wallet.gwlt) : null;
        const backup = gwlt.mnemonicBackup;

        this.state = {
            avatar:userInfo.avatar,
            nickName:userInfo.nickName,
            isUpdatingWalletName: false,
            backup,
            cfgData:getLanguage(this)
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public walletNameInputBlur(e: any) {
        const v = e.currentTarget.value.trim();
        const input: any = document.querySelector('#walletNameInput');
        if (!walletNameAvailable(v)) {
            popNewMessage(this.state.cfgData.tips[0]);
            input.value = this.state.nickName;
            this.state.isUpdatingWalletName = false;

            return;
        }
        if (v !== this.state.nickName) {
            this.state.nickName = v;
            const wallet = find('curWallet');
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            gwlt.nickName = v;
            wallet.gwlt = gwlt.toJSON();
            updateStore('curWallet', wallet);
            const userInfo = find('userInfo');
            userInfo.nickName = v;
            updateStore('userInfo',userInfo);
        }
        input.value = v;
        this.state.isUpdatingWalletName = false;
    }

     // 修改钱包名称
    public walletNameInputFocus() {
        this.state.isUpdatingWalletName = true;
    }

    public pageClick() {
        if (this.state.isUpdatingWalletName) {
            const walletNameInput: any = document.querySelector('#walletNameInput');
            walletNameInput.blur();

            return;
        }
    }

    public async backupWalletClick() {
        if (this.state.isUpdatingWalletName) {
            this.pageClick();

            return;
        }
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index',{ ...ret });
        }

    }

    // 导出私钥
    public async exportPrivateKeyClick() {
        if (this.state.isUpdatingWalletName) {
            this.pageClick();

            return;
        }
        const wallet = find('curWallet');
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNew('app-components1-loading-loading', { text: this.state.cfgData.loading });
        try {
            const mnemonic = await getMnemonic(wallet, psw);
            if (mnemonic) {
                popNew('app-view-mine-account-exportPrivateKey', { mnemonic });
            } else {
                popNewMessage(this.state.cfgData.tips[1]);
            }
        } catch (error) {
            console.log(error);
            popNewMessage(this.state.cfgData.tips[1]);
        }
        close.callback(close.widget);
    }

    public uploadAvatar() {
        selectImage((width, height, base64) => {
            resize({ url:base64, width: 140, ratio: 0.3, type: 'jpeg' },(res) => {
                console.log('resize---------',res);
                this.state.chooseImage = true;
                // tslint:disable-next-line:max-line-length
                // this.state.avatarHtml = `<div style="background-image: url(${res.base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
                this.state.avatar = res.base64;
                this.paint();
                uploadFile(this.state.avatar);
            });
        });

     
    }
}