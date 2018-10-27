/**
 * 主动向后端通讯
 */
import { open, request, setUrl, randomLogin, setBottomLayerReloginMsg, getSeverTime } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { MainChainCoin } from '../config';
import { CurrencyType, CurrencyTypeReverse, LoginState, MinerFeeLevel } from '../store/interface';
// tslint:disable-next-line:max-line-length
import { parseCloudAccountDetail, parseCloudBalance, parseConvertLog, parseDividHistory, parseExchangeDetail, parseMineDetail,parseMineRank,parseMiningHistory, parseMiningRank, parseMyInviteRedEnv, parseProductList, parsePurchaseRecord, parseRechargeWithdrawalLog, parseSendRedEnvLog } from '../store/parse';
import { find, getBorn, updateStore } from '../store/store';
import { CMD, PAGELIMIT } from '../utils/constants';
import { showError } from '../utils/toolMessages';
// tslint:disable-next-line:max-line-length
import { base64ToFile, decrypt, encrypt, fetchDeviceId, getFirstEthAddr, getStaticLanguage, unicodeArray2Str, popNewMessage, checkCreateAccount, getUserInfo } from '../utils/tools';
import { kpt2kt, largeUnit2SmallUnit, wei2Eth } from '../utils/unitTools';

// export const conIp = '47.106.176.185';
declare var pi_modules: any;
export const conIp = pi_modules.store.exports.severIp || '127.0.0.1';

// export const conPort = '8080';
export const conPort = pi_modules.store.exports.severPort || '80';
console.log('conIp=',conIp);
console.log('conPort=',conPort);

export const thirdUrlPre = `http://${conIp}:${conPort}/data/proxy?`;
// 分享链接前缀
// export const sharePerUrl = `http://share.kupay.io/wallet/app/boot/share.html`;
export const sharePerUrl = `http://${conIp}:${conPort}/wallet/phoneRedEnvelope/openRedEnvelope.html`;

// 分享下载链接
export const shareDownload = `http://${conIp}:${conPort}/wallet/phoneRedEnvelope/download.html`;

// 上传图片url
export const uploadFileUrl = `http://${conIp}:${conPort}/service/upload`;

// 上传的文件url前缀
export const uploadFileUrlPrefix = `http://${conIp}:${conPort}/service/get_file?sid=`;

//websock连接url
const wsUrl = `ws://${conIp}:2081`;
/**
 * 通用的异步通信
 */
