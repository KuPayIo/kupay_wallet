/**
 * wallet home page
 */

import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { GaiaWallet } from '../../core/eth/wallet';
import { dataCenter } from '../../store/dataCenter';
import { register } from '../../store/store';
import { defalutShowCurrencys } from '../../utils/constants';
import { getCurrentWallet, getLocalStorage } from '../../utils/tools';

export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        const wallets = getLocalStorage('wallets');
        register('wallets', (wallets) => {
            let otherWallets = false;
            if (wallets && wallets.walletList && wallets.walletList.length > 0) {
                otherWallets = true;
            } else {
                otherWallets = false;
            }
            const wallet = getCurrentWallet(wallets);
            let gwlt = null;
            if (wallet) {
                gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            }
            this.state.gwlt = gwlt;
            this.state.otherWallets = otherWallets;
            this.state.wallet = wallet;
            this.state.currencyList = parseCurrencyList(wallet);
            this.paint();
        });
        let gwlt = null;
        let wallet = null;
        let otherWallets = false;
        if (wallets && wallets.walletList && wallets.walletList.length > 0) {
            otherWallets = true;
            wallet = getCurrentWallet(wallets);
            if (wallet) {
                gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            }
        } else {
            otherWallets = false;
        }
        this.state = {
            wallet,
            gwlt,
            otherWallets,
            totalAssets: '0.00',
            currencyList: parseCurrencyList(wallet)
        };

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
        popNew('app-view-wallet-walletCreate-walletCreate');
    }
    public switchWalletClick() {
        popNew('app-view-wallet-switchWallet-switchWallet');
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
    dataCenter.currencyList.forEach(v => {
        if (showCurrencys.indexOf(v.name) < 0) return;
        list.push({
            currencyName: v.name,
            currencyFullName: v.description,
            balance: '0',
            balanceValue: '≈0.00 CNY'
        });
    });

    return list;
};
