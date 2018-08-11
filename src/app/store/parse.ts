import { isArray } from '../../pi/net/websocket/util';
import { formatBalance, smallUnit2LargeUnit } from '../utils/tools';
import { AccountDetail, CurrencyType, CurrencyTypeReverse, TaskSid } from './interface';

/**
 * 解析数据
 */
// ===================================================== 导入
// ===================================================== 导出
/**
 * 解析云端账号余额
 */
export const parseCloudBalance = (balanceInfo): Map<CurrencyType, number> => {
    const m = new Map<CurrencyType, number>();
    for (let i = 0; i < balanceInfo.value.length; i++) {
        const each = balanceInfo.value[i];
        m.set(each[0], smallUnit2LargeUnit(CurrencyTypeReverse[each[0]], each[1]));
    }

    return m;
};

/**
 * 解析云端账号详情
 */
export const parseCloudAccountDetail = (coinType, infos): AccountDetail[] => {
    const list = [];
    infos.forEach(v => {
        const itype = v[0];
        const amount = formatBalance(smallUnit2LargeUnit(coinType, v[1]));
        let behavior = '';
        if (itype === TaskSid.redEnvelope) {
            if (amount > 0) {
                behavior = '领红包';
            } else {
                behavior = '发红包';
            }
        } else {
            behavior = isArray(v[2]) ? v[2].map(v1 => String.fromCharCode(v1)).join('') : v[2];
        }
        list.push({
            itype,
            amount,
            behavior,
            time: v[3]
        });
    });

    return list;
};
// ===================================================== 本地
// ===================================================== 立即执行