/**
 * 主动向后端通讯
 */
import { request } from '../../pi/net/ui/con_mgr';
import { MainChainCoin, uploadFileUrl } from '../config';
import { getModulConfig } from '../modulConfig';
import {  CloudCurrencyType , MinerFeeLevel } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
// tslint:disable-next-line:max-line-length
import { parseCloudAccountDetail, parseCloudBalance, parseConvertLog, parseDividHistory, parseExchangeDetail, parseFriendsMiningRank,parseMineDetail,parseMineRank, parseMiningHistory, parseMiningRank, parseMyInviteRedEnv, parseProductList, parsePurchaseRecord, parseRechargeWithdrawalLog, parseSendRedEnvLog, splitCloudCurrencyDetail } from '../store/parse';
import { PAGELIMIT } from '../utils/constants';
import { showError } from '../utils/toolMessages';
import { base64ToFile, getUserInfo, popNewMessage, unicodeArray2Str } from '../utils/tools';
import { kpt2kt, largeUnit2SmallUnit, wei2Eth } from '../utils/unitTools';
import { defaultLogin } from './login';

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

/**
 * 通用的异步通信 需要登录
 * 
 * 需要登录权限的接口
 * emit_red_bag  发红包
 * to_cash       eth提现
 * btc_to_cash   btc提现
 * manage_money@buy    购买理财
 * manage_money@sell   出售理财
 */
export const requestAsyncNeedLogin = async (msg: any,secretHash:string) => {
    const isLogin = getStore('user/isLogin');
    if (!isLogin) {
        await defaultLogin(secretHash,getStore('user/conRandom'));
    }

    return requestAsync(msg);
    
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
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CloudCurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };
    requestAsync(msg).then(r => {
        // todo 这里更新余额
    });
};

/**
 * 获取分红汇总信息
 */
export const getDividend = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_total', param: {} };
    const data = await getBonusHistory();
    const num = (data.value !== '') ? wei2Eth(data.value[0][1]) :0;
    const yearIncome = (num * 365 / 7).toFixed(4); 
    
    requestAsync(msg).then(data => {
        const dividend: any = {
            totalDivid: wei2Eth(data.value[0]),
            totalDays: data.value[1],
            thisDivid: wei2Eth(data.value[2]),
            yearIncome: yearIncome
        };
        setStore('dividTotal', dividend);
    });
};

/**
 * 获取后台发起分红历史记录
 */
export const getBonusHistory = async() => {
    const msg = { type:'wallet/cloud@get_bonus_history',param:{} };

    return requestAsync(msg);
};

/**
 * 获取挖矿汇总信息
 */
export const getMining = async () => {
    const msg = { type: 'wallet/cloud@get_mine_total', param: {} };
    requestAsync(msg).then(data => {
        
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
    });
};

/**
 * 获取挖矿历史记录
 */
export const getMiningHistory = async (start = '') => {
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
    });
};

// ==========================================红包start
/**
 * 获取邀请码码
 */
export const getInviteCode = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code', param: {} };

    return requestAsync(msg);
};

/**
 * 兑换邀请码
 */
export const inputInviteCdKey = async (code) => {
    const msg = { type: 'wallet/cloud@input_cd_key', param: { code: code } };
    try {
        await requestAsync(msg);

        return [];
    } catch (err) {
        console.log('input_cd_key--------',err);
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 获取邀请码领取明细
 */
export const getInviteCodeDetail = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code_detail', param: {} };
    const data = await requestAsync(msg);

    return parseMyInviteRedEnv(data.value);
};

/**
 * 发送红包
 * @param rtype 红包类型
 * @param ctype 货币类型
 * @param totalAmount 总金额
 * @param count 红包数量
 * @param lm 留言
 */
// tslint:disable-next-line:max-line-length
export const  sendRedEnvlope = async (rtype: string, ctype: number, totalAmount: number, redEnvelopeNumber: number, lm: string,secretHash:string) => {
    const msg = {
        type: 'emit_red_bag',
        param: {
            type: Number(rtype),
            priceType: ctype,
            totalPrice: largeUnit2SmallUnit(CloudCurrencyType[ctype], totalAmount),
            count: redEnvelopeNumber,
            desc: lm
        }
    };

    try {
        const res = await requestAsyncNeedLogin(msg,secretHash);

        return res.value;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }

};
/**
 * 领取红包 获取兑换码
 */
export const takeRedBag = async (rid) => {
    const msg = { type: 'take_red_bag', param: { rid: rid } };
    
    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const res = await requestAsync(msg);

        return res;
    } catch (err) {
        showError(err && (err.result || err.type));
        
        return err;
    }
};

