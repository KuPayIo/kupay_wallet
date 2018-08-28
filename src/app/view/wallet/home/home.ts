/**
 * wallet home page
 */
// ============================== 导入
import { getHeight, popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { openAndGetRandom } from '../../../net/pull';
import { find, register } from '../../../store/store';
import { defalutShowCurrencys } from '../../../utils/constants';
// tslint:disable-next-line:object-curly-spacing
import {fetchBalanceOfCurrency, fetchTotalAssets, formatBalance, formatBalanceValue, popPswBox} from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules:any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
   
    // private gaHeader: any = null;
    private hideHead: any = null;
    // private currencyHeight: number = null;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
        // 登录云端账号
        openAndGetRandom();
    }
    public attach() {
        super.attach();
        document.getElementById('pageOuter').onscroll = () => {
            this.pageScroll();
        };
        if (!this.hideHead) {
            this.hideHead = document.getElementById('hideHead');
        }
        // if (!this.gaHeader) {
        //     this.gaHeader = document.getElementById('gaHeader');
        // }
        // if (!this.currencyHeight) {
        //     this.currencyHeight = document.getElementById('currencyList').offsetHeight;
        // }
    }
    public init(): void {
        const wallet = find('curWallet');
        const gwlt = wallet ? JSON.parse(wallet.gwlt) : null;
        const otherWallets = !!wallet;
        this.state = {
            wallet,
            gwlt,
            otherWallets,
            totalAssets: 0.00,
            currencyList: parseCurrencyList(wallet),
            floatBoxTip: '',
            hiddenAssets: false
        };

        // 如果没有创建钱包提示创建钱包
        if (!find('walletList') || find('walletList').length === 0) {
            this.state.floatBoxTip = '您还没有钱包，请先创建钱包';
        } else if (!gwlt.mnemonicBackup) {
            this.state.floatBoxTip = '为了您的资产安全，请及时备份助记词';
        } else {
            this.state.floatBoxTip = '';
        }
        this.updateAddrsBalance();
    }
    public clickCurrencyItemListener(e: Event, index: number) {
        const wallets = find('walletList');
        if (!wallets || wallets.length === 0) {
            // this.createWalletClick();
            popNew('app-components-linkMessage-linkMessage', {
                tip: '还没有钱包',
                linkTxt: '去创建',
                linkCom: 'app-view-wallet-walletCreate-createWalletEnter'
            });

            return;
        }
        if (!find('curWallet')) {
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
        
        const wallet = find('curWallet');
        if (!wallet) {
            this.createWalletClick();

            return;
        }
        const walletId = wallet.walletId;
       
        let passwd;
        if (!find('hashMap', wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('app-components_level_1-loading-loading', { text: '导出中...' });
        try {
            const getMnemonic = pi_modules.commonjs.exports.relativeGet('app/utils/walletTools').exports.getMnemonic;
            const mnemonic = await getMnemonic(wallet, passwd);
            if (mnemonic) {
                popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd, walletId: walletId });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }
        close.callback(close.widget);
    }

    public hiddenAssetsClick() {
        this.state.hiddenAssets = !this.state.hiddenAssets;
        this.paint();
    }

    /**
     * 处理滑动
     */
    public pageScroll() {
        const page = document.getElementById('page');
        const top = -page.getBoundingClientRect().top;
        if (top > 200) {
            this.hideHead.style.display = 'block';
        } else {
            this.hideHead.style.display = 'none';
        }
    }
   
    /**
     * 余额更新
     */
    private updateAddrsBalance() {
        console.log('余额更新');
        const wallet = find('curWallet');
        if (!wallet) return;

        wallet.currencyRecords.forEach(item => {
            const balance = fetchBalanceOfCurrency(item.addrs, item.currencyName);
            getCurrencyListBalance(this.state.currencyList, balance, item.currencyName);
        });
        this.state.totalAssets = formatBalanceValue(fetchTotalAssets());
        this.paint();
    }

}
// ============================== 本地

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

// 获取currencyList的余额
const getCurrencyListBalance = (currencyList: any[], balance: number, currencyName: string) => {
    return currencyList.map(item => {
        if (item.currencyName === currencyName) {
            const rate = find('exchangeRateJson',currencyName);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(+(balance * rate.CNY));
        }

        return item;
    });
};

register('addrs', (resp) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateAddrsBalance();
    }
});

register('curWallet', (curWallet) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        // const gwlt = curWallet ? JSON.parse(curWallet.gwlt) : null;
        // w.state.wallet = curWallet;
        // w.state.gwlt = gwlt;
        // w.updateAddrsBalance();
        w.init();
        console.log('state----------------------',w.state);
        w.paint();
    }
});
/**
 * 矿山增加项目进入创建钱包页面
 */
register('mineItemJump', (arg) => {
    if (arg === 'walletCreate') {
        popNew('app-view-wallet-walletCreate-createWalletEnter');
    }
});
