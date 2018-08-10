/**
 * wallet home page
 */

import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { GlobalWallet } from '../../core/globalWallet';
import { openAndGetRandom } from '../../store/conMgr';
import { dataCenter } from '../../store/dataCenter';
import { find, register, unregister } from '../../store/store';
import { defalutShowCurrencys } from '../../utils/constants';
import {
    fetchBalanceOfCurrency,fetchTotalAssets, formatBalance, formatBalanceValue, getCurrentWallet, getLocalStorage, getMnemonic,
    openBasePage
} from '../../utils/tools';

export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public destroy() {
        const r = super.destroy();
        unregister('wallets', this.registerWalletsFun);
        unregister('addrs', this.registerAddrsFun);

        return r;
    }

    public init(): void {
        const wallets = getLocalStorage('wallets');
        register('wallets', this.registerWalletsFun);
        register('addrs', this.registerAddrsFun);
        
        let gwlt = null;
        let wallet = null;
        let otherWallets = false;
        if (wallets && wallets.walletList && wallets.walletList.length > 0) {
            otherWallets = true;
            wallet = getCurrentWallet(wallets);
            if (wallet) {
                gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            }
        } else {
            otherWallets = false;
        }
        this.state = {
            wallet,
            gwlt,
            otherWallets,
            totalAssets: 0.00,
            currencyList: parseCurrencyList(wallet),
            floatBoxTip: '为了您的资产安全，请及时备份助记词',
            hiddenAssets: false
        };

        // 如果没有创建钱包提示创建钱包
        if (!wallets) {
            this.state.floatBoxTip = '您还没有钱包，请先创建钱包';
        }

        this.registerAddrsFun();
        // 登录云端账号
        openAndGetRandom();
    }
    public clickCurrencyItemListener(e: Event, index: number) {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        if (!wallets || wallets.walletList.length === 0) {
            this.createWalletClick();

            return;
        }
        if (!wallet) {
            popNew('app-view-wallet-switchWallet-switchWallet');

            return;
        }
        const currency = this.state.currencyList[index];
        popNew('app-view-wallet-transaction-currency_details', {
            currencyName: currency.currencyName, currencyBalance: `${currency.balance} ${currency.currencyName}`
            , currencyBalanceConversion: currency.balanceValue
        });

    }
    public clickAddCurrencyListener() {
        popNew('app-view-wallet-assets-add_asset');
    }
    public createWalletClick() {
        if (this.state.otherWallets) {
            popNew('app-view-wallet-switchWallet-switchWallet');

            return;
        }
        popNew('app-view-wallet-walletCreate-createWalletEnter');
    }
    public switchWalletClick() {
        popNew('app-view-wallet-switchWallet-switchWallet');
    }
    // 点击备份钱包
    public async backupWalletClick() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        if (!wallet) {
            this.createWalletClick();

            return;
        }
        const walletId = wallet.walletId;
        const close = popNew('pi-components-loading-loading', { text: '导出中...' });
        try {
            
            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const mnemonic = await getMnemonic(wallet, passwd);
            if (mnemonic) {
                popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd, walletId: walletId });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            console.log(error);
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }
        close.callback(close.widget);
    }

    public hiddenAssetsClick() {
        this.state.hiddenAssets = !this.state.hiddenAssets;
        this.paint();
    }
    private registerWalletsFun = (wallets: any) => {
        // 创建完钱包之后修改floatBoxTip提示信息
        const walletsObj = getLocalStorage('wallets');
        if (walletsObj) {
            this.state.floatBoxTip = '为了您的资产安全，请及时备份助记词';
        }

        let otherWallets = false;
        if (wallets && wallets.walletList && wallets.walletList.length > 0) {
            otherWallets = true;
        } else {
            otherWallets = false;
        }
        const wallet = getCurrentWallet(wallets);
        let gwlt = null;
        if (wallet) {
            gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        }
        this.state.gwlt = gwlt;
        this.state.otherWallets = otherWallets;
        this.state.wallet = wallet;
        this.state.currencyList = parseCurrencyList(wallet);
        this.registerAddrsFun();
        this.paint();
    }

    /**
     * 余额更新
     */
    private registerAddrsFun = (addrs?: any) => {
        console.log('余额更新');
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        if (!wallet) return;

        wallet.currencyRecords.forEach(item => {
            const balance = fetchBalanceOfCurrency(item.addrs, item.currencyName);
            setCurrencyListBalance(this.state.currencyList, balance, item.currencyName);
        });
        this.state.totalAssets = formatBalanceValue(fetchTotalAssets());
        
        this.paint();
    }
}

/**
 * 解析钱包货币
 * 
 * @param wallet 钱包
 */
const parseCurrencyList = (wallet) => {
    const list = [];
    // todo 测试代码  不处理没有的情况
    // if (!wallet.showCurrencys) return list;
    const showCurrencys = (wallet && wallet.showCurrencys) || defalutShowCurrencys;
    // todo  这里需要正确的处理钱包货币
    find('currencyList').forEach(v => {
        if (showCurrencys.indexOf(v.name) < 0) return;
        list.push({
            currencyName: v.name,
            currencyFullName: v.description,
            balance: 0,
            balanceValue: 0.00
        });
    });

    return list;
};

const setCurrencyListBalance = (currencyList: any[], balance: number, currencyName: string) => {
    return currencyList.map(item => {
        if (item.currencyName === currencyName) {
            const rate = dataCenter.getExchangeRate(currencyName);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(+(balance * rate.CNY));
        }

        return item;
    });
};