export const requestAsync = async (msg: any): Promise<any> => {
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
 * 申请自动登录token
 */
export const applyAutoLogin = () => {
    const msg = { 
        type: 'wallet/user@set_auto_login', 
        param: { 
            device_id: fetchDeviceId()
        }
    };
    requestAsync(msg).then(res => {
        const deviceId = fetchDeviceId();
        const decryptToken = encrypt(res.token,deviceId);
        const tokenMap = getBorn('tokenMap');
        tokenMap.set(getFirstEthAddr(),decryptToken);
        updateStore('tokenMap',tokenMap);
    });
};

/**
 * 自动登录
 */
export const autoLogin = (serverTimestamp:number) => {
    const deviceId = fetchDeviceId();
    const token = decrypt(getBorn('tokenMap').get(getFirstEthAddr()),deviceId);
    const msg = { 
        type: 'wallet/user@auto_login', 
        param: { 
            device_id: deviceId,
            timestamp:serverTimestamp,
            token,
            random:find('conRandom')
        }
    };
    updateStore('loginState', LoginState.logining);
    requestAsync(msg).then(res => {
        updateStore('loginState', LoginState.logined);
        console.log('自动登录成功-----------',res);
    }).catch(() => {
        updateStore('loginState', LoginState.logerror);
    });
};
/**
 * 创建钱包后默认登录
 * @param mnemonic 助记词
 */
export const defaultLogin = async (hash:string) => {
    const getMnemonicByHash = pi_modules.commonjs.exports.relativeGet('app/utils/walletTools').exports.getMnemonicByHash;
    const mnemonic = getMnemonicByHash(hash);
    const GlobalWallet = pi_modules.commonjs.exports.relativeGet('app/core/globalWallet').exports.GlobalWallet;
    const wlt = GlobalWallet.createWltByMnemonic(mnemonic,'ETH',0);
    console.log('================',wlt.exportPrivateKey());
    const sign = pi_modules.commonjs.exports.relativeGet('app/core/genmnemonic').exports.sign;
    const signStr = sign(find('conRandom'), wlt.exportPrivateKey());
    const msgLogin = { type: 'login', param: { sign: signStr } };
    updateStore('loginState', LoginState.logining);
    const res: any = await requestAsync(msgLogin);
    if (res.result === 1) {
        updateStore('loginState', LoginState.logined);
    } else {
        updateStore('loginState', LoginState.logerror);
    }
};



// const defaultConUser = '0x00000000000000000000000000000000000000000';
/**
 * 开启连接
 */
export const openConnect = async () => {
    setUrl(wsUrl);
    open(conSuccess,conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = () =>{
    const conState = find('conState');
    console.log('ws con success',conState);
    getRandom();
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    const conState = find('conState');
    console.log(`ws con error ${conState}`,err);
    checkCreateAccount();
}

/**
 * 连接关闭回调
 */
const conClose = () => {
    const conState = find('conState');
    console.log('ws con close',conState);
    popNewMessage('连接已断开')
};

/**
 * 重新连接回调
 */
const conReOpen = ()=> {
    const conState = find('conState');
    console.log('ws con reOpen',conState);
}

/**
 * 获取随机数
 */
export const getRandom = async (cmd?:number) => {
    const wallet = find('curWallet');
    if (!wallet) return;
    const gwlt = JSON.parse(wallet.gwlt);
    updateStore('conUser', wallet.walletId);
    updateStore('conUserPublicKey', gwlt.publicKey);
    const client = 'android 20';
    const param:any = {
        account: find('conUser').slice(2), 
        pk: `04${find('conUserPublicKey')}`,
        client:JSON.stringify(client)
    };
    if (cmd) {
        param.cmd = cmd;
    }
    const msg = { 
        type: 'get_random', 
        param
    };
    try {
        const resp = await requestAsync(msg);
        updateStore('conRandom', resp.rand);
        updateStore('conUid', resp.uid);
        afterGetRandomAction(resp.timestamp.value);
        setBottomLayerReloginMsg(resp.user,resp.userType,resp.password);
    } catch (resp) {
        if (resp.type === 1014) {
            popNew('app-components1-modalBoxCheckBox-modalBoxCheckBox',{ 
                title:'检测到在其它设备有登录',
                content:'清除其它设备账户信息' 
            },(deleteAccount:boolean) => {
                if (deleteAccount) {
                    getRandom(CMD.FORCELOGOUTDEL);
                } else {
                    getRandom(CMD.FORCELOGOUT);
                }
                checkCreateAccount();
            },() => {
                getRandom(CMD.FORCELOGOUT);
                checkCreateAccount();
            });
        }
        return;
    }
    checkCreateAccount();
};

const afterGetRandomAction = (serverTimestamp:number) => {
    // eth gasPrice
    fetchGasPrices();
    // btc fees
    fetchBtcFees();

    const hash = getBorn('hashMap').get(getFirstEthAddr());
    if (hash) {
        defaultLogin(hash);
    }

    if (getBorn('tokenMap').get(getFirstEthAddr())) {
        autoLogin(serverTimestamp);
    }
}

// 底层登录成功回调
const bottomLayerLoginCB = (res) => {
    console.log('bottomLayerLoginCB',res);
};
/**
 * 获取所有的货币余额
 */
export const getCloudBalance = () => {
    const list = [];
    list.push(CurrencyType.KT);
    for (const k in CurrencyType) {
        if (MainChainCoin.hasOwnProperty(k)) {
            list.push(CurrencyType[k]);
        }
    }
    const msg = { type: 'wallet/account@get', param: { list:`[${list}]` } };
    
    return requestAsync(msg).then(balanceInfo => {
        console.log('balanceInfo', balanceInfo);
        updateStore('cloudBalance', parseCloudBalance(balanceInfo));
    }).catch((res) => {
        updateStore('cloudBalance', parseCloudBalance(null));
    });
};

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CurrencyType) => {
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
        updateStore('dividTotal', dividend);
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
        let nowNum = (totalNum - holdNum + today) * 0.25 - today;  // 今日可挖数量为矿山剩余量的0.25减去今日已挖
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
        updateStore('miningTotal', mining);
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
        updateStore('miningHistory', miningHistory);
    });
};

// ==========================================红包start
/**
 * 获取邀请红包码
 */
export const getInviteCode = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code', param: {} };

    return requestAsync(msg);
};

