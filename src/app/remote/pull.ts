/**
 * pull request
 */
import { MainChainCoin, PAGELIMIT } from '../publicLib/config';
import { CloudCurrencyType, MinerFeeLevel } from '../publicLib/interface';
import { unicodeArray2Str } from '../publicLib/tools';
import { kpt2kt, wei2Eth } from '../publicLib/unitTools';
import { getStore, setStore } from '../store/memstore';
// tslint:disable-next-line:max-line-length
import { parseCloudAccountDetail, parseCloudBalance, parseConvertLog, parseDividHistory, parseExchangeDetail, parseMineDetail, parseMiningHistory, parseMiningRank, parseMyInviteRedEnv, parseProductList, parsePurchaseRecord, parseRechargeWithdrawalLog, parseSendRedEnvLog, splitCloudCurrencyDetail } from './parse';

/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== 1) {
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};

// 获取真实用户
export const getRealUser = () => {
    const msg = {
        type: 'wallet/user@get_real_user',
        param: {}
    };

    return requestAsync(msg).then(res => {
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
export const getBindPhone = () => {
    const msg = { type: 'wallet/user@get_phone',param: {} };

    return requestAsync(msg).then(res => {
        const userInfo  = getStore('user/info');
        if (userInfo.phoneNumber !== res.phone || userInfo.areaCode !== res.num) {
            userInfo.phoneNumber =  res.phone;
            userInfo.areaCode = res.num;
            setStore('user/info',userInfo);
        }
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
    });
};

/**
 * 获取当前用户信息
 */
export const getUserInfoFromServer = (uids: [number]) => {
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
export const fetchGasPrices = () => {
    const msg = {
        type: 'wallet/bank@get_gas',
        param: {}
    };
    
    return requestAsync(msg).then(res => {
        const gasPrice = {
            [MinerFeeLevel.Standard]:Number(res.standard),
            [MinerFeeLevel.Fast]:Number(res.fast),
            [MinerFeeLevel.Fastest]:Number(res.fastest)
        };
        setStore('third/gasPrice',gasPrice);

        return gasPrice;
    });
        
};

/**
 * 获取gasPrice
 */
export const fetchBtcFees = () => {
    const msg = {
        type: 'wallet/bank@get_fees',
        param: {}
    };
    
    return requestAsync(msg).then(res => {
        const obj = JSON.parse(res.btc);
        const btcMinerFee = {
            [MinerFeeLevel.Standard]:Number(obj.low_fee_per_kb),
            [MinerFeeLevel.Fast]:Number(obj.medium_fee_per_kb),
            [MinerFeeLevel.Fastest]:Number(obj.high_fee_per_kb)
        };
        setStore('third/btcMinerFee',btcMinerFee);

        return btcMinerFee;
    });
    
};

/**
 * 设置用户基础信息
 */
export const setUserInfo = () => {
    const userInfo = getStore('user/info');
    const msg = { type: 'wallet/user@set_info', param: { value:JSON.stringify(userInfo) } };
    
    return requestAsync(msg);
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const getHighTop =  (num: number) => {
    const msg = { type: 'wallet/cloud@get_high_top', param: { num: num } };

    return requestAsync(msg).then(data => {
        console.log('获取全部排名========================',data);
        
        return parseMiningRank(data);
    });
    
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const getAccountDetail = (coin: string,filter:number,start = '') => {
    const param:any = {
        coin:CloudCurrencyType[coin],
        start,
        filter,
        count:PAGELIMIT
    };
    if (start) {
        param.start = start;
    } 
    const msg = {
        type: 'wallet/account@get_detail',
        param
    };

    return requestAsync(msg).then(res => {
        const nextStart = res.start;
        const detail = parseCloudAccountDetail(coin,res.value);
        const splitDetail = splitCloudCurrencyDetail(detail); 
        const canLoadMore = detail.length >= PAGELIMIT;
        if (detail.length > 0) {
            const cloudWallets = getStore('cloud/cloudWallets');
            const cloudWallet = cloudWallets.get(CloudCurrencyType[coin]);
            if (start) {
                cloudWallet.otherLogs.list.push(...detail);
                if (coin === CloudCurrencyType[CloudCurrencyType.SC] || coin === CloudCurrencyType[CloudCurrencyType.KT]) {
                    cloudWallet.rechargeLogs.list.push(...splitDetail.rechangeList);
                    cloudWallet.withdrawLogs.list.push(...splitDetail.withdrawList); 
                }
            } else {
                cloudWallet.otherLogs.list = detail;
                if (coin === CloudCurrencyType[CloudCurrencyType.SC] || coin === CloudCurrencyType[CloudCurrencyType.KT]) {
                    cloudWallet.rechargeLogs.list = splitDetail.rechangeList;
                    cloudWallet.withdrawLogs.list = splitDetail.withdrawList;
                }
            }
                    
            cloudWallet.otherLogs.start = nextStart;
            cloudWallet.otherLogs.canLoadMore = canLoadMore;
            setStore('cloud/cloudWallets',cloudWallets);

            return cloudWallets;
        }
    });
        
};

/**
 * 充值历史记录
 */
export const getRechargeLogs = (coin: string,start?) => {
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
   
    return requestAsync(msg).then(res => {
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

            return cloudWallets;
        }
    });
    
};

/**
 * 提现历史记录
 */
export const getWithdrawLogs =  (coin: string,start?) => {
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
   
    return requestAsync(msg).then(res => {
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

            return cloudWallets;
        }

    });
   
};

/**
 * 获取服务端eth钱包地址
 */
export const getBankAddr = () => {
    const msg = {
        type: 'wallet/bank@get_bank_addr',
        param: { }
    };

    return requestAsync(msg).then(res => {
        return res.value;
    });

};

/**
 * 向服务器发起充值请求
 */
// tslint:disable-next-line:max-line-length
export const rechargeToServer = (fromAddr:string,toAddr:string,tx:string,nonce:number,gas:number,value:string,coin:number= 101) => {
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

    return requestAsync(msg).then(res => {
        console.log('rechargeToServer',res);
        
        return true;
    });
        
};

/**
 * 向服务器发起充值请求
 */
// tslint:disable-next-line:max-line-length
export const btcRechargeToServer = (toAddr:string,tx:string,value:string,fees:number,oldHash:string) => {
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

    return requestAsync(msg).then(res => {
        console.log('btcRechargeToServer',res);
        
        return true;
    });
    
};

/**
 * 提现
 */
export const withdrawFromServer = (toAddr:string,value:string,secretHash:string) => {
    const msg = {
        type: 'wallet/bank@to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    return requestAsyncNeedLogin(msg,secretHash).then(res => {
        console.log('withdrawFromServer',res);

        return res.txid;
    });
        
};

/**
 * btc提现
 */
export const btcWithdrawFromServer = (toAddr:string,value:string,secretHash:string) => {
    const msg = {
        type: 'wallet/bank@btc_to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    return requestAsyncNeedLogin(msg,secretHash).then(res => {
        return res.txid;
    });
};

/**
 * 获取ST价格
 */
export const getSilverPrice = (ispay:number = 0) => {
    const msg = { type:'get_silverprice',param:{ ispay } };

    return requestAsync(msg).then(resData => {
        if (resData.result === 1) {
            setStore('third/silver',{ price:resData.price,change:resData.change });
        }

        return resData;
    });
    
};

/**
 * 获取服务端btc钱包地址
 */
export const getBtcBankAddr = () => {
    const msg = {
        type: 'wallet/bank@get_btc_bank_addr',
        param: { }
    };

    return requestAsync(msg).then(res => {
        return res.value;
    });

};

/**
 * 查询红包兑换记录
 */
export const queryConvertLog = (start?:string) => {
    let msg;
    if (start) {
        msg = {
            type: 'query_convert_log',
            param: {
                start,
                count: PAGELIMIT
            }
        };
    } else {
        msg = {
            type: 'query_convert_log',
            param: {
                count: PAGELIMIT
            }
        };
    }

    return requestAsync(msg).then(detail => {
        const data = parseConvertLog(detail,start);
        setStore('activity/luckyMoney/exchange',data);

        return data;
    });
};

/**
 * 获取分红历史记录
 */
export const getDividHistory = (start = '') => {
    const msg = { 
        type: 'wallet/cloud@get_bonus_info', 
        param: {
            start,
            count:PAGELIMIT
        } 
    };
    
    return requestAsync(msg).then(data => {
        const dividHistory = parseDividHistory(data);
        setStore('activity/dividend/history', dividHistory);

        return dividHistory;
    });
};

/**
 * 查询某个红包兑换详情
 */
export const queryDetailLog = (uid:number,rid: string,accId?:string) => {
    const msg = {
        type: 'query_detail_log',
        param: {}
    };
    if (accId) {  // 与聊天通用的账户id
        msg.param = {
            acc_id: accId,
            rid
        };
    } else {
        msg.param = {
            uid,
            rid
        };
    }
    if (rid === '-1') return;

    return requestAsync(msg).then(detail => {
        return parseExchangeDetail(detail.value);
    });
        
};

/**
 * 矿山增加记录
 */
export const getMineDetail = (start = '') => {
    const msg = { 
        type: 'wallet/cloud@grant_detail', 
        param: {
            start,
            count:PAGELIMIT
        } 
    };
    
    return requestAsync(msg).then(detail => {
        const list = parseMineDetail(detail);
        setStore('activity/mining/addMine', list);

        return list;
    });
};

/**
 * 获取挖矿历史记录
 */
export const getMiningHistory = (start = '') => {
    const msg = { 
        type: 'wallet/cloud@get_pool_detail', 
        param: {
            start,
            count:PAGELIMIT
        } 
    };
    requestAsync(msg).then(data => {
        const miningHistory = parseMiningHistory(data);
        setStore('activity/mining/history', miningHistory);

        return miningHistory;
    });
};

// 获取好友嗨豆排名
export const getFriendsKTTops =  (arr:any) => {
    const msg = { type:'wallet/cloud@finds_high_top',param:{ finds:JSON.stringify(arr) } };

    return  requestAsync(msg).then(data => {
        console.log('获取好友排名========================',data);

        return parseMiningRank(data);
    });
};

/**
 * 获取邀请码领取明细
 */
export const getInviteCodeDetail = () => {
    const msg = { type: 'wallet/cloud@get_invite_code_detail', param: {} };
    
    return requestAsync(msg).then(data => {
        return parseMyInviteRedEnv(data.value);
    });
};

/**
 * 获取理财列表
 */
export const getProductList = () => {
    const msg = {
        type: 'wallet/manage_money@get_product_list',
        param: {}
    };
    
    return requestAsync(msg).then(res => {
        const result = parseProductList(res);
        setStore('activity/financialManagement/products',result);
    
        return result;
    });
        
};

/**
 * 购买理财
 */
export const buyProduct = (pid:any,count:any,secretHash:string) => {
    pid = Number(pid);
    count = Number(count);
    const msg = {
        type: 'wallet/manage_money@buy',
        param: {
            pid,
            count
        }
        
    };
    
    return requestAsyncNeedLogin(msg,secretHash).then(res => {
        console.log('buyProduct',res);
        if (res.result === 1) {
            getProductList();
    
            return true;
        } else {
            return false;
        }
    });
};

/**
 * 理财购买记录
 */
export const getPurchaseRecord = (start = '') => {
    const msg = {
        type: 'wallet/manage_money@get_pay_list',
        param: {
            start,
            count:PAGELIMIT
        }
    };
    
    return requestAsync(msg).then(res => {
        console.log('getPurchaseRecord',res);
        const record = parsePurchaseRecord(res);
        setStore('activity/financialManagement/purchaseHistories',record);

        return record;
    });
    
};

/**
 * 查询发送红包记录
 */
export const querySendRedEnvelopeRecord = (start?: string) => {
    let msg;
    if (start) {
        msg = {
            type: 'query_emit_log',
            param: {
                start,
                count: PAGELIMIT
            }
        };
    } else {
        msg = {
            type: 'query_emit_log',
            param: {
                count: PAGELIMIT
            }
        };
    }

    return requestAsync(msg).then(detail => {
        const data = parseSendRedEnvLog(detail.value,start);
        setStore('activity/luckyMoney/sends',data);

        return data;
    });

};

/**
 * 获取后台发起分红历史记录
 */
export const getBonusHistory = () => {
    const msg = { type:'wallet/cloud@get_bonus_history',param:{} };

    return requestAsync(msg);
};

/**
 * 获取分红汇总信息
 */
export const getDividend = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_total', param: {} };
    const data = await getBonusHistory();
    const num = (data.value !== '') ? wei2Eth(data.value[0][1]) :0;
    const yearIncome = (num * 365 / 7).toFixed(4); 
    
    return requestAsync(msg).then(data => {
        const dividend: any = {
            totalDivid: wei2Eth(data.value[0]),
            totalDays: data.value[1],
            thisDivid: wei2Eth(data.value[2]),
            yearIncome: yearIncome
        };
        setStore('dividTotal', dividend);

        return dividend;
    });
};

/**
 * 获取挖矿汇总信息
 */
export const getMining = () => {
    const msg = { type: 'wallet/cloud@get_mine_total', param: {} };
    
    return requestAsync(msg).then(data => {
        
        const totalNum = kpt2kt(data.mine_total);
        const holdNum = kpt2kt(data.mines);
        const today = kpt2kt(data.today);
        let nowNum = Math.round((totalNum - holdNum + today) * 0.25) - today;  // 今日可挖数量为矿山剩余量的0.25减去今日已挖 再四舍五入取整
        if (nowNum <= 0) {
            nowNum = 0;  // 如果今日可挖小于等于0，表示现在不能挖
        } else if ((totalNum - holdNum) >= 100) {
            nowNum = (nowNum < 100 && (totalNum - holdNum) >= 100) ? 100 : nowNum;  // 如果今日可挖小于100，且矿山剩余量大于100，则今日可挖100
        } else {
            nowNum = totalNum - holdNum;  // 如果矿山剩余量小于100，则本次挖完所有剩余量
        }
        const mining: any = {
            totalNum: totalNum,
            thisNum: nowNum,
            holdNum: holdNum
        };
        console.log('-------------------',mining);
        setStore('activity/mining/total', mining);

        return mining;
    });
};

/**
 * 获取单个用户信息
 */
export const getOneUserInfo = (uids: number[], isOpenid?: number) => {
    let msg = {};
    if (isOpenid) {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]`, isOpenid } };
    } else {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };
    }

    return requestAsync(msg).then(res => {
        if (res.value[0]) {

            return JSON.parse(unicodeArray2Str(res.value[0]));
        }
    });
   
};

/**
 * 获取邀请码
 */
export const getInviteCode = () => {
    const msg = { type: 'wallet/cloud@get_invite_code', param: {} };

    return requestAsync(msg);
};
