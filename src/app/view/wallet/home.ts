import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet, randomRgbColor } from '../../utils/tools'
import { register } from '../../store/store'
import { GaiaWallet } from "../../core/eth/wallet";

interface Wallet {
    walletName: string;
    walletNameDotBgColor: string;
    totalAssets: string;// total assets
    currencyList: Array<any>;//Currency list
}
export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        const wallets = getLocalStorage("wallets");
        register("wallets", (wallets) => {
            const wallet = getCurrentWallet(wallets);
            const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            this.state.wallet = wallet;
            this.state.gwlt = gwlt;
            this.state.currencyList = parseCurrencyList(wallet);
            this.paint();
        });
        let gwlt = null;
        let wallet = null;
        if (wallets) {
            wallet = getCurrentWallet(wallets);
            gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        }
        this.state = {
            wallet,
            gwlt,
            totalAssets: "0.00",
            currencyList: parseCurrencyList(wallet)
        };
    }

    public clickCurrencyItemListener(e, index) {

        const wallets = getLocalStorage("wallets");
        if (!wallets) {
            this.createWalletClick();
            return
        }

        let currency = this.state.currencyList[index];
        popNew("app-view-wallet-transaction-currency_details", {
            currencyName: currency.currencyName, currencyBalance: `${currency.balance} ${currency.currencyName}`
            , currencyBalanceConversion: currency.balanceValue
        })

    }
    public clickAddCurrencyListener() {
        popNew("app-view-wallet-assets-add_asset")
    }
    public createWalletClick() {
        popNew("app-view-wallet-walletCreate-walletCreate");
    }
    public switchWalletClick() {
        popNew("app-view-wallet-switchWallet-switchWallet");
    }
}

/**
 * 解析钱包货币
 * @param wallet 
 */
const parseCurrencyList = (wallet) => {
    let list = [];
    //todo 测试代码  不处理没有的情况
    // if (!wallet.showCurrencys) return list;
    let showCurrencys = (wallet && wallet.showCurrencys) || ["ETH"];

    //todo  这里需要正确的处理钱包货币
    showCurrencys.forEach(v => {
        let r = "";
        switch (v) {
            case "BTC": r = "Bit coin"; break;
            case "GAIA": r = "GAIA.WORLD currency"; break;
            case "ETH": r = "Ethereum"; break;
            case "ETC": r = "Ethereum Classic"; break;
            case "BCH": r = "Bitcoin Cash"; break;
            case "XRP": r = "Ripple"; break;
        }
        list.push({
            currencyName: v,
            currencyFullName: r,
            balance: "0",
            balanceValue: "￥0.00"
        });
    });
    return list;
}
