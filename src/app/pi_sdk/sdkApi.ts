import { closePopBox, popInputBox, popNewLoading, popNewMessage } from './sdkTools';

// tslint:disable-next-line:variable-name
const pi_sdk = (<any>window).pi_sdk || {};

// tslint:disable-next-line:variable-name

/**
 * 获取是否开启免密支付
 */
export const getFreeSecret = () => {
    console.log('getFreeSecret called');
    pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'querySetNoPassword', pi_sdk.config.appid,  (error, startFreeSecret) => {
        console.log('getFreeSecret called callback',startFreeSecret);
        pi_sdk.store.freeSecret = startFreeSecret;
    });
};

// 第三方设置免密支付
// openFreeSecret:设置免密支付状态  
// 0:关闭，1:开启
export const setFreeSecrectPay =  (openFreeSecret) => {
    closePopBox();
    const title = openFreeSecret ? '设置免密支付' : '关闭免密支付'; 
    popInputBox(title,(value) => {
        const sendData = {
            appid: pi_sdk.config.appid,
            noPSW: openFreeSecret ? 1 : 0,
            password:value
        };
        popNewLoading('设置中...');
        pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'setFreeSecrectPay', sendData,  (resCode1, msg1) => {
            if (msg1) {
                pi_sdk.store.freeSecret = !pi_sdk.store.freeSecret;
                popNewMessage('设置成功');
            } else {
                popNewMessage('设置失败');
            }
            closePopBox();
        });
    });
};

// ----------对外接口------------------------------------------------------------------------------------------

// 获取openID
const authorize = (payload, callBack) => {
    pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'authorize', payload,  (error, result) => {
        console.log('getOpenId call success', error);
        console.log('getOpenId call success', result);
        callBack(error, result);
    });
};

// 第三方支付
const thirdPay =  (order, callBack) => {
    const payCode = {
        SUCCESS : 1,     // 支付成功
        SETNOPASSWORD : 2,   // 余额足够  但是没有开启免密
        EXCEEDLIMIT : 3,   // 余额足够 并且开启免密 但是免密上限
        ERRORPSW: 4,   // 密码错误
        RECHARGEFAILED: 5,  // 充值失败
        FAILED : 6     // 支付失败
    };
    closePopBox();
    popNewLoading('支付中...');
    pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'thirdPay', { order,webviewName:pi_sdk.config.webviewName },  (error, res) => {
        console.log('thirdPay call success',res);
        closePopBox();
        if (res.result === payCode.SUCCESS) {
            popNewMessage('支付成功');
            callBack(error,res);
        } else if (res.result === payCode.SETNOPASSWORD || res.result === payCode.EXCEEDLIMIT) {
            const title = res.result === payCode.SETNOPASSWORD ? '未开启免密支付，请输入支付密码' : '免密额度到达上限';
            popInputBox(title,(value) => {
                popNewLoading('支付中...');
                pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'thirdPayDirect', { order,password:value },  (error, res) => {
                    console.log('thirdPayDirect call success',res);
                    closePopBox();
                    if (res.result === payCode.ERRORPSW) {
                        popNewMessage('密码错误');
                        callBack(error,{ result:payCode.FAILED });
                    } else if (res.result === payCode.SUCCESS) {
                        popNewMessage('支付成功');
                        callBack(error,res);
                    } else {
                        popNewMessage('支付失败');
                        callBack(error,res);
                    }
                    
                });
            });
        } else {
            popNewMessage('支付失败');
            callBack(error,{ result:payCode.FAILED });
        }
    });
};

// 打开新页面
const openNewWebview = (payload) => {
    pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'openNewWebview', payload,  (error, result) => {
        console.log('openNewWebview call success');
    });
};

// 关闭钱包后台
const closeWalletWebview = () => {
    pi_sdk.pi_RPC_Method(pi_sdk.config.jsApi, 'closeWalletWebview', (error, result) => {
        console.log('closeWalletWebview call success');
    });
}

// ----------对外接口------------------------------------------------------------------------------------------

// tslint:disable-next-line:variable-name
const pi_api = {
    authorize,
    thirdPay,
    openNewWebview,
    closeWalletWebview
}; 

pi_sdk.api = pi_api;
(<any>window).pi_sdk = pi_sdk;