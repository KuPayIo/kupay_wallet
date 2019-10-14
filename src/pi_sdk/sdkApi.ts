import { closePopBox, popInputBox, popNewLoading, popNewMessage } from './sdkTools';
import { createSignInPage, createSignInStyle } from './signIn';

/**
 * 获取是否开启免密支付
 */
export const getFreeSecret = () => {
    console.log('getFreeSecret called');
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'querySetNoPassword', window["pi_sdk"].config.appid,  (error, startFreeSecret) => {
        console.log('getFreeSecret called callback',startFreeSecret);
        window["pi_sdk"].store.freeSecret = startFreeSecret;
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
            appid: window["pi_sdk"].config.appid,
            noPSW: openFreeSecret ? 1 : 0,
            password:value
        };
        popNewLoading('设置中...');
        window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'setFreeSecrectPay', sendData,  (resCode1, msg1) => {
            if (msg1) {
                window["pi_sdk"].store.freeSecret = !window["pi_sdk"].store.freeSecret;
                popNewMessage('设置成功');
            } else {
                popNewMessage('设置失败');
            }
            closePopBox();
        });
    });
};

// 执行授权监听回调
export const runAuthorizeListener = ()=>{
    console.log(`authorizeCallBack ${authorizeCallBack}, authorizeParams ${authorizeParams}`);
    if(authorizeCallBack && authorizeParams){
        authorize(authorizeParams,authorizeCallBack);
    }
}

// ----------对外接口-----------------------------------------------------------------------
let authorizeParams;
let authorizeCallBack;

// 监听授权
const addAuthorizeListener = (params,callBack)=>{
    authorizeParams = params;
    authorizeCallBack = callBack;
}

// 获取openID
const authorize = (params, callBack) => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'authorize', params,  (error, result) => {
        console.log('authorize call success', error, JSON.stringify(result));
        callBack(error, result);
    });
};

// 第三方支付
const thirdPay =  (order, callBack) => {
    const payCode = {
        CANCEL: -2,      // 取消支付
        NOWEXIN: -7,     // 未安装微信
        SUCCESS : 1,     // 支付成功
        SETNOPASSWORD : 2,   // 余额足够  但是没有开启免密
        EXCEEDLIMIT : 3,   // 余额足够 并且开启免密 但是免密上限
        ERRORPSW: 4,   // 密码错误
        RECHARGEFAILED: 5,  // 充值失败
        FAILED : 6     // 支付失败
    };
    closePopBox();
    popNewLoading('支付中...');
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'thirdPay', { 
        ...order,
        webviewName:window["pi_sdk"].config.webviewName 
    },  (error, res) => {
        console.log('thirdPay call success',res);
        closePopBox();
        if (res.result === payCode.SUCCESS) {
            popNewMessage('支付成功');
            callBack(error,res);
        } else if (res.result === payCode.SETNOPASSWORD || res.result === payCode.EXCEEDLIMIT) {
            const title = res.result === payCode.SETNOPASSWORD ? '未开启免密支付，请输入支付密码' : '免密额度到达上限';
            popInputBox(title,(value) => {
                popNewLoading('支付中...');
                window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'thirdPayDirect', { 
                    order,
                    password:value 
                },  (error, res) => {
                    console.log('thirdPayDirect call success',res);
                    closePopBox();
                    if (res.result === payCode.ERRORPSW) {
                        popNewMessage('密码错误');
                        callBack(error,{ result:payCode.FAILED });
                    } else if (res.result === payCode.SUCCESS) {
                        popNewMessage('支付成功');
                        callBack(error,res);
                    } else if(res.result === payCode.CANCEL){
                        popNewMessage('取消支付');
                        callBack(error,res);
                    } else if(res.result === payCode.NOWEXIN){
                        popNewMessage('未安装微信');
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
const openNewWebview = (param) => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'openNewWebview', param,  (error, result) => {
        console.log('openNewWebview call success');
    });
};

// 关闭钱包后台
const closeWalletWebview = () => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'closeWalletWebview',null, (error, result) => {
        console.log('closeWalletWebview call success');
    });
};

// 打开注册登录页面
const openSignInPage = () => {
    createSignInStyle();
    createSignInPage();
}

// 邀请好友 分享
const inviteUser = (param) => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'inviteFriends',{
        ...param,
        webviewName:window["pi_sdk"].config.webviewName
    }, (error, result) => {
        console.log('inviteUser call success');
    });
}

// ----------对外接口------------------------------------------------------------------------------------------
const piSdk = window["pi_sdk"] || {};
const piApi = {
    authorize,
    thirdPay,
    openNewWebview,
    closeWalletWebview,
    openSignInPage,
    inviteUser,
    addAuthorizeListener
}; 

// tslint:disable-next-line: no-unsafe-any
piSdk.api = piApi;

window["pi_sdk"] = piSdk;