/**
 * 兑换邀请红包
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
 * 获取邀请红包领取明细
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
export const  sendRedEnvlope = async (rtype: number, ctype: number, totalAmount: number, redEnvelopeNumber: number, lm: string) => {
    const msg = {
        type: 'emit_red_bag',
        param: {
            type: rtype,
            priceType: ctype,
            totalPrice: largeUnit2SmallUnit(CurrencyTypeReverse[ctype], totalAmount),
            count: redEnvelopeNumber,
            desc: lm
        }
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
 * 兑换红包
 */
export const convertRedBag = async (cid) => {
    const msg = { type: 'convert_red_bag', param: { cid: cid } };

    try {
        const res = await requestAsync(msg);

        return res.value;
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
            updateStore('sHisRec',data);
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
            updateStore('cHisRec',data);
        });

    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 查询某个红包兑换详情
 */
export const queryDetailLog = async (uid:number,rid: string) => {
    const msg = {
        type: 'query_detail_log',
        param: {
            uid,
            rid
        }
    };
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

    return requestAsync(msg);
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
        updateStore('addMine', list);
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
        updateStore('dividHistory', dividHistory);
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
    if (find('loginState') !== LoginState.logined) return;
    const userInfo = find('userInfo');
    const msg = { type: 'wallet/user@set_info', param: { value:JSON.stringify(userInfo) } };
    
    return requestAsync(msg);
};

/**
 * 获取当前用户信息
 */
export const getUserInfoFromServer = async (uids: [number]) => {
    const msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };

    try {
        const res = await requestAsync(msg);
        const userInfoStr = unicodeArray2Str(res.value[0]);
        if (userInfoStr) {
            const localUserInfo = find('userInfo');
            const serverUserInfo = JSON.parse(userInfoStr);
            const userInfo = {
                ...localUserInfo,
                ...serverUserInfo
            };
            console.log(userInfo);
            updateStore('userInfo',userInfo);
        }
        
    } catch (err) {
        console.log(err);
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 批量获取用户信息
 */
export const getUserList = async(uids:number[]) => {
    const msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };

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
    let msg;
    if (start) {
        msg = {
            type: 'wallet/account@get_detail',
            param: {
                coin:CurrencyType[coin],
                start,
                filter,
                count:PAGELIMIT
            }
        };
    } else {
        msg = {
            type: 'wallet/account@get_detail',
            param: {
                coin:CurrencyType[coin],
                filter,
                count:PAGELIMIT
            }
        };
    }
   
    try {
        const res = await requestAsync(msg);
        const nextStart = res.start;
        const detail = parseCloudAccountDetail(coin,res.value);
        const canLoadMore = detail.length >= PAGELIMIT;
        if (filter === 1) {
            const accountDetailMap = getBorn('accountDetail');
            const accountDetail = accountDetailMap.get(CurrencyType[coin]) || { list:[] };
            if (!start) {
                accountDetail.list = detail;
            } else {
                accountDetail.list.push(...detail);
            }
        
            accountDetail.start = nextStart;
            accountDetail.canLoadMore = canLoadMore;
            accountDetailMap.set(CurrencyType[coin],accountDetail);
            updateStore('accountDetail',accountDetailMap);
        } else {
            const totalLogMap = getBorn('totalLogs');
            const totalLogs = totalLogMap.get(CurrencyType[coin]) || { list:[] };
            if (!start) {
                totalLogs.list = detail;
            } else {
                totalLogs.list.push(...detail);
            }
        
            totalLogs.start = nextStart;
            totalLogs.canLoadMore = canLoadMore;
            totalLogMap.set(CurrencyType[coin],totalLogs);
            updateStore('totalLogs',totalLogMap);
        }

    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }

};

/**
 * 获取矿山排名列表
 */
export const getMineRank = async (num: number) => {
    const msg = { type: 'wallet/cloud@mine_top', param: { num: num } };
    requestAsync(msg).then(data => {
        const mineData = parseMineRank(data);
        updateStore('mineRank', mineData);
    });
};

/**
 * 获取挖矿排名列表
 */
export const getMiningRank = async (num: number) => {
    const msg = { type: 'wallet/cloud@get_mine_top', param: { num: num } };
    requestAsync(msg).then(data => {
        const miningData = parseMiningRank(data);
        updateStore('miningRank', miningData);
    });
};

/**
 * 发送验证码
 */
