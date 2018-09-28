/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
import { getFirstEthAddr } from '../utils/tools';
import { Addr, CHisRec, LockScreen, ShapeShiftTxs,SHisRec, TopContact, TransRecordLocal, Wallet } from './interface';
import { register, updateStore } from './store';
// ===================================================== 导出

// ===================================================== 本地

// ===================================================== 立即执行
const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const getLocalStorage = (key: string) => {
    return JSON.parse(localStorage.getItem(key));
};
// tslint:disable-next-line:max-func-body-length
export const initLocalStorageStore = () => {
    register('walletList', (walletList: Wallet[]) => {
        let locWallets = JSON.parse(localStorage.getItem('wallets'));
        if (!locWallets) locWallets = { curWalletId: '', salt: '', walletList: [] };
        locWallets.walletList = walletList;
        localStorage.setItem('wallets', JSON.stringify(locWallets));
    });
    
    register('addrs', (addrs: Addr[]) => {
        localStorage.setItem('addrs', JSON.stringify(addrs));
    });
    
    register('transactions', (transactions: TransRecordLocal[]) => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    });
    
    register('curWallet', (curWallet: Wallet) => {
        const locWallets = JSON.parse(localStorage.getItem('wallets'));
        if (!curWallet || !locWallets || locWallets.walletList.length <= 0) return;
        locWallets.walletList = locWallets.walletList.map(v => {
            if (v.walletId === curWallet.walletId) {
                v = curWallet;
                locWallets.curWalletId = curWallet.walletId;
            }
    
            return v;
        });
        localStorage.setItem('wallets', JSON.stringify(locWallets));

        // ===============================更新walletList
        const walletList = JSON.parse(localStorage.getItem('wallets')).walletList;
        updateStore('walletList',walletList);
    });
    
    register('salt', (salt: string) => {
        let locWallets = JSON.parse(localStorage.getItem('wallets'));
        if (!locWallets) locWallets = { curWalletId: '', salt: '', walletList: [] };
        locWallets.salt = salt;
        localStorage.setItem('wallets', JSON.stringify(locWallets));
    });
    
    // 注册是否已阅读隐私协议
    register('readedPriAgr', (readed: boolean) => {
        setLocalStorage('readedPriAgr', readed);
    });
    
    // 锁屏相关
    register('lockScreen', (ls: LockScreen) => {
        setLocalStorage('lockScreen', ls);
    });
    
    // 发送红包记录
    register('sHisRec', (sHisRec: SHisRec) => {
        const sHisRecMap = new Map(getLocalStorage('sHisRecMap'));
        if (!sHisRec) {
            sHisRecMap.delete(getFirstEthAddr());
        } else {
            sHisRecMap.set(getFirstEthAddr(), sHisRec);
        }
        setLocalStorage('sHisRecMap', sHisRecMap);
    });
    
    // 兑换红包记录
    register('cHisRec', (cHisRec: CHisRec) => {
        const cHisRecMap = new Map(getLocalStorage('cHisRecMap'));
        if (!cHisRec) {
            cHisRecMap.delete(getFirstEthAddr());
        } else {
            cHisRecMap.set(getFirstEthAddr(), cHisRec);
        }
    
        setLocalStorage('cHisRecMap', cHisRecMap);
    });
    
    // 邀请红包记录
    register('inviteRedBagRec', (inviteRedBagRec: CHisRec) => {
        const inviteRedBagRecMap = new Map(getLocalStorage('inviteRedBagRecMap'));
        if (!inviteRedBagRec) {
            inviteRedBagRecMap.delete(getFirstEthAddr());
        } else {
            inviteRedBagRecMap.set(getFirstEthAddr(), inviteRedBagRec);
        }
        setLocalStorage('inviteRedBagRecMap', inviteRedBagRecMap);
    });
    
    // 常用联系人
    register('TopContacts', (TopContacts: TopContact[]) => {
        setLocalStorage('TopContacts', TopContacts);
    });
    
    // shapeshift交易记录
    register('shapeShiftTxsMap',(shapeShiftTxsMap:Map<string,ShapeShiftTxs>) => {
        setLocalStorage('shapeShiftTxsMap',shapeShiftTxsMap);
    });
    
    // ERC20精度
    register('ERC20TokenDecimals',(ERC20TokenDecimals:Object) => {
        setLocalStorage('ERC20TokenDecimals',ERC20TokenDecimals);
    });

    register('lastGetSmsCodeTime',(lastGetSmsCodeTime:number) => {
        setLocalStorage('lastGetSmsCodeTime',lastGetSmsCodeTime);
    });
    // 本地eth nonce
    register('nonceMap',(nonceMap:Map<string,number>) => {
        setLocalStorage('nonceMap',nonceMap);
    });

     // 本地realUserMap
    register('realUserMap',(realUserMap:Map<string,boolean>) => {
        setLocalStorage('realUserMap',realUserMap);
    });

     // 本地realUserMap
    register('token',(token:string) => {
        setLocalStorage('token',token);
    });
};
