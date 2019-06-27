/**
 * 主动向后端通讯
 */
import { uploadFileUrl } from '../config';
import { callRequestAsync, callRequestAsyncNeedLogin,getStoreData, setStoreData } from '../middleLayer/wrap';
import { CloudCurrencyType } from '../publicLib/interface';
import { getModulConfig } from '../publicLib/modulConfig';
import { unicodeArray2Str } from '../publicLib/tools';
import { largeUnit2SmallUnit } from '../publicLib/unitTools';
import { showError } from '../utils/toolMessages';
import { base64ToFile, getUserInfo, popNewMessage } from '../utils/tools';

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CloudCurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };
    callRequestAsync(msg).then(r => {
        // todo 这里更新余额
    });
};

// ==========================================红包start
/**
 * 获取邀请码码
 */
export const getInviteCode = async () => {
    const msg = { type: 'wallet/cloud@get_invite_code', param: {} };

    return callRequestAsync(msg);
};

/**
 * 兑换邀请码
 */
export const inputInviteCdKey = async (code) => {
    const msg = { type: 'wallet/cloud@input_cd_key', param: { code: code } };
    try {
        await callRequestAsync(msg);

        return [];
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

    try {
        const res = await callRequestAsyncNeedLogin(msg,secretHash);

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
        const res = await callRequestAsync(msg);

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
        const res = await callRequestAsync(msg);

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

    return callRequestAsync(msg);
};

// ==========================================红包end

/**
 * 挖矿
 */
export const getAward = async () => {
    const msg = { type: 'wallet/cloud@get_award', param: {} };

    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const detail = await callRequestAsync(msg);
        
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

    return callRequestAsync(msg);
};

/**
 * 获取客户端数据
 */
export const getData = async (key) => {
    const msg = { type: 'wallet/data@get', param: { key } };

    return callRequestAsync(msg);
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
        const res = await callRequestAsync(msg);
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

    callRequestAsync(msg).then(r => {
        // 通信成功
    });
};

/**
 * 验证手机号是否被注册
 */
export const verifyPhone = async (phone:string,num: string) => {
    const msg = { type: 'wallet/user@check_phone', param: { phone,num } };
    try {
        await callRequestAsync(msg); 

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
        if (v) {
            popNewMessage('手机号已绑定');

            return;
        }
    }
    const msg = { type: 'wallet/sms@send_sms_code', param: { phone, num, name: getModulConfig('WALLET_NAME') } };
    try {
        return await callRequestAsync(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 注册手机
 */
export const regPhone = async (phone: string, num:string, code: string) => {
    const userInfo = await getUserInfo();
    const bphone = userInfo.phoneNumber;
    const areaCode = userInfo.areaCode;
    // tslint:disable-next-line:variable-name
    const old_phone =  bphone ? bphone :'';
    // tslint:disable-next-line:variable-name
    const  old_num = areaCode ? areaCode : '';
    const msg = { type: 'wallet/user@reg_phone', param: { phone, old_phone, code,num,old_num } };
    
    try {
        return await callRequestAsync(msg);
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
        return await callRequestAsync(msg);
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
        return await callRequestAsync(msg);
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

    return callRequestAsync(msg);
};

// ===============================充值提现

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
        const res = await callRequestAsyncNeedLogin(msg,secretHash);
        console.log('buyBack',res);

        return true;
    } catch (err) {
        showError(err && (err.result || err.type));

        return false;
    }
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
                getStoreData('user/info').then(userInfo => {
                    userInfo.avatar = sid;
                    setStoreData('user/info',userInfo);
                });
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

    return callRequestAsync(msg);
};

/**
 * 获取邀请好友accId
 */
export const getInviteUserAccIds = () => {
    const msg = {
        type: 'wallet/cloud@get_invites',
        param: {}
    };

    return callRequestAsync(msg);
};