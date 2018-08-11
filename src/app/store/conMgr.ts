/**
 * 连接管理
 */
import { requestAsync, requestLogined } from '../net/pull';
import { largeUnit2SmallUnitString } from '../utils/tools';
import { dataCenter } from './dataCenter';

// 枚举登录状态
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}
// 货币类型
export enum CurrencyType {
    KT = 100,
    ETH
}

// 枚举货币类型
export const CurrencyTypeReverse = {
    100: 'KT',
    101: 'ETH'
};

// 红包类型
export enum RedEnvelopeType {
    Normal = '00',
    Random = '01',
    Invite = '99'
}
export const conIp = '127.0.0.1';
export const conPort = '80';
// 分享链接前缀
export const sharePerUrl = `http://${conIp}:${conPort}/wallet/app/boot/share.html`;

// 任务id记录
export enum TaskSid {
    createWlt = 1001,// 创建钱包
    firstChargeEth,// 首次转入
    bindPhone,// 注册手机
    chargeEth,// 存币
    inviteFriends,// 邀请真实好友
    buyFinancial = 1007,// 购买理财产品
    transfer,// 交易奖励
    bonus,// 分红
    mines,// 挖矿
    chat,// 聊天
    redEnvelope = 'red_bag_port' // 红包
}

// 查询历史记录时一页的数量
export const recordNumber = 10;

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };

    return requestAsync(msg);
};

/**
 * 获取分红汇总信息
 */
export const getDividend = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_total', param: {} };

    return requestAsync(msg);
};

/**
 * 获取挖矿汇总信息
 */
export const getMining = async () => {
    const msg = { type: 'wallet/cloud@get_mine_total', param: {} };

    return requestAsync(msg);
};

/**
 * 获取挖矿历史记录
 */
export const getMiningHistory = async () => {
    const msg = { type: 'wallet/cloud@get_pool_detail', param: {} };

    return requestAsync(msg);
};

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

    return requestLogined(msg);
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
export const sendRedEnvlope = async (rtype:number,ctype:number,totalAmount:number,redEnvelopeNumber:number,lm:string) => {
    const msg = {
        type:'emit_red_bag',
        param:{
            type:rtype,
            priceType:ctype,
            totalPrice:largeUnit2SmallUnitString(CurrencyTypeReverse[ctype],totalAmount),
            count:redEnvelopeNumber,
            desc:lm
        }
    };

    return requestLogined(msg);
};
/**
 * 兑换红包
 */
export const convertRedBag = async (cid) => {
    const msg = { type: 'convert_red_bag', param: { cid: cid } };

    return requestLogined(msg);
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

    return requestAsync(msg);
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

    return requestAsync(msg);
};

/**
 * 查询某个红包兑换详情
 */
export const queryDetailLog = async (rid:string) => {
    const msg = {
        type:'query_detail_log',
        param:{
            uid:dataCenter.getConUid(),
            rid
        }
    };
    
    return requestAsync(msg);
};

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

    return requestAsync(msg);
};

/**
 * 获取分红历史记录
 */
export const getDividHistory = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_info', param: {} };

    return requestAsync(msg);
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
 * 批量获取用户信息
 */
export const doChat = async () => {
    const msg = { type: 'wallet/cloud@chat', param: {} };

    return requestAsync(msg);
};

/**
 * 获取指定货币流水
 */
export const getAccountDetail = async (coin) => {
    const msg = { type: 'wallet/account@get_detail', param: { coin } };

    return requestAsync(msg);
};

/**
 * 获取矿山排名列表
 */
export const getMineRank = async(num:number) => {
    const msg = { type: 'wallet/cloud@mine_top', param: { num:num } };

    return requestAsync(msg);
};

/**
 * 获取挖矿排名列表
 */
export const getMiningRank = async(num:number) => {
    const msg = { type: 'wallet/cloud@get_mine_top', param: { num:num } };

    return requestAsync(msg);
};

/**
 * 发送验证码
 */
export const sendCode = async(phone:number,num:number) => {
    const msg = { type: 'wallet/sms@send_sms_code', param: { phone,num,name:'钱包' } };

    return requestAsync(msg);
};

/**
 * 注册手机
 */
export const regPhone = async(phone:number,code:number) => {
    const msg = { type: 'wallet/user@reg_phone', param: { phone,code } };

    return requestAsync(msg);
};
