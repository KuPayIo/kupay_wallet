import { MainChainCoin, PAGELIMIT } from '../publicLib/config';
import { CloudCurrencyType, MinerFeeLevel } from '../publicLib/interface';
import { unicodeArray2Str } from '../publicLib/tools';
import { getStore, setStore } from '../store/memstore';
import { parseCloudBalance, parseMiningRank, parseRechargeWithdrawalLog } from '../store/parse';
import { requestAsync, requestAsyncNeedLogin } from './login';

/**
 * pull request
 */

// 获取真实用户
export const getRealUser = async () => {
    const msg = {
        type: 'wallet/user@get_real_user',
        param: {}
    };

    requestAsync(msg).then(res => {
        const userInfo  = getStore('user/info');
        const isRealUser = res.value !== 'false';
        
        if (isRealUser !== userInfo.isRealUser) {
            userInfo.isRealUser =  isRealUser;
            setStore('user/info',userInfo);
        }
    });
};

/**
 * 获取绑定的手机号
 */
export const getBindPhone = async () => {
    const msg = { type: 'wallet/user@get_phone',param: {} };

    return  requestAsync(msg).then(res => {
        const userInfo  = getStore('user/info');
        if (userInfo.phoneNumber !== res.phone || userInfo.areaCode !== res.num) {
            userInfo.phoneNumber =  res.phone;
            userInfo.areaCode = res.num;
            setStore('user/info',userInfo);
        }
        
    }).catch(err => {
        // console.log(err);
    });
};

/**
 * 获取所有的货币余额
 */
export const getServerCloudBalance = () => {
    const list = [];
    list.push(CloudCurrencyType.KT);
    list.push(CloudCurrencyType.SC);
    for (const k in CloudCurrencyType) {
        if (MainChainCoin.hasOwnProperty(k)) {
            list.push(CloudCurrencyType[k]);
        }
    }
    const msg = { type: 'wallet/account@get', param: { list:`[${list}]` } };
    
    return requestAsync(msg).then(balanceInfo => {
        console.log('balanceInfo', balanceInfo);
        const cloudBalances = parseCloudBalance(balanceInfo);
        const cloudWallets = getStore('cloud/cloudWallets');
        for (const [key,value] of cloudBalances) {
            const cloudWallet = cloudWallets.get(key);
            cloudWallet.balance = value;
        }
        setStore('cloud/cloudWallets',cloudWallets);
    }).catch((res) => {
        console.log(res);
    });
};

/**
 * 获取当前用户信息
 */
export const getUserInfoFromServer = async (uids: [number]) => {
    const msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };

    return requestAsync(msg).then(res => {
        const userInfoStr = unicodeArray2Str(res.value[0]);
        const localUserInfo = getStore('user/info');
        console.log('localUserInfo ==== ',localUserInfo);
        console.log('serverUserInfoStr ==== ',userInfoStr);
        
        if (userInfoStr !== JSON.stringify(localUserInfo)) {
            const serverUserInfo = userInfoStr ? JSON.parse(userInfoStr) : {} ; 
            console.log('serverUserInfo ==== ',serverUserInfo);
            const userInfo = {};
            for (const key in localUserInfo) {
                if (!serverUserInfo[key]) {
                    userInfo[key] = localUserInfo[key];
                } else {
                    userInfo[key] = serverUserInfo[key];
                }
            }
            console.log('userInfo ==== ',userInfo);
            setStore('user/info',userInfo);
        } 
        
    });
        
};

/**
 * 获取gasPrice
 */
export const fetchGasPrices = async () => {
    const msg = {
        type: 'wallet/bank@get_gas',
        param: {}
    };
    
    try {
        const res = await requestAsync(msg);
        
        const gasPrice = {
            [MinerFeeLevel.Standard]:Number(res.standard),
            [MinerFeeLevel.Fast]:Number(res.fast),
            [MinerFeeLevel.Fastest]:Number(res.fastest)
        };
        setStore('third/gasPrice',gasPrice);

    } catch (err) {
        console.log('fetchGasPrices err =',err);
    }
};

/**
 * 获取gasPrice
 */
export const fetchBtcFees = async () => {
    const msg = {
        type: 'wallet/bank@get_fees',
        param: {}
    };
    
    try {
        const res = await requestAsync(msg);
        const obj = JSON.parse(res.btc);
        const btcMinerFee = {
            [MinerFeeLevel.Standard]:Number(obj.low_fee_per_kb),
            [MinerFeeLevel.Fast]:Number(obj.medium_fee_per_kb),
            [MinerFeeLevel.Fastest]:Number(obj.high_fee_per_kb)
        };
        setStore('third/btcMinerFee',btcMinerFee);

    } catch (err) {
        console.log('fetchBtcFees err =',err);
    }
};

/**
 * 设置用户基础信息
 */
