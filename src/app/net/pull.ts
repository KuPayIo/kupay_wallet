/**
 * 主动向后端通讯
 */
import { closeCon, open, request, setUrl } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { EthWallet } from '../core/eth/wallet';
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../store/dataCenter';
import { CurrencyType, CurrencyTypeReverse, LoginState, TaskSid } from '../store/interface';
import { parseCloudAccountDetail, parseCloudBalance, parseMineDetail, parseMineRank, parseMiningRank } from '../store/parse';
import { find, getBorn, updateStore } from '../store/store';
import { recordNumber } from '../utils/constants';
import { doErrorShow, showError } from '../utils/toolMessages';
import { kpt2kt, largeUnit2SmallUnitString, openBasePage, transDate, wei2Eth } from '../utils/tools';

// export const conIp = '47.106.176.185';
declare var pi_modules: any;
export const conIp = pi_modules.store.exports.severIp || '127.0.0.1';
// export const conPort = '8080';
export const conPort = pi_modules.store.exports.severPort || '80';
// 分享链接前缀
export const sharePerUrl = `http://${conIp}:${conPort}/wallet/app/boot/share.html`;

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
                showError(resp.result);
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};
/**
 * 验证登录的异步通信
 */
export const requestLogined = async (msg: any) => {
    if (find('loginState') === LoginState.logined) {
        return requestAsync(msg);
    } else {
        const wallet = find('curWallet');
        let passwd = '';
        if (!find('hashMap',wallet.walletId)) {
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', content: '', inputType: 'password'
            });
        }
        const wlt: EthWallet = await GlobalWallet.createWlt('ETH', passwd, wallet, 0);
        const signStr = sign(dataCenter.getConRandom(), wlt.exportPrivateKey());
        const msgLogin = { type: 'login', param: { sign: signStr } };
        updateStore('loginState', LoginState.logining);
        const res: any = await requestAsync(msgLogin);
        if (res.result === 1) {
            updateStore('loginState', LoginState.logined);

            return requestAsync(msg);
        }
        updateStore('loginState', LoginState.logerror);

        return;
    }

};

/**
 * 开启连接并获取验证随机数
 */
export const openAndGetRandom = async () => {
    const wallet = find('curWallet');
    if (!wallet) return;
    const oldUser = dataCenter.getUser();
    if (oldUser === wallet.walletId) return;
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
    if (oldUser) {
        closeCon();
        dataCenter.setUser(wallet.walletId);
        dataCenter.setUserPublicKey(gwlt.publicKey);

        return;
    }
    setUrl(`ws://${conIp}:2081`);
    dataCenter.setUser(wallet.walletId);
    dataCenter.setUserPublicKey(gwlt.publicKey);

    return doOpen();

};

const doOpen = async () => {
    return new Promise((resolve, reject) => {
        open(async (con) => {
            console.log('----------------------', con);
            try {
                await getRandom();
                resolve(true);
            } catch (error) {
                reject(false);
            }
        }, (result) => {
            console.log(`open错误信息为${result}`);
            reject(result);
        }, async () => {
            updateStore('loginState', LoginState.init);
            try {
                await doOpen();
                resolve(true);
            } catch (error) {
                reject(false);
            }
        });
    });
};

/**
 * 获取随机数
 */
export const getRandom = async () => {
    const msg = { type: 'get_random', param: { account: dataCenter.getUser().slice(2), pk: `04${dataCenter.getUserPublicKey()}` } };
    const resp = await requestAsync(msg);
    dataCenter.setConRandom(resp.rand);
    dataCenter.setConUid(resp.uid);
    getCloudBalance();
};

/**
 * 获取所有的货币余额
 */
export const getCloudBalance = () => {
    const msg = { type: 'wallet/account@get', param: { list: `[${CurrencyType.KT}, ${CurrencyType.ETH}]` } };
    requestAsync(msg).then(balanceInfo => {
        // console.log('balanceInfo', balanceInfo);
        updateStore('cloudBalance', parseCloudBalance(balanceInfo));
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
        } else if ((totalNum - holdNum) > 100) {
            nowNum = (nowNum < 100 && (totalNum - holdNum) > 100) ? 100 : nowNum;  // 如果今日可挖小于100，且矿山剩余量大于100，则今日可挖100
        } else {
            nowNum = totalNum - holdNum;  // 如果矿山剩余量小于100，则本次挖完所有剩余量
        }
        const mining: any = {
            totalNum: totalNum,
            thisNum: nowNum,
            holdNum: holdNum
        };
        updateStore('miningTotal', mining);
    });
};

/**
 * 获取挖矿历史记录
 */
