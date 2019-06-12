/**
 * 和第3方库相关的一些工具函数
 */
import { getLang } from '../../pi/util/lang';
import { Config } from '../config';
import { callGetServerCloudBalance } from '../middleLayer/loginBridge';
import { callBackupMnemonic, callVerifyIdentidy } from '../middleLayer/walletBridge';
import { buyProduct, getPurchaseRecord } from '../net/pull';
import { popNewLoading, popNewMessage } from './tools';

// 购买理财
export const purchaseProduct = async (psw:string,productId:string,amount:number) => {
    const close = popNewLoading(Config[getLang()].bugProduct.buying);  // 购买中  
    const secretHash = await callVerifyIdentidy(psw);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(Config[getLang()].bugProduct.wrong);  // 密码错误  
        
        return;
    }
    const data = await buyProduct(productId,amount,secretHash);
    close.callback(close.widget);
    if (data) {
        popNewMessage(Config[getLang()].bugProduct.buySuccess); // 购买成功
        callGetServerCloudBalance();
        console.log('data',data);
        getPurchaseRecord();// 购买之后获取购买记录
    }
    
    return data;
};

// 备份助记词
export const backupMnemonic = async (passwd:string) => {
    const close = popNewLoading(Config[getLang()].userInfo.exporting);
    const ret = await callBackupMnemonic(passwd);
    close.callback(close.widget);
    if (!ret.mnemonic) {
        popNewMessage(Config[getLang()].transError[0]);
        
        return;
    }

    return ret;
};
