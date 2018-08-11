/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
import { Addr, Wallet } from '../view/interface';
import { TransactionRecord } from './interface';
import { register } from './store';
// ===================================================== 导出

// ===================================================== 本地

// ===================================================== 立即执行
register('walletList', (wallets: Wallet[]) => {
    let locWallets = JSON.parse(localStorage.getItem('wallets'));
    if (!locWallets) locWallets = { curWalletId: '', salt: '', walletList: [] };
    locWallets.walletList = wallets;
    localStorage.setItem('wallets', JSON.stringify(locWallets));
});

register('addrs', (addrs: Addr[]) => {
    localStorage.setItem('addrs', JSON.stringify(addrs));
});

register('transactions', (transactions: TransactionRecord[]) => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
});

register('curWallet', (curWallet: Wallet) => {
    const locWallets = JSON.parse(localStorage.getItem('wallets'));
    if (!curWallet || !locWallets || locWallets.walletList.length <= 0) return;
    locWallets.walletList = locWallets.walletList.map(v => {
        if (v.walletId === curWallet.walletId) {
            v = curWallet;
            locWallets.curWalletId = curWallet.walletId;
        }

        return v;
    });
    localStorage.setItem('wallets', JSON.stringify(locWallets));
});

register('salt', (salt: string) => {
    let locWallets = JSON.parse(localStorage.getItem('wallets'));
    if (!locWallets) locWallets = { curWalletId: '', salt: '', walletList: [] };
    locWallets.salt = salt;
    localStorage.setItem('wallets', JSON.stringify(locWallets));
});