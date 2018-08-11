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
 * 获取矿山排名列表
 */
export const getMineRank = async (num: number) => {
    const msg = { type: 'wallet/cloud@mine_top', param: { num: num } };

    return requestAsync(msg);
};

/**
 * 获取挖矿排名列表
 */
export const getMiningRank = async (num: number) => {
    const msg = { type: 'wallet/cloud@get_mine_top', param: { num: num } };

    return requestAsync(msg);
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

    return requestAsync(msg);
};
