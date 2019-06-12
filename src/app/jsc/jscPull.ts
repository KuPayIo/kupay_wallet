import { MainChainCoin } from '../config';
import { CloudCurrencyType, MinerFeeLevel } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
import { parseCloudBalance } from '../store/parse';
import { requestAsync } from './jscLogin';
import { unicodeArray2Str } from './jscTools';

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