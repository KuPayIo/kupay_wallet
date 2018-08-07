import { request } from '../../../pi/net/ui/con_mgr';

/**
 * 连接管理
 */

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

// 不同红包类型
export enum RedEnvelopeType {
    Normal = '00',
    Random = '01',
    Invite = '99'
}

const requestAsync = async (msg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== undefined) {
                resolve(resp);
            }
        });
    });
};

 // 普通红包开红包
export const takeRedEnvelope = async (rid:string) => {
    const msg = {
        type:'take_red_bag',
        param:{
            rid
        }
    };
    // tslint:disable-next-line:no-unnecessary-local-variable
    const res = await requestAsync(msg);

    return res;
};