/**
 * my wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { dataCenter } from '../../../store/dataCenter';
import { register, unregister } from '../../../store/store';
import { pswEqualed, walletNameAvailable } from '../../../utils/account';
import {
    decrypt, encrypt, fetchTotalAssets, formatBalanceValue, getAddrsAll, getCurrentWallet, getCurrentWalletIndex
    , getLocalStorage, getMnemonic, getWalletByWalletId, getWalletIndexByWalletId, openBasePage, setLocalStorage, VerifyIdentidy
} from '../../../utils/tools';

export class WalletManagement extends Widget {
    public ok: (returnHome?: boolean) => void;
    constructor() {
        super();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        register('wallets', this.registerWalletsFun);
        register('addrs', this.registerAddrsFun);
        const wallets = getLocalStorage('wallets');
        const wallet = getWalletByWalletId(wallets, this.props.walletId);
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
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
            mnemonicBackup: gwlt.mnemonicBackup,
            isUpdatingWalletName: false,
            isUpdatingPswTips: false,
            totalAssets: 0.00
        };
        this.registerAddrsFun();
    }

    public destroy() {
        unregister('wallets', this.registerWalletsFun);
        unregister('addrs', this.registerAddrsFun);

        return super.destroy();
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

    public async exportPrivateKeyClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        const close = popNew('pi-components-loading-loading', { text: '导出私钥中...' });
        try {
            const wallets = getLocalStorage('wallets');
            const wallet = getWalletByWalletId(wallets, this.props.walletId);
            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const mnemonic = await getMnemonic(wallet, passwd);
            if (mnemonic) {
                popNew('app-view-mine-exportPrivateKey-exportPrivateKey', { mnemonic, walletId: this.props.walletId });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            console.log(error);
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }

        close.callback(close.widget);
    }

    public walletNameInputFocus() {
        this.state.isUpdatingWalletName = true;
    }
    public walletNameInputBlur(e: any) {
        const v = e.currentTarget.value.trim();
        const input: any = document.querySelector('#walletNameInput');
        if (!walletNameAvailable(v)) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包名长度为1-24位', center: true });

            input.value = this.state.gwlt.nickName;
            this.state.isUpdatingWalletName = false;

            return;
        }
        if (v !== this.state.gwlt.nickName) {
            this.state.gwlt.nickName = v;
            const wallets = getLocalStorage('wallets');
            const wallet = getWalletByWalletId(wallets, this.props.walletId);
            // const addr0 = wallet.currencyRecords[0].addrs[0];
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            gwlt.nickName = v;
            wallet.gwlt = gwlt.toJSON();

            /*        const addr = getAddrById(addr0);
                   addr.gwlt = gwlt.toJSON();
                   resetAddrById(addr0,addr); */
            setLocalStorage('wallets', wallets, true);
        }
        input.value = v;
        this.state.isUpdatingWalletName = false;
    }
    public pswTipsInputFocus() {
        this.state.isUpdatingPswTips = true;
    }

    public pswTipsInputBlur() {
        const pswTipsInput: any = document.querySelector('#pswTipsInput');
        const value = pswTipsInput.value;
        const wallets = getLocalStorage('wallets');
        const wallet = getWalletByWalletId(wallets, this.props.walletId);
        wallet.walletPswTips = encrypt(value);
        setLocalStorage('wallets', wallets, true);
        this.state.isUpdatingPswTips = false;
    }
    public pageClick() {
        if (this.state.isUpdatingWalletName) {
            const walletNameInput: any = document.querySelector('#walletNameInput');
            walletNameInput.blur();

            return;
        }

        if (this.state.isUpdatingPswTips) {
            const pswTipsInput: any = document.querySelector('#pswTipsInput');
            pswTipsInput.blur();

            return;
        }
    }

    /**
     * 备份助记词
     */
    public async backupMnemonic() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        const close = popNew('pi-components-loading-loading', { text: '导出中...' });
        try {
            const wallets = getLocalStorage('wallets');
            const wallet = getWalletByWalletId(wallets, this.props.walletId);
            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const mnemonic = await getMnemonic(wallet, passwd);
            if (mnemonic) {
                popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd, walletId: this.props.walletId });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            console.log(error);
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入111', center: true });
        }

        close.callback(close.widget);
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
    /**
     * 修改密码
     */
    public async changePasswordClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        const close = popNew('pi-components-loading-loading', { text: '加载中...' });
        try {
            const wallets = getLocalStorage('wallets');
            const wallet = getWalletByWalletId(wallets, this.props.walletId);
            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const isEffective = await VerifyIdentidy(wallet, passwd);
            if (isEffective) {
                popNew('app-view-mine-changePassword-changePassword', { passwd, walletId: this.props.walletId });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            console.log(error);
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }

        close.callback(close.widget);
    }

    /**
     * 退出钱包
     */
    public async signOutClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        try {
            await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '退出钱包', content: '退出将清除该钱包密码数据' });
            dataCenter.setHash(this.props.walletId, undefined);

            popNew('app-components-message-message', { itype: 'success', content: '退出成功', center: true });
        } catch (error) {
            //
        }
    }

    /**
     * 删除钱包
     */
    public async deleteWalletClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        try {
            if (!this.state.mnemonicBackup) {
                await openBasePage('app-components-message-messagebox', {
                    itype: 'alert', title: '备份钱包', content: '您还没有备份助记词，这是找回钱包的重要线索，请先备份'
                });
                this.backupMnemonic();
            } else {
                await this.deleteWallet();
            }
        } catch (error) {
            //
        }

    }

    public async deleteWallet() {

        await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '删除钱包', content: '删除后需要重新导入，之前的分享也将失效' });

        const close = popNew('pi-components-loading-loading', { text: '删除中...' });
        try {
            const wallets = getLocalStorage('wallets');
            const wallet = getWalletByWalletId(wallets, this.props.walletId);
            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const isEffective = await VerifyIdentidy(wallet, passwd);
            if (isEffective) {
                const walletIndex = getCurrentWalletIndex(wallets);
                // 删除地址
                const addrs = getAddrsAll(wallet);
                this.deleteAddrs(addrs);
                // 移除当前钱包的交易记录
                this.deleteTransactions(addrs);

                // 删除钱包
                wallets.walletList.splice(walletIndex, 1);
                wallets.curWalletId = wallets.walletList.length > 0 ? wallets.walletList[0].walletId : '';
                setLocalStorage('wallets', wallets, true);
                this.ok && this.ok(true);

                popNew('app-components-message-message', { itype: 'success', content: '删除成功', center: true });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            console.log(error);
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }

        close.callback(close.widget);
    }

    /**
     * 删除addrs中的所有地址
     * @param addrs all need to deleted addrs
     * 
     */
    public deleteAddrs(delAddrs: string[]) {
        const addrs = getLocalStorage('addrs');
        const addrsNew = addrs.filter((item) => {
            return delAddrs.indexOf(item.addr) < 0;
        });
        setLocalStorage('addrs', addrsNew);
    }

    /**
     * 移除交易记录
     */
    public deleteTransactions(delAddrs: string[]) {
        const transactions = getLocalStorage('transactions');
        const transactionsNew = transactions.filter((item) => {
            return delAddrs.indexOf(item.addr) < 0;
        });
        setLocalStorage('transactions', transactionsNew);
    }

    private registerWalletsFun = (wallets: any) => {
        const wallet = getWalletByWalletId(wallets, this.props.walletId);
        if (!wallet) return;
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        let pswTips = '';
        if (wallet.walletPswTips) {
            pswTips = decrypt(wallet.walletPswTips);
        }
        pswTips = pswTips.length > 0 ? pswTips : '无';
        this.state.mnemonicBackup = gwlt.mnemonicBackup;
        this.state.pswTips = pswTips;
        this.paint();
    }

    /**
     * 总资产更新
     */
    private registerAddrsFun = (addrs?: any) => {
        const wallets = getLocalStorage('wallets');
        const wallet = getWalletByWalletId(wallets, this.props.walletId);
        if (!wallet) return;

        this.state.totalAssets = formatBalanceValue(fetchTotalAssets());
        this.paint();
    }
}