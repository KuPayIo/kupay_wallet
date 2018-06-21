/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { open, popNew } from '../../pi/ui/root';
import { isString } from '../../pi/util/util';
import { Forelet } from '../../pi/widget/forelet';
import { addWidget } from '../../pi/widget/util';
import { BTCWallet } from '../core/btc/wallet';
import { GaiaWallet } from '../core/eth/wallet';
import { dataCenter } from '../store/dataCenter';
import { decrypt, getDefaultAddr, getLocalStorage, setLocalStorage } from '../utils/tools';
import { Addr, CurrencyRecord } from './interface';
// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // 数据检查
    checkUpdate();
    // 初始化数据
    dataCenter.init();
    // makepayment();
    // 打开界面
    popNew('app-view-app');
    // popNew('app-view-test-test');
    // popNew('app-view-wallet-walletCreate-walletCreate');	// popNew('app-view-application-home');
    // popNew('app-view-groupwallet-groupwallet');
    // popNew('app-view-financialManagement-home');
    // popNew('app-view-mine-walletManagement-walletManagement');

    if (cb) cb();
};

const checkUpdate = () => {
    const wallets = getLocalStorage('wallets');
    if (wallets) {
        const addrs: Addr[] = getLocalStorage('addrs') || [];
        let isUpdate = false;
        // 将缓存中的地址信息数据结构进行调整
        wallets.walletList.map(v => {
            v.currencyRecords.map(v1 => {
                v1.addrs = v1.addrs.map(v2 => {
                    if (isString(v2)) return v2;
                    if (!isHad(addrs, v2.addr)) {
                        addrs.push({
                            addr: v2.addr, balance: 0, currencyName: v1.currencyName, addrName: v2.addrName, gwlt: v2.gwlt
                            , record: v2.record
                        });
                        isUpdate = true;
                    }

                    return v2.addr;
                });

                return v1;
            });

            return v;
        });

        // // 清空btc相关地址
        // wallets.walletList.map(wallet => {
        //     wallet.currencyRecords = wallet.currencyRecords.filter(v => v.currencyName !== 'BTC');

        //     return wallet;
        // });
        // addrs = addrs.filter(v => v.currencyName !== 'BTC');

        // 已有钱包无btc地址初始化地址
        wallets.walletList.map(wallet => {
            const hadBtc = wallet.currencyRecords.some(v => v.currencyName === 'BTC');
            if (hadBtc) return wallet;
            const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            const psw = decrypt(wallet.walletPsw);
            createBtcGwlt(wallet, addrs, gwlt.exportMnemonic(psw), psw);
            isUpdate = true;

            return wallet;
        });

        if (isUpdate) {
            setLocalStorage('addrs', addrs, false);
            setLocalStorage('wallets', wallets, false);
        }
    }
};

const isHad = (list: any[], elAddr) => {
    return list.some(v => v.addr === elAddr);
};

const makepayment = async () => {
    const words = 'void chuckle melody have hood veteran face wine cat control thumb wheel admit mammal cinnamon';
    const wlt = BTCWallet.fromMnemonic('123', words, 'testnet', 'english');
    console.log(wlt);
    // wlt.unlock('123');
    // await wlt.init();
    // const output = {
    //     toAddr: 'mvPrm9kG8TuPDcsFWHxGMGgxizDUHRHKzv',
    //     amount: 0.01,
    //     chgAddr: 'mzJ1AAKQpMj5eaCL3b4oNuSantXmVgz2tM'
    // };
    // console.log(wlt);

    // // return wlt.spend(output, 'high').then(console.log); 
    // wlt.lock('123');
};

const createBtcGwlt = (wallet, addrs, mm, walletPsw) => {
    // todo 测试阶段，使用测试链，后续改为主链
    const gwlt = BTCWallet.fromMnemonic(walletPsw, mm, 'testnet', 'english');
    // gwlt.nickName = walletName;
    gwlt.unlock(walletPsw);
    const address = gwlt.derive(0);
    gwlt.lock(walletPsw);
    const currencyRecord: CurrencyRecord = {
        currencyName: 'BTC',
        currentAddr: address,
        addrs: [address]
    };
    wallet.currencyRecords.push(currencyRecord);

    addrs.push({
        addr: address,
        addrName: getDefaultAddr(address),
        gwlt: gwlt.toJSON(),
        record: [],
        balance: 0,
        currencyName: 'BTC'
    });

    return gwlt;
};

// ============================== 立即执行
