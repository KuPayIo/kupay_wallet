/**
 * 主动向后端通讯
 */
import { getStoreData, requestAsyncRpc, setStoreData } from '../api/walletApi';
import { getModulConfig, PAGELIMIT, uploadFileUrl } from '../public/config';
import { CloudCurrencyType } from '../public/interface';
import { getStore, setStore } from '../store/memstore';
// tslint:disable-next-line:max-line-length
import { parseCloudAccountDetail, parseCloudBalance, parseConvertLog, parseDividHistory, parseExchangeDetail, parseMiningRank, parseMyInviteRedEnv, parseSendRedEnvLog, splitCloudCurrencyDetail } from '../utils/parse';
import { base64ToFile, getUserInfo, piFetch, popNewMessage, unicodeArray2Str } from '../utils/pureUtils';
import { showError } from '../utils/toolMessages';
import { kpt2kt, largeUnit2SmallUnit } from '../utils/unitTools';

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CloudCurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };
    requestAsyncRpc(msg).then(r => {
        // todo 这里更新余额
    });
};

// ==========================================红包start

/**
 * 兑换邀请码
 */
export const inputInviteCdKey = async (code) => {
    const msg = { type: 'wallet/cloud@input_cd_key', param: { code: code } };
    try {
        const res = await requestAsyncRpc(msg);

        return [res.fuid];
    } catch (err) {
        console.log('input_cd_key--------',err);
        showError(err && (err.result || err.type));

        return;
    }
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
    debugger;
    try {
        const res = await requestAsyncRpc(msg);
        debugger;
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
        const res = await requestAsyncRpc(msg);

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
        const res = await requestAsyncRpc(msg);

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

    return requestAsyncRpc(msg);
};

// ==========================================红包end

/**
 * 挖矿
 */
export const getAward = async () => {
    const msg = { type: 'wallet/cloud@get_award', param: {} };

    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const detail = await requestAsyncRpc(msg);
        
        return detail;
        
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 设置客户端数据
 */
export const setData = async (param) => {
    const msg = { type: 'wallet/data@set', param: param };

    return requestAsyncRpc(msg);
};

/**
 * 获取客户端数据
 */
export const getData = async (key) => {
    const msg = { type: 'wallet/data@get', param: { key } };

    return requestAsyncRpc(msg);
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
        const res = await requestAsyncRpc(msg);
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

    requestAsyncRpc(msg).then(r => {
        // 通信成功
    });
};

/**
 * 发送验证码
 */
export const sendCode = async (phone: string, num: string,verify:boolean = true) => {
    const msg = { type: 'wallet/sms@send_sms_code', param: { phone, num, name: getModulConfig('WALLET_NAME') } };
    try {
        return await requestAsyncRpc(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 注册手机
 */
export const regPhone = async (phone: string, num:number, code: string) => {
    const msg = { type: 'wallet/user@bind_user', param: { userType:1, user:phone, pwd:code,cmd:num } };
    
    try {
        return await requestAsyncRpc(msg);
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
        return await requestAsyncRpc(msg);
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
        return await requestAsyncRpc(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 获取代理
 */
export const getProxy = async () => {
    const msg = { type: 'wallet/proxy@get_proxy', param: {} };

    return requestAsyncRpc(msg);
};

// ===============================充值提现

// 上传文件
export const uploadFile = async (base64) => {
    const file = base64ToFile(base64);
    const formData = new FormData();
    formData.append('upload',file);
    piFetch(`${uploadFileUrl}`, {
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
    }).then(async res => {
        console.log('uploadFile success ',res);
        popNewMessage('图片上传成功');
        if (res.result === 1) {
            const sid = res.sid;
            const userInfo = await getStoreData('user/info');
            userInfo.avatar = sid;
            setStoreData('user/info',userInfo);
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

    return requestAsyncRpc(msg);
};

/**
 * 获取邀请好友accId
 */
export const getInviteUserAccIds = () => {
    const msg = {
        type: 'wallet/cloud@get_invites',
        param: {}
    };

    return requestAsyncRpc(msg);
};

/**
 * 获取iOS支付的商品信息
 */
export const getAppleGoods = () => {
    const msg = {
        type: 'get_apple_goods',
        param: {}
    };

    return requestAsyncRpc(msg);
};

/**
 * 获取用户最近玩的游戏
 */
export const getUserRecentGame = (accid:number,count:number) => {
    const msg = {
        type:'wallet/oAuth@get_recent_login',
        param:{
            acc_id:accid,
            count
        }
    };

    return requestAsyncRpc(msg).then(r => {
        if (r.list) {
            const list = [];
            r.list.forEach(v => {  // appid
                list.push([]);
            });

            return list;
        }
    });
};

// 获取真实用户
export const getRealUser = () => {
    const msg = {
        type: 'wallet/user@get_real_user',
        param: {}
    };

    return requestAsyncRpc(msg).then(res => {
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

    return requestAsyncRpc(msg).then(res => {
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
    const msg = { type: 'wallet/account@get', param: { list:`[${list}]` } };
    
    return requestAsyncRpc(msg).then(balanceInfo => {
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

    return requestAsyncRpc(msg).then(res => {
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
 * 设置用户基础信息
 */
export const setUserInfo = () => {
    const userInfo = getStore('user/info');
    const msg = { type: 'wallet/user@set_info', param: { value:JSON.stringify(userInfo) } };
    
    return requestAsyncRpc(msg);
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const getHighTop =  (num: number) => {
    const msg = { type: 'wallet/cloud@get_high_top', param: { num: num } };

    return requestAsyncRpc(msg).then(data => {
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

    return requestAsyncRpc(msg).then(res => {
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
 * 获取ST价格
 */
export const getSilverPrice = (ispay:number = 0) => {
    const msg = { type:'get_silverprice',param:{ ispay } };

    return requestAsyncRpc(msg).then(resData => {
        if (resData.result === 1) {
            setStore('third/silver',{ price:resData.price,change:resData.change });
        }

        return resData;
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

    return requestAsyncRpc(msg).then(detail => {
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
    
    return requestAsyncRpc(msg).then(data => {
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

    return requestAsyncRpc(msg).then(detail => {
        return parseExchangeDetail(detail.value);
    });
        
};

// 获取好友嗨豆排名
export const getFriendsKTTops =  (arr:any) => {
    const msg = { type:'wallet/cloud@finds_high_top',param:{ finds:JSON.stringify(arr) } };

    return  requestAsyncRpc(msg).then(data => {
        console.log('获取好友排名========================',data);

        return parseMiningRank(data);
    });
};

/**
 * 获取邀请码领取明细
 */
export const getInviteCodeDetail = () => {
    const msg = { type: 'wallet/cloud@get_invite_code_detail', param: {} };
    
    return requestAsyncRpc(msg).then(data => {
        return parseMyInviteRedEnv(data.value);
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

    return requestAsyncRpc(msg).then(detail => {
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

    return requestAsyncRpc(msg);
};

/**
 * 获取分红汇总信息
 */
export const getDividend = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_total', param: {} };
    const data = await getBonusHistory();
    // TODO 这里进行单位转换
    const num = (data.value !== '') ? data.value[0][1] : 0;
    const yearIncome = (num * 365 / 7).toFixed(4); 
    
    return requestAsyncRpc(msg).then(data => {
        const dividend: any = {
            totalDivid: data.value[0],
            totalDays: data.value[1],
            thisDivid: data.value[2],
            yearIncome: yearIncome
        };
        setStore('dividTotal', dividend);

        return dividend;
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

    return requestAsyncRpc(msg).then(res => {
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

    return requestAsyncRpc(msg);
};

/**
 * 获取挖矿汇总信息
 */
export const getMining = () => {
    const msg = { type: 'wallet/cloud@get_mine_total', param: {} };
    
    return requestAsyncRpc(msg).then(data => {
        
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