export const getMiningHistory = async () => {
    const msg = { type: 'wallet/cloud@get_pool_detail', param: {} };
    requestAsync(msg).then(data => {
        const list = [];
        for (let i = 0; i < data.value.length; i++) {
            list.push({
                num: kpt2kt(data.value[i][0]),
                total: kpt2kt(data.value[i][1]),
                time: transDate(new Date(data.value[i][2]))
            });
        }
        updateStore('miningHistory', list);
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
        await requestLogined(msg);

        return [];
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return;
    }
};

/**
 * 获取邀请红包领取明细
 */
export const getInviteCodeDetail = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code_detail', param: {} };

    return requestAsync(msg);
};

/**
 * 发送红包
 * @param rtype 红包类型
 * @param ctype 货币类型
 * @param totalAmount 总金额
 * @param count 红包数量
 * @param lm 留言
 */
export const sendRedEnvlope = async (rtype: number, ctype: number, totalAmount: number, redEnvelopeNumber: number, lm: string) => {
    const msg = {
        type: 'emit_red_bag',
        param: {
            type: rtype,
            priceType: ctype,
            totalPrice: largeUnit2SmallUnitString(CurrencyTypeReverse[ctype], totalAmount),
            count: redEnvelopeNumber,
            desc: lm
        }
    };

    try {
        const res = await requestLogined(msg);

        return res.value;
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return;
    }

};
/**
 * 兑换红包
 */
export const convertRedBag = async (cid) => {
    const msg = { type: 'convert_red_bag', param: { cid: cid } };

    try {
        const res = await requestLogined(msg);

        return res.value;
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

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
export const querySendRedEnvelopeRecord = async (start?: string) => {
    let msg;
    if (start) {
        msg = {
            type: 'query_emit_log',
            param: {
                start,
                count: recordNumber
            }
        };
    } else {
        msg = {
            type: 'query_emit_log',
            param: {
                count: recordNumber
            }
        };
    }

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return;
    }
};

/**
 * 查询红包兑换记录
 */
export const queryConvertLog = async (start) => {
    let msg;
    if (start) {
        msg = {
            type: 'query_convert_log',
            param: {
                start,
                count: recordNumber
            }
        };
    } else {
        msg = {
            type: 'query_convert_log',
            param: {
                count: recordNumber
            }
        };
    }

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return;
    }
};

/**
 * 查询某个红包兑换详情
 */
export const queryDetailLog = async (rid: string) => {
    const msg = {
        type: 'query_detail_log',
        param: {
            uid: dataCenter.getConUid(),
            rid
        }
    };

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

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
export const getMineDetail = async () => {
    const msg = { type: 'wallet/cloud@grant_detail', param: {} };
    requestAsync(msg).then(detail => {
        const list = parseMineDetail(detail);
        updateStore('addMine', list);
    });
};

/**
 * 获取分红历史记录
 */
export const getDividHistory = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_info', param: {} };
    requestAsync(msg).then(data => {
        const list = [];
        for (let i = 0; i < data.value.length; i++) {
            list.push({
                num: wei2Eth(data.value[i][1][0]),
                total: wei2Eth(data.value[i][1][1]),
                time: transDate(new Date(data.value[i][0]))
            });
        }
        updateStore('dividHistory', list);
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
export const setUserInfo = async (value) => {
    const msg = { type: 'wallet/user@set_info', param: { value } };

    return requestAsync(msg);
};

/**
 * 批量获取用户信息
 */
export const getUserInfo = async (uids: [number]) => {
    const msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };

    return requestAsync(msg);
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
 */
export const getAccountDetail = async (coin: CurrencyType) => {
    const msg = { type: 'wallet/account@get_detail', param: { coin } };
    requestAsync(msg).then(r => {
        if (!r.value || r.value.length <= 0) return;
        const detail = parseCloudAccountDetail(coin, r.value);
        updateStore('accountDetail', getBorn('accountDetail').set(coin, detail));
    });
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

    return requestAsync(msg);
};

/**
 * 注册手机
 */
export const regPhone = async (phone: number, code: number) => {
    const msg = { type: 'wallet/user@reg_phone', param: { phone, code } };

    return requestAsync(msg).catch(error => {
        console.log(error);
        if (error.type === -300) {
            popNew('app-components-message-message', { itype: 'error', center: true, content: `验证码失效，请重新获取` });
        } else {
            popNew('app-components-message-message', { itype: 'error', center: true, content: `错误${error.type}` });
        }
    });
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
 * 获取服务端钱包地址
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
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return;
    }
};
/**
 * 向服务器发起充值请求
 */
export const rechargeToServer = async (fromAddr:string,toAddr:string,tx:string,nonce:number,gas:number,value:number,coin:number= 101) => {
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
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return false;
    }

};

/**
 * 提现
 */
export const withdrawFromServer = async (toAddr:string,coin:number,value:number) => {
    const msg = {
        type: 'wallet/bank@to_cash',
        param: {
            to:toAddr,
            coin,
            value
        }
    };

    try {
        const res = await requestAsync(msg);
        console.log('withdrawFromServer',res);

        return true;
    } catch (err) {
        if (err && err.result) {
            showError(err.result);
        } else {
            doErrorShow(err);
        }

        return false;
    }
};