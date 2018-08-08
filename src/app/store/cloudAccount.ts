import { kpt2kt, wei2Eth } from '../utils/tools';
import { CurrencyType, getAllBalance } from './conMgr';
import { notify } from './store';

/**
 * 云端账号数据中心
 */
class CloudAccount {
    // 云端账户余额
    public cloudBalance:any = {
        KT:0,
        ETH:0
    };
    /**
     * 初始化
     */
    public init() {
        this.updateBalance();
    }
    public updateBalance() {
        getAllBalance().then(balanceInfo => {
            console.log('balanceInfo',balanceInfo);
            for (let i = 0; i < balanceInfo.value.length; i++) {
                const each = balanceInfo.value[i];
                if (each[0] === CurrencyType.KT) {
                    this.cloudBalance.KT = kpt2kt(each[1]);
                } else if (each[0] === CurrencyType.ETH) {
                    this.cloudBalance.ETH = wei2Eth(each[1]);
                }
            }
            notify('cloudBalance',this.cloudBalance);
        }).catch(console.log);
        
    }
}

export const cloudAccount:CloudAccount = new CloudAccount();