export const sendCode = async (phone: number, num: number) => {
    const msg = { type: 'wallet/sms@send_sms_code', param: { phone, num, name: '钱包' } };

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
export const regPhone = async (phone: number, code: number) => {
    const bphone = getUserInfo().bphone;
    // tslint:disable-next-line:variable-name
    const old_phone =  bphone ? bphone :'';
    const msg = { type: 'wallet/user@reg_phone', param: { phone, old_phone, code } };
    
    try {
        return await requestAsync(msg);
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

    return requestAsync(msg);
};
/**
 * 矿山增加项目跳转详情
 */
export const getMineItemJump = async(itemJump) => {
    updateStore('mineItemJump',itemJump);
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
export const withdrawFromServer = async (toAddr:string,value:string) => {
    const msg = {
        type: 'wallet/bank@to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    try {
        const res = await requestAsync(msg);
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
export const btcWithdrawFromServer = async (toAddr:string,value:string) => {
    const msg = {
        type: 'wallet/bank@btc_to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    try {
        const res = await requestAsync(msg);
        console.log('btcWithdrawFromServer',res);

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
        const rechargeLogsMap = getBorn('rechargeLogs');
        const rechargeLogs = rechargeLogsMap.get(CurrencyType[coin]) || { list:[] };
        if (!start) {
            rechargeLogs.list = detail;
        } else {
            rechargeLogs.list.push(...detail);
        }
        
        rechargeLogs.start = nextStart;
        rechargeLogs.canLoadMore = canLoadMore;
        rechargeLogsMap.set(CurrencyType[coin],rechargeLogs);
        updateStore('rechargeLogs',rechargeLogsMap);

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
        const withdrawLogsMap = getBorn('withdrawLogs');
        const withdrawLogs = withdrawLogsMap.get(CurrencyType[coin]) || { list:[] };
        if (!start) {
            withdrawLogs.list = detail;
        } else {
            withdrawLogs.list.push(...detail);
        }
        
        withdrawLogs.start = nextStart;
        withdrawLogs.canLoadMore = canLoadMore;
        withdrawLogsMap.set(CurrencyType[coin],withdrawLogs);
        updateStore('withdrawLogs',withdrawLogsMap);

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
        updateStore('productList',result);

        return result;
    } catch (err) {
        showError(err && (err.result || err.type));

        return [];
    }
};

/**
 * 购买理财
 */
export const buyProduct = async (pid:any,count:any) => {
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
        const res = await requestAsync(msg);
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
 * 购买记录
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
        updateStore('purchaseRecord',record);

    } catch (err) {
        showError(err && (err.result || err.type));
    }
};
/**
 * 赎回理财产品
 */
export const buyBack = async (timeStamp:any) => {
    const msg = {
        type: 'wallet/manage_money@sell',
        param: {
            time:timeStamp
        }
    };
    
    try {
        const res = await requestAsync(msg);
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
            [MinerFeeLevel.STANDARD]:Number(res.standard),
            [MinerFeeLevel.FAST]:Number(res.fast),
            [MinerFeeLevel.FASTEST]:Number(res.fastest)
        };
        updateStore('gasPrice',gasPrice);

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
            [MinerFeeLevel.STANDARD]:Number(obj.low_fee_per_kb),
            [MinerFeeLevel.FAST]:Number(obj.medium_fee_per_kb),
            [MinerFeeLevel.FASTEST]:Number(obj.high_fee_per_kb)
        };
        updateStore('btcMinerFee',btcMinerFee);

    } catch (err) {
        showError(err && (err.result || err.type));
    }
};

// 获取真实用户
export const fetchRealUser = async () => {
    const msg = {
        type: 'wallet/user@get_real_user',
        param: {}
    };
    
    try {
        const res = await requestAsync(msg);
        const realUserMap = getBorn('realUserMap');
        const conUser = find('conUser');
        if (!conUser) return;
        realUserMap.set(conUser,res.value === 'false' ? false : true);
        updateStore('realUserMap',realUserMap);
        
    } catch (err) {
        console.log('wallet/user@get_real_user--------',err);
        showError(err && (err.result || err.type));

    } 
};

// 上传文件
export const uploadFile = async (base64) => {
    const file = base64ToFile(base64);
    const formData = new FormData();
    formData.append('upload',file);
    fetch(uploadFileUrl, {
        body: formData, // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
    }).then(response => response.json())
        .then(res => {
            console.log('!!!!!!!!!!!',res);
            popNewMessage('图片上传成功');
            if (res.result === 1) {
                const sid = res.sid;
                const userInfo = find('userInfo') || {};
                userInfo.avatar = sid;
                updateStore('userInfo',userInfo);
            }
        });
};
