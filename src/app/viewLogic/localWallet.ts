/**
 * 本地钱包相关操作
 */
import { getStore as gameGetStore, setStore as gameSetStore } from '../../earn/client/app/store/memstore';
import { popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
// tslint:disable-next-line:max-line-length
import { callBackupMnemonic, callBtcRecharge, callBtcWithdraw, callBuyProduct, callCreateNewAddr, callCreateWalletByImage, callCreateWalletRandom, callDcClearTxTimer, callDcInitErc20GasLimit, callDcRefreshAllTx, callDcUpdateAddrInfo, callDeletLocalTx, callDoERC20TokenTransfer, callDoEthTransfer, callEthRecharge, callEthWithdraw, callGetAllAccount, callGetHighTop, callGetPurchaseRecord, callGetRechargeLogs, callGetServerCloudBalance, callGetWltAddrIndex, callImportWalletByFragment, callImportWalletByMnemonic, callManualLogin ,callResendBtcRecharge,callResendBtcTransfer, callUpdateLocalTx, callVerifyIdentidy, setStoreData } from '../middleLayer/wrap';
import { Config, ERC20Tokens } from '../publicLib/config';
import { CloudCurrencyType, CreateWalletOption, TxHistory } from '../publicLib/interface';
import { doErrorShow } from '../utils/toolMessages';
import { closeAllPage, getPopPhoneTips, getStaticLanguage, popNewLoading, popNewMessage } from '../utils/tools';

/**
 * 创建钱包的方式
 */
export enum CreateWalletType {
  Random = 1, // 普通随机创建
  Image, // 通过图片创建
  StrandarImport, // 普通导入
  ImageImport, // 图片导入
  FragmentImport // 片段导入
}

/**
 * 创建钱包
 * @param itype 创建钱包方式 1 随机 2 图片 3 标准导入 4 照片导入 5 片段导入
 * @param option 相关参数
 */
export const createWallet = async (itype: CreateWalletType, option: CreateWalletOption) => {
    let secrectHash;
    let close;
    try {
        if (itype === CreateWalletType.Random) {
            close = popNewLoading({ zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' });
            secrectHash = await callCreateWalletRandom(option);
        } else if (itype === CreateWalletType.Image) {
            close = popNewLoading({ zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' });
            secrectHash = await callCreateWalletByImage(option);
        } else if (itype === CreateWalletType.StrandarImport) {
            close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
            secrectHash = await callImportWalletByMnemonic(option);
        } else if (itype === CreateWalletType.ImageImport) {
            close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
            secrectHash = await callCreateWalletByImage(option);
        } else if (itype === CreateWalletType.FragmentImport) {
            close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
            secrectHash = await callImportWalletByFragment(option);
        }

    } catch (err) {
        popNewMessage('出错啦');
        console.log('创建钱包出错',err);
        
        return '';
    } finally {
        close.callback(close.widget);
    }
    
    // 刷新本地钱包
    callDcRefreshAllTx();
    callDcInitErc20GasLimit();
   
    return secrectHash;
};

/**
 * 游客登录创建钱包
 */
export const touristLogin = async (option: CreateWalletOption) => {
    const close = popNewLoading({ zh_Hans:'游客登录中',zh_Hant:'遊客登錄中',en:'' });
    let secrectHash;
    try {
        secrectHash = await callCreateWalletRandom(option,true);
        setStoreData('flags/setPsw',false);  // 新钱包创建成功，重置密码提示
    } catch (err) {
        return '';
    } finally {
        close.callback(close.widget);
    }
    
    // 刷新本地钱包
    callDcRefreshAllTx();
    callDcInitErc20GasLimit();

    return secrectHash;
};

/**
 * 新版游客登录
 */
export const manualLogin = async () => {
    const close = popNewLoading({ zh_Hans:'游客登录中',zh_Hant:'遊客登錄中',en:'' });
    try {
        await callManualLogin();
    } catch (err) {
        return '';
    } finally {
        close.callback(close.widget);
    }
};

/**
 * 手机号导入
 */
export const phoneImport = async (option: CreateWalletOption) => {
    let secrectHash;
    try {
        secrectHash = await callCreateWalletRandom(option,true);
    } catch (err) {
        return '';
    }

    return secrectHash;
};

/**
 * 创建新地址
 */
export const createNewAddr = async (passwd: string, currencyName: string) => {
    const close = popNewLoading({ zh_Hans:'添加中...',zh_Hant:'添加中...',en:'' });
    callCreateNewAddr(passwd,currencyName).then(() => {
        close.callback(close.widget);
        popNewMessage({ zh_Hans:'添加成功',zh_Hant:'添加成功',en:'' });
    }).catch(() => {
        close.callback(close.widget);
        popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });
    });
};

/**
 * 导出助记词
 */
export const exportMnemonic = async (passwd:string,needFragments:boolean = true) => {
    const close = popNewLoading(Config[getLang()].userInfo.exporting);
    try {
        const ret = await callBackupMnemonic(passwd,needFragments);
        console.log('exportMnemonic',ret);

        return ret;
    } catch (err) {
        popNewMessage('密码错误');
    } finally {
        close.callback(close.widget);
    }
    
};

// 购买理财
export const purchaseProduct = async (psw:string,productId:string,amount:number) => {
    const close = popNewLoading(Config[getLang()].bugProduct.buying);  // 购买中  
    const secretHash = await callVerifyIdentidy(psw);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(Config[getLang()].bugProduct.wrong);  // 密码错误  
        
        return;
    }
    const data = await callBuyProduct(productId,amount,secretHash);
    close.callback(close.widget);
    if (data) {
        popNewMessage(Config[getLang()].bugProduct.buySuccess); // 购买成功
        callGetServerCloudBalance();
        console.log('data',data);
        callGetPurchaseRecord();// 购买之后获取购买记录
    }
    
    return data;
};

// 强制被踢下线
export const forceOffline = () => {
    popNew('app-components-modalBox-modalBox',{
        sureText:{ zh_Hans:'重新登录',zh_Hant:'重新登錄',en:'' },
        cancelText:{ zh_Hans:'退出',zh_Hant:'退出',en:'' },
        title:{ zh_Hans:'下线通知',zh_Hant:'下線通知',en:'' },
        content:{ zh_Hans:'您的账户已被下线，如非本人操作，则助记词可能已泄露。',zh_Hant:'您的賬戶已被下線，如非本人操作，則助記詞可能已洩露。',en:'' }
    }, () => {
        setTimeout(async () => {
            closeAllPage();
            const accounts = await callGetAllAccount();
            if (accounts.length > 0) {
                popNew('app-view-base-entrance1',{ accounts });
            } else {
                popNew('app-view-base-entrance');
            }
        },100);
    },() => {
        setTimeout(async () => {
            closeAllPage();
            const accounts = await callGetAllAccount();
            if (accounts.length > 0) {
                popNew('app-view-base-entrance1',{ accounts });
            } else {
                popNew('app-view-base-entrance');
            }
        },100);
    });
};

// 充值成功
export const payOk = () => {
    popNewMessage(getStaticLanguage().transfer.rechargeTips);
};

// 设置密码弹框
export const setPswPop = () => {
    setTimeout(() => {
        const modalBox = { 
            zh_Hans:{
                title:'设置密码',
                content:'为了您的资产安全，请您立即设置支付密码',
                sureText:'去设置',
                onlyOk:true
            },
            zh_Hant:{
                title:'設置密碼',
                content:'為了您的資產安全，請您立即設置支付密碼',
                sureText:'去設置',
                onlyOk:true
            },
            en:'' 
        };
        popModalBoxs('app-components-modalBox-modalBox',modalBox[getLang()],() => {  
            popNew('app-view-mine-setting-settingPsw',{});
        },undefined,true);
    },2000);
};

// 绑定手机弹框
export const bindPhonePop = () => {
    setTimeout(() => {
        popModalBoxs('app-components-modalBox-modalBox',getPopPhoneTips(),() => { 
            popNew('app-view-mine-setting-phone',{ jump:true });
        },undefined,true);    
    },2000);
};

// 余额变化  密码弹框或手机弹框
export const balanceChange = (args:any) => {
    if (args.popType === 0) {
        setPswPop();
    } else if (args.popType === 1) {
        bindPhonePop();
    }
    if (args.cointype === CloudCurrencyType.KT) {
        callGetHighTop(100).then((data) => {
            const mine = gameGetStore('mine',{});
            mine.miningRank = data.miningRank || 0;
            gameSetStore('mine',mine);  
        });
        console.log('KT余额变化');
    }
};

/**
 * 充值
 */
export const recharge = async (psw:string,txRecord:TxHistory) => {
    let tx;
    const close = popNewLoading(getStaticLanguage().transfer.recharge);
    if (txRecord.currencyName === 'BTC') {
        tx = await callBtcRecharge(psw,txRecord);
    } else {
        tx = await callEthRecharge(psw,txRecord);
    }
    close.callback(close.widget);
    if (tx) {
        popNewMessage(getStaticLanguage().transfer.rechargeSuccess);
        callUpdateLocalTx(tx);
        console.log(`recharge tx is `,tx);
        callDcUpdateAddrInfo(tx.addr,tx.currencyName);
        callGetRechargeLogs(tx.currencyName);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
        
        return tx.hash;
    }
};

/**
 * 充值重发
 */
export const resendRecharge = async (psw:string,txRecord:TxHistory) => {
    console.log('----------resendRecharge--------------');
    const loading = popNewLoading(getStaticLanguage().transfer.againSend);
    let tx;
    try {
        if (txRecord.currencyName === 'BTC') {
            tx = await callResendBtcRecharge(psw,txRecord);
        } else {
            tx = await callEthRecharge(psw,txRecord);
        }
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    } finally {
        loading.callback(loading.widget);
    }
    if (tx) {
        const oldHash = txRecord.hash;
        callDeletLocalTx(txRecord);
        callUpdateLocalTx(tx);
        callDcClearTxTimer(oldHash);// 删除定时器
        callDcUpdateAddrInfo(tx.addr,tx.currencyName);
        callGetRechargeLogs(tx.currencyName);
        popNewMessage(getStaticLanguage().transfer.againSuccess);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return tx.hash;
};

/**
 * 提现
 */
export const withdraw = async (passwd:string,toAddr:string,currencyName:string,amount:number | string) => {
    const close = popNewLoading(getStaticLanguage().transfer.withdraw);
    let hash;
    try {
        const secretHash = await callVerifyIdentidy(passwd);
        if (!secretHash) {
            popNewMessage(getStaticLanguage().transfer.wrongPsw);

            return;
        }
        if (currencyName === 'BTC') {
            hash = await callBtcWithdraw(passwd,toAddr,amount);
        } else {
            hash = await callEthWithdraw(passwd,toAddr,amount);
        }
        popNewMessage(getStaticLanguage().transfer.withdrawSuccess);
    } catch (err) {
        popNewMessage('出错啦');
    } finally {
        close.callback(close.widget);
    }

    return hash;
};

/**
 * 普通转账重发
 */
export const resendNormalTransfer = async (psw:string,txRecord:TxHistory) => {
    console.log('----------resendNormalTransfer--------------');
    const loading = popNewLoading(getStaticLanguage().transfer.againSend);
    const fromAddr = txRecord.fromAddr;
    const currencyName = txRecord.currencyName;
    let ret: any;
    try {
        const addrIndex = await callGetWltAddrIndex(fromAddr, currencyName);
        if (addrIndex >= 0) {
            if (currencyName === 'ETH') {
                ret = await callDoEthTransfer(psw,addrIndex,txRecord);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await callResendBtcTransfer(psw,addrIndex, txRecord);
                console.log('btc res-----',res);
                ret = {
                    hash:res.txid,
                    nonce:-1
                };
            } else if (ERC20Tokens[currencyName]) {
                ret = await callDoERC20TokenTransfer(psw,addrIndex,txRecord);
            }
        }
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    } finally {
        loading.callback(loading.widget);
    }
    if (ret) {
        const t = new Date();
        const tx = {
            ...txRecord,
            hash:ret.hash,
            time: t.getTime()
        };
        
        const oldHash = txRecord.hash;
        callDeletLocalTx(txRecord);
        callUpdateLocalTx(tx);
        callDcClearTxTimer(oldHash);// 删除定时器
        callDcUpdateAddrInfo(tx.addr,tx.currencyName);
        popNewMessage(getStaticLanguage().transfer.againSuccess);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return ret;
};