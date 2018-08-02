/**
 * 基础操作
 */
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../store/dataCenter';
import { Addr, Wallet } from '../view/interface';
import { getAvatarRandom } from './account';
import { defalutShowCurrencys } from './constants';
import { encrypt, getAddrsAll, getLocalStorage, openBasePage, setLocalStorage } from './tools';

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = async (mnemonic, psw, pswTips) => {
    const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '', salt: dataCenter.salt };
    let addrs: Addr[] = getLocalStorage('addrs') || [];

    let gwlt = null;
    console.time('import');
    gwlt = await GlobalWallet.fromMnemonic(mnemonic, psw);
    console.timeEnd('import');
    // 判断钱包是否存在
    let len = wallets.walletList.length;
    if (wallets.walletList.some(v => v.walletId === gwlt.glwtId)) {
        await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '提示', content: '该钱包已存在，是否使用新密码' });

        for (let i = len - 1; i >= 0; i--) {
            if (gwlt.glwtId === wallets.walletList[i].walletId) {
                const wallet0 = wallets.walletList.splice(i, 1)[0];// 删除已存在钱包
                const retAddrs = getAddrsAll(wallet0);
                addrs = addrs.filter(addr => {
                    return retAddrs.indexOf(addr.addr) === -1;
                });
                break;
            }
        }
        len--;
    }

    gwlt.nickName = `我的钱包${len + 1}`;

    const curWalletId = gwlt.glwtId;
    const wallet: Wallet = {
        walletId: curWalletId,
        avatar: getAvatarRandom(),
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };
    wallet.currencyRecords.push(...gwlt.currencyRecords);

    if (pswTips.trim().length > 0) {
        wallet.walletPswTips = encrypt(pswTips.trim());
    }

    addrs.push(...gwlt.addrs);
    setLocalStorage('addrs', addrs, false);
    wallets.curWalletId = curWalletId;
    wallets.walletList.push(wallet);
    setLocalStorage('wallets', wallets, true);
};
