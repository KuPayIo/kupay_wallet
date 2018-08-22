/**
 * 基础操作
 */
import { GlobalWallet } from '../core/globalWallet';
import { openAndGetRandom } from '../net/pull';
import { Addr, Wallet } from '../store/interface';
import { find, updateStore } from '../store/store';
import { getAvatarRandom } from './account';
import { defalutShowCurrencys } from './constants';
import { getAddrsAll, openBasePage } from './tools';
import { encrypt } from './walletTools';

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = async (mnemonic, psw, pswTips) => {
    const walletList: Wallet[] = find('walletList');
    const salt = find('salt');
    let addrs: Addr[] = find('addrs') || [];

    let gwlt = null;
    console.time('import');
    gwlt = await GlobalWallet.fromMnemonic(mnemonic, psw, salt);
    console.timeEnd('import');
    // 判断钱包是否存在
    let len = walletList.length;
    if (walletList.some(v => v.walletId === gwlt.glwtId)) {
        try {
            await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '提示', content: '该钱包已存在，是否使用新密码' });
        } catch (err) {
            // console.log(err);
        }
        
        for (let i = len - 1; i >= 0; i--) {
            if (gwlt.glwtId === walletList[i].walletId) {
                const wallet0 = walletList.splice(i, 1)[0];// 删除已存在钱包
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

    const wallet: Wallet = {
        walletId: gwlt.glwtId,
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
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    updateStore('salt', salt);

    openAndGetRandom();
};