/**
 * 兑换码兑换红包
 */
export const convertRedBag = async (cid) => {
    const msg = { type: 'convert_red_bag', param: { cid: cid } };

    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const res = await requestAsync(msg);

        return res;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 获取红包留言
 * @param cid 兑换码
 */
export const queryRedBagDesc = async (cid: string) => {
    const msg = {
        type: 'query_red_bag_desc',
        param: {
            cid
        }
    };

    return requestAsync(msg);
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

    try {
        requestAsync(msg).then(async detail => {
            const data = parseSendRedEnvLog(detail.value,start);
            setStore('activity/luckyMoney/sends',data);
        });

    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 查询红包兑换记录
 */
export const queryConvertLog = async (start?:string) => {
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

    try {
        requestAsync(msg).then(detail => {
            const data = parseConvertLog(detail,start);
            setStore('activity/luckyMoney/exchange',data);
        });

    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 查询某个红包兑换详情
 */
export const queryDetailLog = async (uid:number,rid: string,accId?:string) => {
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

    try {
        const detail = await requestAsync(msg);
        
        return parseExchangeDetail(detail.value);
        
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};
// ==========================================红包end

/**
 * 挖矿
 */
export const getAward = async () => {
    const msg = { type: 'wallet/cloud@get_award', param: {} };

    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const detail = await requestAsync(msg);
        
        return detail;
        
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 矿山增加记录
 */
export const getMineDetail = async (start = '') => {
    const msg = { 
        type: 'wallet/cloud@grant_detail', 
        param: {
            start,
            count:PAGELIMIT
        } 
    };
    requestAsync(msg).then(detail => {
        const list = parseMineDetail(detail);
        setStore('activity/mining/addMine', list);
    });
};

/**
 * 获取分红历史记录
 */
export const getDividHistory = async (start = '') => {
    const msg = { 
        type: 'wallet/cloud@get_bonus_info', 
        param: {
            start,
            count:PAGELIMIT
        } 
    };
    requestAsync(msg).then(data => {
        const dividHistory = parseDividHistory(data);
        setStore('activity/dividend/history', dividHistory);
    });
};

/**
 * 设置客户端数据
 */
export const setData = async (param) => {
    const msg = { type: 'wallet/data@set', param: param };

    return requestAsync(msg);
};

/**
 * 获取客户端数据
 */
export const getData = async (key) => {
    const msg = { type: 'wallet/data@get', param: { key } };

    return requestAsync(msg);
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
 * 获取当前用户信息
 */
export const getUserInfoFromServer = async (uids: [number]) => {
    const msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };

    return requestAsync(msg).then(res => {
        const userInfoStr = unicodeArray2Str(res.value[0]);
        const localUserInfo = getStore('user/info');
        console.log('localUserInfo ==== ',localUserInfo);
        let userInfo = {
            ...localUserInfo
        };
        if (userInfoStr) {
            const serverUserInfo = JSON.parse(userInfoStr);
            console.log('serverUserInfo ==== ',serverUserInfo);
            userInfo = {
                ...userInfo,
                ...serverUserInfo
            };
            console.log('userInfo ==== ',userInfo);
        } 
        setStore('user/info',userInfo);
    });
        
};

/**
 * 获取单个用户信息
 */
export const getOneUserInfo = async (uids: number[], isOpenid?: number) => {
    let msg = {};
    if (isOpenid) {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]`, isOpenid } };
    } else {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };
    }

    try {
        const res = await requestAsync(msg);
        if (res.value[0]) {

            return JSON.parse(unicodeArray2Str(res.value[0]));
        }
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 批量获取用户信息
 */
export const getUserList = async (uids: number[], isOpenid?: number) => {
    let msg = {};
    if (isOpenid) {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]`, isOpenid } };
    } else {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };
    }

    try {
        const res = await requestAsync(msg);
        if (res.value[0]) {
            const resAry = [];
            for (const element of res.value) {
                resAry.push(JSON.parse(unicodeArray2Str(element)));
            }

            return resAry;
        }
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 处理聊天
 */
export const doChat = async () => {
    const msg = { type: 'wallet/cloud@chat', param: {} };

    requestAsync(msg).then(r => {
        // 通信成功
    });
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const getAccountDetail = async (coin: string,filter:number,start = '') => {
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
    try {
        const res = await requestAsync(msg);
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
        }
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }

};

// /**
//  * 获取矿山排名列表
//  */
// export const getMineRank = async (num: number) => {
//     const msg = { type: 'wallet/cloud@mine_top', param: { num: num } };
//     requestAsync(msg).then(data => {
//         const mineData = parseMineRank(data);
//         setStore('activity/mining/mineRank', mineData);
//     });
// };

// /**
//  * 获取挖矿排名列表
//  */
// export const getMiningRank = async (num: number) => {
//     const msg = { type: 'wallet/cloud@get_mine_top', param: { num: num } };
//     requestAsync(msg).then(data => {
//         const miningData = parseMiningRank(data);
//         setStore('activity/mining/miningRank', miningData);
//     });
// };

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

// 获取好友嗨豆排名
export const getFriendsKTTops =  (arr:any) => {
    const msg = { type:'wallet/cloud@finds_high_top',param:{ finds:JSON.stringify(arr) } };

    return  requestAsync(msg).then(data => {
        console.log('获取好友排名========================',data);

        return parseMiningRank(data);
    });
};
/**
 * 验证手机号是否被注册
 */
export const verifyPhone = async (phone:string,num: string) => {
    const msg = { type: 'wallet/user@check_phone', param: { phone,num } };
    try {
        await requestAsync(msg); 

        return false;
    } catch (err) {
        if (err.result === 1005) return true;

        return false; 
    }
};

/**
 * 发送验证码
 */
export const sendCode = async (phone: string, num: string,verify:boolean = true) => {
    if (verify) {
        const v = await verifyPhone(phone,num);
        if (!v) {
            return;
        }
    }
    const msg = { type: 'wallet/sms@send_sms_code', param: { phone, num, name: getModulConfig('WALLET_NAME') } };
    try {
        return await requestAsync(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 注册手机
 */
export const regPhone = async (phone: string, num:string, code: string) => {
    const bphone = getUserInfo().phoneNumber;
    const areaCode = getUserInfo().areaCode;
    // tslint:disable-next-line:variable-name
    const old_phone =  bphone ? bphone :'';
    // tslint:disable-next-line:variable-name
    const  old_num = areaCode ? areaCode : '';
    const msg = { type: 'wallet/user@reg_phone', param: { phone, old_phone, code,num,old_num } };
    
    try {
        return await requestAsync(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 验证旧手机
 */
export const checkPhoneCode = async (phone: string, code: string,cmd?:string) => {
    const param:any = { phone, code };
    if (cmd) {
        param.cmd = cmd;
    }
    const msg = { type: 'wallet/user@check_phoneCode', param };
    try {
        return await requestAsync(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 解绑手机
 */
export const unbindPhone = async (phone: string, code: string,num:string) => {
    const param:any = { phone, code,num };
    const msg = { type: 'wallet/user@unset_phone', param };
    try {
        return await requestAsync(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 获取绑定的手机号
 */
export const getBindPhone = async () => {
    const msg = { type: 'wallet/user@get_phone',param: {} };

    return  requestAsync(msg).then(res => {
        const userInfo  = getStore('user/info');
        userInfo.phoneNumber =  res.phone;
        userInfo.areaCode = res.num;
        setStore('user/info',userInfo);
    }).catch(err => {
        // console.log(err);
    });
};

/**
 * 获取代理
 */
export const getProxy = async () => {
    const msg = { type: 'wallet/proxy@get_proxy', param: {} };

    return requestAsync(msg);
};

// ===============================充值提现
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
        showError(err && (err.result || err.type));

        return;
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
        showError(err && (err.result || err.type));

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
        showError(err && (err.result || err.type));

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
        showError(err && (err.result || err.type));

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
        showError(err && (err.result || err.type));

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
        showError(err && (err.result || err.type));

        return ;
    }
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
        showError(err && (err.result || err.type));

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
        showError(err && (err.result || err.type));

        return;
    }

};

/**
 * 获取理财列表
 */
export const getProductList = async () => {
    const msg = {
        type: 'wallet/manage_money@get_product_list',
        param: {}
    };
    
    try {
        const res = await requestAsync(msg);
        const result = parseProductList(res);
        setStore('activity/financialManagement/products',result);

        return result;
    } catch (err) {
        showError(err && (err.result || err.type));

        return [];
    }
};

/**
 * 购买理财
 */
export const buyProduct = async (pid:any,count:any,secretHash:string) => {
    pid = Number(pid);
    count = Number(count);
    const msg = {
        type: 'wallet/manage_money@buy',
        param: {
            pid,
            count
        }
        
    };
    
    try {
        const res = await requestAsyncNeedLogin(msg,secretHash);
        console.log('buyProduct',res);
        if (res.result === 1) {
            getProductList();

            return true;
        } else {
            return false;
        }
    } catch (err) {
        showError(err && (err.result || err.type));
        
        return false;
    }
};

/**
 * 理财购买记录
 */
export const getPurchaseRecord = async (start = '') => {
    const msg = {
        type: 'wallet/manage_money@get_pay_list',
        param: {
            start,
            count:PAGELIMIT
        }
    };
    
    try {
        const res = await requestAsync(msg);
        console.log('getPurchaseRecord',res);
        const record = parsePurchaseRecord(res);
        setStore('activity/financialManagement/purchaseHistories',record);

    } catch (err) {
        showError(err && (err.result || err.type));
    }
};
/**
 * 赎回理财产品
 */
export const buyBack = async (timeStamp:any,secretHash:string) => {
    const msg = {
        type: 'wallet/manage_money@sell',
        param: {
            time:timeStamp
        }
    };
    
    try {
        const res = await requestAsyncNeedLogin(msg,secretHash);
        console.log('buyBack',res);

        return true;
    } catch (err) {
        showError(err && (err.result || err.type));

        return false;
    }
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
        showError(err && (err.result || err.type));

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
        showError(err && (err.result || err.type));
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

// 上传文件
export const uploadFile = async (base64) => {
    const file = base64ToFile(base64);
    const formData = new FormData();
    formData.append('upload',file);
    fetch(`${uploadFileUrl}`, {
        body: formData, // must match 'Content-Type' header
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'include',
        // headers: {
        //     'user-agent': 'Mozilla/4.0 MDN Example'
        // },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors' // no-cors, cors, *same-origin
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer' // *client, no-referrer
    }).then(response => response.json())
        .then(res => {
            console.log('uploadFile success ',res);
            popNewMessage('图片上传成功');
            if (res.result === 1) {
                const sid = res.sid;
                const userInfo = getStore('user/info');
                userInfo.avatar = sid;
                setStore('user/info',userInfo);
            }
        }).catch(err => {
            console.log('uploadFile fail ',err);
            popNewMessage('图片上传失败');
        });
};

/**
 * 上次文件
 */
export const uploadFile1 = async (file:File) => {
    const formData = new FormData();
    formData.append('upload',file);
    fetch(`${uploadFileUrl}?$forceServer=1`, {
        body: formData, // must match 'Content-Type' header
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, same-origin, *omit
        // headers: {
        //     'user-agent': 'Mozilla/4.0 MDN Example'
        // },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors' // no-cors, cors, *same-origin
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer' // *client, no-referrer
    }).then(response => response.json())
        .then(res => {
            console.log('uploadFile success ',res);
            popNewMessage('图片上传成功');
            if (res.result === 1) {
                const sid = res.sid;
                const userInfo = getStore('user/info');
                userInfo.avatar = sid;
                setStore('user/info',userInfo);
            }
        }).catch(err => {
            console.log('uploadFile fail ',err);
            popNewMessage('图片上传失败');
        });
};

/**
 * changelly 签名
 */
export const changellySign = (data:any) => {
    const msg = {
        type: 'wallet/proxy@sign',
        param: {
            body:JSON.stringify(data)
        }
    };

    return requestAsync(msg);
};

/**
 * 获取邀请好友accId
 */
export const getInviteUserAccIds = () => {
    const msg = {
        type: 'wallet/cloud@get_invites',
        param: {}
    };

    return requestAsync(msg);
};