/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
import { depCopy } from '../utils/tools';
import { Addr, Wallet } from '../view/interface';
import { TransactionRecord } from './interface';
import { register } from './store';
// ===================================================== 导出
export const find = (keyName: KeyName): any => {
    const value = JSON.parse(localStorage.getItem(keyName));

    return value instanceof Object ? depCopy(value) : value;
};
// ===================================================== 本地
type KeyName = 'wallets' | 'addrs' | 'transactions';
// ===================================================== 立即执行
register('wallets', (wallets: Wallet[]) => {
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
    let locWallets = JSON.parse(localStorage.getItem('wallets'));
    if (!locWallets || locWallets.length <= 0) return;
    locWallets = locWallets.map(v => {
        if (v.walletId === curWallet.walletId) v = curWallet;

        return v;
    });
    localStorage.setItem('wallets', JSON.stringify(locWallets));
});