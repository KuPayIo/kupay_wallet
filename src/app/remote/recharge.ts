import { gopay, payPlatform } from '../../pi/browser/vm';

/**
 * 充值模块
 */

/**
 * 去充值页面
 */
export const goRecharge = (balance:number) => {
    return new Promise((resolve,reject) => {
        gopay(balance,(conpay:number, sMD:any, platform: payPlatform) => {
            console.log('充值数量',conpay);
            console.log('充值参数',sMD);
            console.log('充值方式',platform);
            resolve({ conpay,sMD,platform });
        },() => {
            reject();  
        });
    });
    
};