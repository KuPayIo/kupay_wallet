/**
 * 货币添加
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20TokensTestnet } from '../../../core/eth/tokens';
import { GlobalWallet } from '../../../core/globalWallet';
import { dataCenter } from '../../../store/dataCenter';
import { register,unregister } from '../../../store/store';
import { decrypt, getCurrentWallet, getLocalStorage, setLocalStorage } from '../../../utils/tools';

export class AddAsset extends Widget {
    
    public ok: () => void;

    constructor() {
        super();
    }
    
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        register('wallets',this.registerWalletsFun);

        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);

        const currencyList = dataCenter.currencyList;

        const showCurrencys = wallet.showCurrencys || [];

        this.state = {
            title: '添加资产',
            currencyList: currencyList,
            list: currencyList.map(v => {
                v.isChoose = showCurrencys.indexOf(v.name) >= 0;

                return v;
            })
        };
    }
    
    /**
     * 处理关闭
     */
    public doClose() {
        unregister('wallets',this.registerWalletsFun);
        this.ok && this.ok();
    }

    /**
     * 处理查找
     */
    public doSearch() {
        popNew('app-view-wallet-assets-search_asset', { list: this.state.list });
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange(e: any, index: number) {
        const currencys = this.state.list[index];
        const newType = !currencys.isChoose;
        currencys.isChoose = newType;
        this.paint();

        // 处理search数据
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.name);
        if (newType && oldIndex < 0) {
            showCurrencys.push(currencys.name);
        } else if (!newType && oldIndex >= 0) {
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        setLocalStorage('wallets', wallets, true);

        if (!newType) return;
        const currencyRecords = wallet.currencyRecords;
        // 判断当前点击货币是否已经初始化
        let isInit = false;
        currencyRecords.forEach(ele => {
            if (ele.currencyName === currencys.name) {
                isInit = true;
            }
        });
        if (!isInit && ERC20TokensTestnet[currencys.name]) {
            const psw = decrypt(wallet.walletPsw);
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);

            initERC20TokenCurrency(currencys.name,ERC20TokensTestnet[currencys.name],psw,gwlt.seed);

            return;
        }
    }

    private registerWalletsFun = (wallets:any) => {
        const wallet = getCurrentWallet(wallets);
        if (!wallet) return;
        const showCurrencys = wallet.showCurrencys || [];
        this.state.list = this.state.currencyList.map(v => {
            v.isChoose = showCurrencys.indexOf(v.name) >= 0;

            return v;
        });

        this.paint();
    }

}

const initERC20TokenCurrency = async (tokenName:string,contractAddress: string,passwd: string,seed:string) => {
    GlobalWallet.fromSeedEthToken(tokenName,contractAddress,passwd,seed).then(r => {
        const wallets = getLocalStorage('wallets');
        const addrs = getLocalStorage('addrs');
        const wallet = getCurrentWallet(wallets);
        wallet.currencyRecords.push(r.currencyRecord);
        addrs.push(...r.addrs);
        setLocalStorage('wallets', wallets);
        setLocalStorage('addrs', addrs);
        r.addrs.forEach(item => {
            dataCenter.addAddr(item.addr, item.addrName, item.currencyName);
        });
    });

    return ;
};