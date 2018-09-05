/**
 * 本地钱包相关操作
 */
import { GlobalWallet } from '../core/globalWallet';
import { openAndGetRandom } from '../net/pull';
import { Addr, Wallet } from '../store/interface';
import { find, updateStore } from '../store/store';
import { defalutShowCurrencys } from '../utils/constants';

/**
 * 创建钱包
 */
export const createWallet = async (walletPsw:string,walletName:string,avatar:string) => {
    const salt = find('salt');
    const gwlt = await GlobalWallet.generate(walletPsw, walletName,salt);

    // 创建钱包基础数据
    const wallet: Wallet = {
        walletId: gwlt.glwtId,
        avatar: '',
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };

    wallet.currencyRecords.push(...gwlt.currencyRecords);

    const walletList: Wallet[] = find('walletList');
    const addrs: Addr[] = find('addrs');
    addrs.push(...gwlt.addrs);
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    updateStore('salt', salt);
    updateStore('avatar',avatar);

    openAndGetRandom(true);
};

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = async (mnemonic, psw) => {
    const walletList: Wallet[] = find('walletList');
    const salt = find('salt');
    const addrs: Addr[] = find('addrs') || [];

    let gwlt = null;
    console.time('import');
    gwlt = await GlobalWallet.fromMnemonic(mnemonic, psw, salt);
    console.timeEnd('import');
   
    gwlt.nickName = `我的钱包`;

    const wallet: Wallet = {
        walletId: gwlt.glwtId,
        avatar: '',
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };
    wallet.currencyRecords.push(...gwlt.currencyRecords);

    addrs.push(...gwlt.addrs);
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    updateStore('salt', salt);
    openAndGetRandom();

    return true;
};