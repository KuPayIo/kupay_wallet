/**
 * 基础操作
 */
import { GlobalWallet } from '../core/globalWallet';
import { openAndGetRandom } from '../net/pull';
import { Addr, Wallet } from '../store/interface';
import { find, updateStore } from '../store/store';
import { getAvatarRandom } from './account';
import { defalutShowCurrencys } from './constants';
import { encrypt, getAddrsAll, openBasePage } from './tools';

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
    let index = -1;
    for (let i = 0;i < walletList.length;i++) {
        if (walletList[i].walletId === gwlt.glwtId) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        try {
            await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '提示', content: '该钱包已存在，是否使用新密码' });
        } catch (err) {
            // console.log(err);
            updateStore('curWallet', walletList[index]);

            return false;
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

    return true;
};

/**
 * 创建钱包
 */
export const createWallet = async (walletPsw,walletName,walletPswTips) => {
    const salt = find('salt');
    const gwlt = await GlobalWallet.generate(walletPsw, walletName,salt);

    // 创建钱包基础数据
    const wallet: Wallet = {
        walletId: gwlt.glwtId,
        avatar: getAvatarRandom(),
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };

    wallet.currencyRecords.push(...gwlt.currencyRecords);

    if (walletPswTips.trim().length > 0) {
        wallet.walletPswTips = encrypt(walletPswTips.trim());
    }

    const walletList: Wallet[] = find('walletList');
    const addrs: Addr[] = find('addrs');
    addrs.push(...gwlt.addrs);
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    updateStore('salt', salt);

    openAndGetRandom(true);
};