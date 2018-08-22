/**
 * my wallet
 */
// ==============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { dataCenter } from '../../../logic/dataCenter';
import { openAndGetRandom } from '../../../net/pull';
import { Wallet } from '../../../store/interface';
import { find, register, updateStore } from '../../../store/store';
import { walletNameAvailable } from '../../../utils/account';
// tslint:disable-next-line:max-line-length
import { formatBalanceValue, getAddrsAll,getWalletByWalletId, getWalletIndexByWalletId, openBasePage, popPswBox } from '../../../utils/tools';
import { decrypt, encrypt, fetchTotalAssets, getMnemonic, VerifyIdentidy } from '../../../utils/walletTools';

// ==============================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class WalletManagement extends Widget {
    public ok: (returnHome?: boolean) => void;
    public setProps(props: any, oldProps: any) {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        const walletList = find('walletList');
        const wallet = getWalletByWalletId(walletList, this.props.walletId);
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
        
        if (!wallet) return;
        this.state.totalAssets = formatBalanceValue(fetchTotalAssets());
        this.paint();
    }

    // 返回
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

    // 导出私钥
    public async exportPrivateKeyClick() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        const walletList = find('walletList');
        const wallet = getWalletByWalletId(walletList, this.props.walletId);
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('app-components-loading-loading', { text: '导出私钥中...' });
        try {
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

    // 绑定手机
    public async bindPhone() {
        if (this.state.isUpdatingWalletName || this.state.isUpdatingPswTips) {
            this.pageClick();

            return;
        }
        popNew('app-view-cloud-cloudAccount-bindPhone', {});
    }

    // 修改钱包名称
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
            const walletList = find('walletList');
            const wallet = getWalletByWalletId(walletList, this.props.walletId);
            // const addr0 = wallet.currencyRecords[0].addrs[0];
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            gwlt.nickName = v;
            wallet.gwlt = gwlt.toJSON();
            updateStore('walletList', walletList);
            updateStore('curWallet', wallet);
        }
        input.value = v;
        this.state.isUpdatingWalletName = false;
    }
    public pswTipsInputFocus() {
        this.state.isUpdatingPswTips = true;
    }

    // 修改密码提示
    public pswTipsInputBlur() {
        const pswTipsInput: any = document.querySelector('#pswTipsInput');
        const value = pswTipsInput.value;
        const walletList = find('walletList');
        const wallet = getWalletByWalletId(walletList, this.props.walletId);
        wallet.walletPswTips = encrypt(value);
        updateStore('walletList', walletList);
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
        
        const wallet = getWalletByWalletId(find('walletList'), this.props.walletId);
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('app-components-loading-loading', { text: '导出中...' });
        try {
            const mnemonic = await getMnemonic(wallet, passwd);
            if (mnemonic) {
                popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd, walletId: this.props.walletId });
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
       
        const wallet = getWalletByWalletId(find('walletList'), this.props.walletId);
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('app-components-loading-loading', { text: '加载中...' });
        try {
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

    /**
     * 删除钱包
     */
    public async deleteWallet() {

        await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '删除钱包', content: '删除后需要重新导入，之前的分享也将失效' });

        const close = popNew('app-components-loading-loading', { text: '删除中...' });
        
        const walletList = find('walletList');
        const wallet = getWalletByWalletId(walletList, this.props.walletId);
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        try {
            const isEffective = await VerifyIdentidy(wallet, passwd);
            if (isEffective) {
                const curWallet = find('curWallet');
                const walletIndex = getWalletIndexByWalletId(walletList, curWallet.walletId);
                // 删除地址
                const addrs = getAddrsAll(wallet);
                this.deleteAddrs(addrs);
                // 移除当前钱包的交易记录
                this.deleteTransactions(addrs);

                // 删除钱包
                walletList.splice(walletIndex, 1);
                updateStore('walletList', walletList);
                updateStore('curWallet', walletList[0] || null);

                await openAndGetRandom();
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
        const addrs = find('addrs');
        const addrsNew = addrs.filter((item) => {
            return delAddrs.indexOf(item.addr) < 0;
        });
        updateStore('addrs', addrsNew);
    }

    /**
     * 移除交易记录
     */
    public deleteTransactions(delAddrs: string[]) {
        const transactions = find('transactions');
        const transactionsNew = transactions.filter((item) => {
            return delAddrs.indexOf(item.addr) < 0;
        });
        updateStore('transactions', transactionsNew);
    }

}

// ==============================================本地

// walletList更新
register('walletList', (wallets:[Wallet]) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const wallet = getWalletByWalletId(wallets, w.props.walletId);
        if (!wallet) return;
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        let pswTips = '';
        if (wallet.walletPswTips) {
            pswTips = decrypt(wallet.walletPswTips);
        }
        pswTips = pswTips.length > 0 ? pswTips : '无';
        w.state.mnemonicBackup = gwlt.mnemonicBackup;
        w.state.pswTips = pswTips;
        w.paint();
    }
});

// 总资产更新
register('addrs', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const wallet = getWalletByWalletId(find('walletList'), w.props.walletId);
        if (!wallet) return;

        w.state.totalAssets = formatBalanceValue(fetchTotalAssets());
        w.paint();
    }
});
/**
 * 矿山增加项目进入绑定手机号页面
 */
register('mineItemJump',(arg) => {
    if (arg === 'bindPhone') {
        popNew('app-view-cloud-cloudAccount-bindPhone', {});
    }
});