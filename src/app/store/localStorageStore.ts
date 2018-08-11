/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
import { Addr, Wallet } from '../view/interface';
import { LockScreen, TransactionRecord } from './interface';
import { register } from './store';
// ===================================================== 导出

// ===================================================== 本地

// ===================================================== 立即执行
const setLocalStorage = (key:string,data:any) => {
    localStorage.setItem(key, JSON.stringify(data));
};
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

// 注册是否已阅读隐私协议
register('readedPriAgr',(readed:boolean) => {
    setLocalStorage('readedPriAgr',readed);
});

register('lockScreen',(ls:LockScreen) => {
    setLocalStorage('lockScreen',ls);
});
