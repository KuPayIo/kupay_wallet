/**
 * my wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { nickNameInterception,pswEqualed } from '../../../utils/account';
import { decrypt, getAddrsAll,getCurrentWallet, getCurrentWalletIndex, getLocalStorage,setLocalStorage } from '../../../utils/tools';

export class WalletManagement extends Widget {
    public ok: (returnHome?:boolean) => void;
    constructor() {
        super();
        this.init();
    }
    public init() {
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
            showInputBorder:false,
            nickNameInterception
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public pswTipsClick() {
        this.state.showPswTips = !this.state.showPswTips;
        this.paint();
    }

    public exportPrivateKeyClick() {
        popNew('app-components-message-messagebox', { type: 'prompt', title: '输入密码', content: '', inputType: 'password' }, (r) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const walletPsw = decrypt(wallet.walletPsw);
            if (pswEqualed(r, walletPsw)) {
                const close = popNew('pi-components-loading-loading', { text: '导出私钥中' });
                setTimeout(() => {
                    close.callback(close.widget);
                    popNew('app-view-mine-exportPrivateKey-exportPrivateKey');
                }, 500);
            } else {
                popNew('app-components-message-message', { type: 'error', content: '密码错误', center: true });
            }
        });
    }

    public inputFocus() {
        // let input = document.querySelector("#autoInput");
        // input.value = this.state.gwlt.nickName;
        this.state.showInputBorder = true;
        this.paint();
    }
    public inputBlur(e:any) {
        const v = e.currentTarget.value.trim();
        if (v.length === 0) {
            popNew('app-components-message-message', { type: 'error', content: '钱包名不能为空', center: true });
            const input = document.querySelector('#autoInput');
            input.value = this.state.gwlt.nickName;
            this.state.showInputBorder = false;
            this.paint();

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
            addr0.gwlt = gwlt.toJSON();
            setLocalStorage('wallets', wallets, true);
        }
        this.state.showInputBorder = false;
        this.paint();
    }

    public backupMnemonic() {
        popNew('app-components-message-messagebox', { type: 'prompt', title: '输入密码', content: '',inputType:'password' }, (r) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const walletPsw = decrypt(wallet.walletPsw);
            if (pswEqualed(r,walletPsw)) {
                const close = popNew('pi-components-loading-loading',{ text:'导出中' });
                setTimeout(() => {
                    close.callback(close.widget);
                    this.ok && this.ok();
                    popNew('app-view-wallet-backupMnemonic-backupMnemonic');
                },500);
            } else {
                popNew('app-components-message-message', { type: 'error', content: '密码错误,请重新输入', center: true });
            }
        });
    }
    /**
     * 显示群钱包
     */
    public showGroupWallet() {
        popNew('app-view-groupwallet-groupwallet');
    }

    public changePasswordClick() {
        popNew('app-view-mine-changePassword-changePassword1');
    }

    public signOutClick() {
        popNew('app-components-message-messagebox', { type: 'confirm', title: '退出钱包', content: '退出后可通过密码再次登录' },() => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            wallets.curWalletId = '';
            setLocalStorage('wallets',wallets,true);
            this.ok && this.ok(true);
        });
    }

    public deleteWalletClick() {
        if (this.state.mnemonicExisted) {
            popNew('app-components-message-messagebox', { type: 'alert', title: '备份钱包', content: '您还没有备份助记词，这是找回钱包的重要线索，请先备份' },() => {
                this.deleteWallet();
            });
        } else {
            this.deleteWallet();
        }
    }

    public deleteWallet() {
        popNew('app-components-message-messagebox', { type: 'confirm', title: '删除钱包', content: '删除后不再保留数据，再次登录需通过助记词重新导入' },() => {
            popNew('app-components-message-messagebox', { type: 'prompt', title: '输入密码', content: '',inputType:'password' }, (r) => {
                const wallets = getLocalStorage('wallets');
                const wallet = getCurrentWallet(wallets);
                const walletIndex = getCurrentWalletIndex(wallets);
                const walletPsw = decrypt(wallet.walletPsw);
                if (pswEqualed(r,walletPsw)) {
                    // 返还头像
                    const avatars = getLocalStorage('avatars');
                    avatars.push(wallet.avatar);
                    setLocalStorage('avatars',avatars);

                    // 删除地址
                    const addrs = getAddrsAll(wallet);
                    this.deleteAddrs(addrs);

                    // 删除钱包
                    wallets.walletList.splice(walletIndex,1);
                    wallets.curWalletId = '';
                    setLocalStorage('wallets',wallets,true);

                    popNew('app-components-message-message', { type: 'success', content: '删除成功', center: true });
                    this.ok && this.ok(true);
                } else {
                    popNew('app-components-message-message', { type: 'error', content: '密码错误,请重新输入', center: true });
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