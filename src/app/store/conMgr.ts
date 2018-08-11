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
export const queryDetailLog = async (rid: string) => {
    const msg = {
        type: 'query_detail_log',
        param: {
            uid: dataCenter.getConUid(),
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
