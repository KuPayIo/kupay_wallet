/**
 * my wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { register } from '../../../store/store';
import { pswEqualed,walletNameAvailable } from '../../../utils/account';
import { 
    decrypt, 
    encrypt,
    getAddrById, 
    getAddrsAll, 
    getCurrentWallet,
    getCurrentWalletIndex,
    getLocalStorage, 
    resetAddrById,
    setLocalStorage} from '../../../utils/tools';

export class WalletManagement extends Widget {
    public ok: (returnHome?:boolean) => void;
    constructor() {
        super();
        this.init();
    }
    public init() {
        register('wallets', (wallets) => {
            const wallet = getCurrentWallet(wallets);
            if (!wallet) return;
            const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            const walletPsw = decrypt(wallet.walletPsw);
            let mnemonicExisted = true;
            try {
                gwlt.exportMnemonic(walletPsw);
            } catch (e) {
                mnemonicExisted = false;
            }
            let pswTips = '';
            if (wallet.walletPswTips) {
                pswTips = decrypt(wallet.walletPswTips);
            }
            pswTips = pswTips.length > 0 ? pswTips : '无';
            this.state.mnemonicExisted = mnemonicExisted;
            this.state.pswTips = pswTips;
            this.paint();
        });
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        const walletPsw = decrypt(wallet.walletPsw);
        let mnemonicExisted = true;
        try {
            gwlt.exportMnemonic(walletPsw);
        } catch (e) {
            mnemonicExisted = false;
        }
        let pswTips = '';
        if (wallet.walletPswTips) {
            pswTips = decrypt(wallet.walletPswTips);
        }
        pswTips = pswTips.length > 0 ? pswTips : '无';
        this.state = {
            wallet,
            gwlt,
            showPswTips: false,
            pswTips,
            mnemonicExisted,
            isUpdatingWalletName:false,
            isUpdatingPswTips:false
        };
    }
    public backPrePage() {
        this.pageClick();
        this.ok && this.ok();
    }

    public pswTipsClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        this.state.showPswTips = !this.state.showPswTips;
        this.paint();
    }

    public exportPrivateKeyClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        popNew('app-components-message-messagebox', { itype: 'prompt', title: '输入密码', content: '', inputType: 'password' }, (r) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const walletPsw = decrypt(wallet.walletPsw);
            if (pswEqualed(r, walletPsw)) {
                const close = popNew('pi-components-loading-loading', { text: '导出私钥中...' });
                setTimeout(() => {
                    close.callback(close.widget);
                    popNew('app-view-mine-exportPrivateKey-exportPrivateKey');
                }, 500);
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误', center: true });
            }
        });
    }

    public walletNameInputFocus() {
        this.state.isUpdatingWalletName = true;
    }
    public walletNameInputBlur(e:any) {
        const v = e.currentTarget.value.trim();
        const input = document.querySelector('#walletNameInput');
        if (!walletNameAvailable(v)) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包名长度为1-24位', center: true });
           
            input.value = this.state.gwlt.nickName;
            this.state.isUpdatingWalletName = false;

            return;
        }
        if (v !== this.state.gwlt.nickName) {
            this.state.gwlt.nickName = v;
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const addr0 = wallet.currencyRecords[0].addrs[0];
            const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            gwlt.nickName = v;
            wallet.gwlt = gwlt.toJSON();

            const addr = getAddrById(addr0);
            addr.gwlt = gwlt.toJSON();
            resetAddrById(addr0,addr);
            setLocalStorage('wallets', wallets, true);
        }
        input.value = v;
        this.state.isUpdatingWalletName = false;
    }
    public pswTipsInputFocus() {
        this.state.isUpdatingPswTips = true;
    }

    public pswTipsInputBlur() {
        const pswTipsInput = document.querySelector('#pswTipsInput');
        const value = pswTipsInput.value;
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        wallet.walletPswTips = encrypt(value);
        setLocalStorage('wallets',wallets,true);
        this.state.isUpdatingPswTips = false;
    }
    public pageClick() {
        if (this.state.isUpdatingWalletName) {
            const walletNameInput = document.querySelector('#walletNameInput');
            walletNameInput.blur();

            return;
        }

        if (this.state.isUpdatingPswTips) {
            const pswTipsInput = document.querySelector('#pswTipsInput');
            pswTipsInput.blur();

            return;
        }
    }

    public backupMnemonic() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        popNew('app-components-message-messagebox', { itype: 'prompt', title: '输入密码', content: '',inputType:'password' }, (r) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const walletPsw = decrypt(wallet.walletPsw);
            if (pswEqualed(r,walletPsw)) {
                const close = popNew('pi-components-loading-loading',{ text:'导出中...' });
                setTimeout(() => {
                    close.callback(close.widget);
                    this.ok && this.ok();
                    popNew('app-view-wallet-backupMnemonic-backupMnemonic');
                },500);
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        });
    }
    /**
     * 显示群钱包
     */
    public showGroupWallet() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        popNew('app-view-groupwallet-groupwallet');
    }

    public changePasswordClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        popNew('app-view-mine-changePassword-changePassword1');
    }

    public signOutClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        if (this.state.mnemonicExisted) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '备份钱包', content: '您还没有备份助记词，这是找回钱包的重要线索，请先备份' },() => {
                popNew('app-view-wallet-backupWallet-backupWallet');
            });
        } else {
            this.signOut();
        }
    }

    public signOut() {
        popNew('app-components-message-messagebox', { itype: 'confirm', title: '退出钱包', content: '退出后可通过密码再次登录' },() => {
            const wallets = getLocalStorage('wallets');
            wallets.curWalletId = '';
            setLocalStorage('wallets',wallets,true);
            popNew('app-components-message-message', { itype: 'success', content: '退出成功', center: true });
            this.ok && this.ok(true);
        });
    }
    public deleteWalletClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        if (this.state.mnemonicExisted) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '备份钱包', content: '您还没有备份助记词，这是找回钱包的重要线索，请先备份' },() => {
                popNew('app-view-wallet-backupWallet-backupWallet');
            });
        } else {
            this.deleteWallet();
        }
    }

    public deleteWallet() {
        popNew('app-components-message-messagebox', { itype: 'confirm', title: '删除钱包', content: '删除后不再保留数据，再次登录需通过助记词重新导入' },() => {
            popNew('app-components-message-messagebox', { itype: 'prompt', title: '输入密码', content: '',inputType:'password' }, (r) => {
                const wallets = getLocalStorage('wallets');
                const wallet = getCurrentWallet(wallets);
                const walletIndex = getCurrentWalletIndex(wallets);
                const walletPsw = decrypt(wallet.walletPsw);
                if (pswEqualed(r,walletPsw)) {

                    // 删除地址
                    const addrs = getAddrsAll(wallet);
                    this.deleteAddrs(addrs);

                    // 删除钱包
                    wallets.walletList.splice(walletIndex,1);
                    wallets.curWalletId = '';
                    setLocalStorage('wallets',wallets,true);

                    popNew('app-components-message-message', { itype: 'success', content: '删除成功', center: true });
                    this.ok && this.ok(true);
                } else {
                    popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
                }
            });
        });
    }

    /**
     * 删除addrs中的所有地址
     * @param addrs all need to deleted addrs
     * 
     */
    public deleteAddrs(delAddrs:string[]) {
        const addrs = getLocalStorage('addrs');
        const addrsNew = addrs.filter((item) => {
            if (delAddrs.indexOf(item.addr) < 0) {
                return true;
            }

            return false;
        });
        setLocalStorage('addrs',addrsNew);
    }   
}