export const setUserInfo = async () => {
    const userInfo = getStore('user/info');
    const msg = { type: 'wallet/user@set_info', param: { value:JSON.stringify(userInfo) } };
    
    return requestAsync(msg);
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const getHighTop =  (num: number) => {
    const msg = { type: 'wallet/cloud@get_high_top', param: { num: num } };

    return  requestAsync(msg).then(data => {
        console.log('获取全部排名========================',data);
        
        return parseMiningRank(data);
    });
    
};

/**
 * 充值历史记录
 */
export const getRechargeLogs = async (coin: string,start?) => {
    // tslint:disable-next-line:no-reserved-keywords
    let type;
    if (coin === 'BTC') {
        type = 'wallet/bank@btc_pay_log';
    } else if (coin === 'ETH') {
        type = 'wallet/bank@pay_log';
    } else { // KT
        return;
    }
    let msg;
    if (start) {
        msg = {
            type,
            param: {
                start,
                count:PAGELIMIT
            }
        };
    } else {
        msg = {
            type,
            param: {
                count:PAGELIMIT
            }
        };
    }
   
    try {
        const res = await requestAsync(msg);
        const nextStart = res.start.toJSNumber ? res.start.toJSNumber() : res.start;
        const detail = parseRechargeWithdrawalLog(coin,res.value);
        const canLoadMore = detail.length >= PAGELIMIT;
        if (detail.length > 0) {
            const cloudWallets = getStore('cloud/cloudWallets');
            const cloudWallet = cloudWallets.get(CloudCurrencyType[coin]);
            if (start) {
                cloudWallet.rechargeLogs.list.push(...detail);
            } else {
                cloudWallet.rechargeLogs.list = detail;
            }
            cloudWallet.rechargeLogs.start = nextStart;
            cloudWallet.rechargeLogs.canLoadMore = canLoadMore;
            setStore('cloud/cloudWallets',cloudWallets);
        }
        
    } catch (err) {

        return;
    }
};

/**
 * 提现历史记录
 */
export const getWithdrawLogs = async (coin: string,start?) => {
    // tslint:disable-next-line:no-reserved-keywords
    let type;
    if (coin === 'BTC') {
        type = 'wallet/bank@btc_to_cash_log';
    } else if (coin === 'ETH') {
        type = 'wallet/bank@to_cash_log';
    } else {// KT
        return;
    }
    let msg;
    if (start) {
        msg = {
            type,
            param: {
                start,
                count:PAGELIMIT
            }
        };
    } else {
        msg = {
            type,
            param: {
                count:PAGELIMIT
            }
        };
    }
   
    try {
        const res = await requestAsync(msg);
        const nextStart = res.start.toJSNumber ? res.start.toJSNumber() : res.start;
        const detail = parseRechargeWithdrawalLog(coin,res.value);
        const canLoadMore = detail.length >= PAGELIMIT;
        if (detail.length > 0) {
            const cloudWallets = getStore('cloud/cloudWallets');
            const cloudWallet = cloudWallets.get(CloudCurrencyType[coin]);
            if (start) {
                cloudWallet.withdrawLogs.list.push(...detail);
            } else {
                cloudWallet.withdrawLogs.list = detail;
            }
            cloudWallet.withdrawLogs.start = nextStart;
            cloudWallet.withdrawLogs.canLoadMore = canLoadMore;
            setStore('cloud/cloudWallets',cloudWallets);
        }
        
    } catch (err) {

        return;
    }

};

/**
 * 获取服务端eth钱包地址
 */
export const getBankAddr = async () => {
    const msg = {
        type: 'wallet/bank@get_bank_addr',
        param: { }
    };

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {

        return;
    }
};

/**
 * 向服务器发起充值请求
 */
// tslint:disable-next-line:max-line-length
export const rechargeToServer = async (fromAddr:string,toAddr:string,tx:string,nonce:number,gas:number,value:string,coin:number= 101) => {
    const msg = {
        type: 'wallet/bank@pay',
        param: {
            from:fromAddr,
            to:toAddr,
            tx,
            nonce,
            gas,
            value,
            coin
        }
    };
    try {
        const res = await requestAsync(msg);
        console.log('rechargeToServer',res);
        
        return true;
    } catch (err) {

        return false;
    }

};

/**
 * 向服务器发起充值请求
 */
// tslint:disable-next-line:max-line-length
export const btcRechargeToServer = async (toAddr:string,tx:string,value:string,fees:number,oldHash:string) => {
    // tslint:disable-next-line:variable-name
    const old_tx = oldHash || 'none';
    const msg = {
        type: 'wallet/bank@btc_pay',
        param: {
            to:toAddr,
            tx,
            value,
            fees,
            old_tx
        }
    };
    try {
        const res = await requestAsync(msg);
        console.log('btcRechargeToServer',res);
        
        return true;
    } catch (err) {

        return false;
    }

};

/**
 * 提现
 */
export const withdrawFromServer = async (toAddr:string,value:string,secretHash:string) => {
    const msg = {
        type: 'wallet/bank@to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    try {
        const res = await requestAsyncNeedLogin(msg,secretHash);
        console.log('withdrawFromServer',res);

        return res.txid;
    } catch (err) {

        return;
    }
};

/**
 * btc提现
 */
export const btcWithdrawFromServer = async (toAddr:string,value:string,secretHash:string) => {
    const msg = {
        type: 'wallet/bank@btc_to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    try {
        const res = await requestAsyncNeedLogin(msg,secretHash);

        return res.txid;
    } catch (err) {

        return ;
    }
};

/**
 * 获取ST价格
 */
export const getSilverPrice = async (ispay:number = 0) => {
    const msg = { type:'get_silverprice',param:{ ispay } };
    try {
        const resData:any = await requestAsync(msg);
        if (resData.result === 1) {
            setStore('third/silver',{ price:resData.price,change:resData.change });
        }
    } catch (err) {
        // showError(err && (err.result || err.type));

    }
};

/**
 * 获取服务端btc钱包地址
 */
export const getBtcBankAddr = async () => {
    const msg = {
        type: 'wallet/bank@get_btc_bank_addr',
        param: { }
    };

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {

        return;
    }
};