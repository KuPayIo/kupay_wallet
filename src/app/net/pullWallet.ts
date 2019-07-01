/**
 * 主动向钱包通讯
 */
// ===================================================== 导入
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { isNumber } from '../../pi/util/util';
import { ERC20Tokens } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet, initWeb3, web3 } from '../core/eth/wallet';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../logic/dataCenter';
import { MinerFeeLevel, TxHistory, TxStatus, TxType } from '../store/interface';
import { erc20GasLimitRate } from '../utils/constants';
import { doErrorShow } from '../utils/toolMessages';
// tslint:disable-next-line:max-line-length
import { deletLocalTx, fetchBtcMinerFee, fetchGasPrice, getConfirmBlockNumber, getCurrentEthAddr, getEthNonce, getStaticLanguage, setEthNonce, updateLocalTx, popNewMessage, popNewLoading } from '../utils/tools';
import { btc2Sat, eth2Wei, ethTokenMultiplyDecimals, wei2Eth } from '../utils/unitTools';
import { fetchMinerFeeList, getWltAddrIndex, VerifyIdentidy } from '../utils/walletTools';
// tslint:disable-next-line:max-line-length
import { btcRechargeToServer, btcWithdrawFromServer, getBankAddr, getBtcBankAddr, getRechargeLogs, getWithdrawLogs, rechargeToServer, withdrawFromServer } from './pull';
// ===================================================== 导出
export interface TxPayload {
    fromAddr:string;        // 转出地址
    toAddr:string;          // 转入地址
    pay:number;             // 转账金额
    currencyName:string;    // 转账货币
    fee:number;             // 矿工费
    minerFeeLevel:MinerFeeLevel;   // 矿工费等级
}

export interface TxPayload3 {
    fromAddr:string;        // 转出地址
    toAddr:string;          // 转入地址
    pay:string | number;             // 转账金额
    currencyName:string;    // 转账货币
    data:string;
}

/**
 * 供其他的webview调用
 */
export const rpcProviderSendAsync = (payload, callback) => {
    initWeb3();    
    if (payload.method === 'eth_accounts') {
        let addr = getCurrentEthAddr();
        addr = addr ? [addr] : [];
        callback(null,{ jsonrpc: '2.0', result: addr, id: payload.id });
    } else if (payload.method === 'eth_sendTransaction') {
        // alert(`payload is ${JSON.stringify(payload)}`);
        const ethPayload = {
            fromAddr:payload.params[0].from,
            toAddr:payload.params[0].to,
            pay:payload.params[0].value,
            currencyName:'ETH',
            data:payload.params[0].data
        };    
        try {

            const promise = transfer3(payload.passwd,ethPayload);

            promise.then(([err, hash]) => {
                console.log(`wallet rpcProviderSendAsync err is ${err}, hash is ${hash}`);
                if (err) {
                    callback(err);
                } else {
                    callback(null, { jsonrpc: '2.0', result: hash, id: payload.id });
                }
            }).catch((err) => {
                console.log(`wallet rpcProviderSendAsync err is catch`);
                callback(err);
            });
        } catch (e) {
            console.log(`transfer3 catch throw`);
            callback(e);
        }
        
    } else {
        if (web3 && web3.currentProvider && web3.currentProvider.sendAsync) {
            web3.currentProvider.sendAsync(payload, callback);
        }
    }

    // 关闭webview定时器
    WebViewManager.endTimer();
};

/**
 * 普通转账
 */
export const transfer3 = async (psw:string,txPayload:TxPayload3) => {
    try {  
        if (psw.length <= 0) return ['have no password'];
        const fromAddr = txPayload.fromAddr;
        const currencyName = txPayload.currencyName;
        const minerFeeLevel = MinerFeeLevel.Standard;
        const minerFeeList = fetchMinerFeeList(currencyName);
        const fee = minerFeeList[minerFeeLevel].minerFee;
        const txRecord:TxHistory = {
            hash:'',
            addr:fromAddr,
            txType:TxType.Transfer,
            fromAddr,
            toAddr:txPayload.toAddr,
            pay: wei2Eth(txPayload.pay),
            time: 0,
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName,
            fee,
            nonce:undefined,
            minerFeeLevel
        };

        const addrIndex = getWltAddrIndex(fromAddr, currencyName);
        let hash;
        if (addrIndex >= 0) {    
            const wltPromise = GlobalWallet.createWlt(currencyName, psw, addrIndex);
            const api = new EthApi();
            const nonce = txRecord.nonce;
            const localNonce = getEthNonce(fromAddr);
            // 0xe209a49a0000000000000000000000000000000000000000000000000000000000000001

            // toAddr  0x0e7f42cdf739c06dd3c1c32fab5e50ec9620102a

            // tslint:disable-next-line:max-line-length
            const gasLimitPromise = api.estimateGas({ to: txPayload.toAddr, from:txPayload.fromAddr , value:txPayload.pay, data: txPayload.data });
            
            const chainNoncePromise = api.getTransactionCount(fromAddr);

            const [wlt,gasLimit,chainNonce] = await Promise.all([wltPromise,gasLimitPromise,chainNoncePromise]);
            if (!wlt) {
                return ['password error'];
            }

            // TODO  直接使用预估出来的gasLimit交易有可能失败   零时解决
            const newGasLimit = Math.floor(gasLimit * erc20GasLimitRate);
            let newNonce = nonce;
            if (!isNumber(nonce)) {
                newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
            }
            const txObj = {
                to: txPayload.toAddr,
                nonce: newNonce,
                gasPrice: fetchGasPrice(minerFeeLevel),
                gasLimit: newGasLimit,
                value: txPayload.pay,
                data: txPayload.data
            };         
            const tx = wlt.signRawTransaction(txObj);
            hash = await api.sendRawTransaction(tx);
        }
        if (hash) {
            txRecord.hash = hash;
            updateLocalTx(txRecord);
            dataCenter.updateAddrInfo(txRecord.addr,txRecord.currencyName);

            return [undefined,hash];
        } else {
            return ['send transaction failed'];
        }
    } catch (error) {
        return [error,undefined];
    }
};

/**
 * 普通转账
 */
export const transfer = async (psw:string,txPayload:TxPayload) => {
    const fromAddr = txPayload.fromAddr;
    const currencyName = txPayload.currencyName;
    const needConfirmedBlockNumber = getConfirmBlockNumber(currencyName, txPayload.pay);
    const txRecord:TxHistory = {
        hash:'',
        addr:fromAddr,
        txType:TxType.Transfer,
        fromAddr,
        toAddr:txPayload.toAddr,
        pay: txPayload.pay,
        time: 0,
        status:TxStatus.Pending,
        confirmedBlockNumber: 0,
        needConfirmedBlockNumber,
        info: '',
        currencyName,
        fee: txPayload.fee,
        nonce:undefined,
        minerFeeLevel:txPayload.minerFeeLevel
    };

    try {
        let ret: any;
        const addrIndex = getWltAddrIndex(fromAddr, currencyName);
        if (addrIndex >= 0) {
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(psw,addrIndex,txRecord);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(psw,addrIndex, txRecord);
                if (res) {
                    ret = {
                        hash:res.txid,
                        nonce:0
                    };
                }
            } else if (ERC20Tokens[currencyName]) {
                ret = await doERC20TokenTransfer(psw,addrIndex,txRecord);
            }
        }
        if (ret) {
            const tx = {
                ...txRecord,
                hash:ret.hash,
                nonce:ret.nonce,
                time:new Date().getTime()
            };
            updateLocalTx(tx);
            dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
            
            return [undefined,tx];
        } else {
            throw new Error('send transaction failed');
        }
    } catch (error) {
        return [error,undefined];
    }
};

// =====================================================ETH
/**
 * 预估ETH的gas limit
 */
export const estimateGasETH = async (toAddr:string,data?:any) => {
    const api = new EthApi();

    return api.estimateGas({ to: toAddr,data });
};

/**
 * 处理ETH转账
 */
export const doEthTransfer = async (psw:string,addrIndex:number,txRecord:TxHistory) => {
    const wltPromise = GlobalWallet.createWlt('ETH', psw, addrIndex);
    const api = new EthApi();
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const minerFeeLevel = txRecord.minerFeeLevel || MinerFeeLevel.Standard;
    const pay = txRecord.pay;
    const info = txRecord.info;
    const nonce = txRecord.nonce;
    const localNonce = getEthNonce(fromAddr);
    let chainNoncePromise;
    if (!isNumber(nonce)) {
        chainNoncePromise = api.getTransactionCount(fromAddr);
    } else {
        chainNoncePromise = Promise.resolve(localNonce);
    }
    const gasLimitPromise =  estimateGasETH(toAddr,info);

    const [wlt,chainNonce,gasLimit] = await Promise.all([wltPromise,chainNoncePromise,gasLimitPromise]);
    const newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
    const txObj = {
        to: toAddr,
        nonce: newNonce,
        gasPrice: fetchGasPrice(minerFeeLevel),
        gasLimit: gasLimit,
        value: eth2Wei(pay),
        data: info
    };
    const tx = wlt.signRawTransaction(txObj);
    const hash = await api.sendRawTransaction(tx);
    if (!isNumber(nonce) && hash) {
        setEthNonce(newNonce + 1,fromAddr);
    }
        
    return {
        hash,
        nonce:newNonce
    };

};

/**
 * ETH交易签名
 */
export const signRawTransactionETH = async (psw:string,fromAddr:string,toAddr:string,
    pay:number,minerFeeLevel:MinerFeeLevel,info?:string,nonce?:number) => {
    try {
        const addrIndex = getWltAddrIndex(fromAddr, 'ETH');
        if (addrIndex >= 0) {
            const wlt:EthWallet = await GlobalWallet.createWlt('ETH', psw, addrIndex);
            const api = new EthApi();
            if (!nonce) {
                const localNonce = getEthNonce(fromAddr);
                const chainNonce = await api.getTransactionCount(fromAddr);
                nonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
            }
            const gasLimit = await estimateGasETH(toAddr,info);
            const txObj = {
                to: toAddr,
                nonce: nonce,
                gasPrice: fetchGasPrice(minerFeeLevel),
                gasLimit: gasLimit,
                value: eth2Wei(pay),
                data: info
            };
            console.log('txObj--------------',txObj);

            return wlt.signRawTransactionHash(txObj);
        }
    } catch (error) {
        doErrorShow(error);
    }
};
/**
 * 发送ETH交易
 * @param signedTx 签名交易
 */
export const sendRawTransactionETH = async (signedTx) => {
    const api = new EthApi();
    let hash = '';
    try {
        hash = await api.sendRawTransaction(signedTx);
    } catch (err) {
        doErrorShow(err);
    }

    return hash;
};

// ==============================================ERC20
// 预估ETH ERC20Token的gas limit
export const estimateGasERC20 = (currencyName:string,toAddr:string,fromAddr:string,amount:number | string) => {
    const api = new EthApi();

    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(amount, currencyName));

    return api.estimateGas({ to: ERC20Tokens[currencyName].contractAddr,from:fromAddr, value:'0x0', data: transferCode });
};

/**
 * 处理eth代币转账
 */
// tslint:disable-next-line:max-line-length
export const doERC20TokenTransfer = async (psw:string,addrIndex:number, txRecord:TxHistory) => {
    const wltPromise = GlobalWallet.createWlt('ETH', psw, addrIndex);
    const api = new EthApi();
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const nonce = txRecord.nonce;
    const currencyName = txRecord.currencyName;
    const localNonce = getEthNonce(fromAddr);
    let chainNoncePromise;
    if (!isNumber(nonce)) {
        chainNoncePromise = api.getTransactionCount(fromAddr);
    } else {
        chainNoncePromise = Promise.resolve(localNonce);
    }
    const gasLimitPromise =  estimateGasERC20(currencyName,toAddr,fromAddr,'0x0');

    const [wlt,chainNonce,gasLimit] = await Promise.all([wltPromise,chainNoncePromise,gasLimitPromise]);
    const newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
    // TODO  零时解决
    const newGasLimit = Math.floor(gasLimit * 4);
    console.log('newGasLimit-------------',newGasLimit);
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(pay, currencyName));
    
    const txObj = {
        to: ERC20Tokens[currencyName].contractAddr,
        nonce: newNonce,
        gasPrice: fetchGasPrice(minerFeeLevel),
        gasLimit: newGasLimit,
        value: 0,
        data: transferCode
    };
    console.log('txObj---------------',txObj);
    const tx = wlt.signRawTransaction(txObj);

    const hash = await api.sendRawTransaction(tx);
    if (!isNumber(nonce) && hash) {
        setEthNonce(newNonce + 1,fromAddr);
    }

    return {
        hash,
        nonce:newNonce
    };
};

// ==================================================BTC
// 预估BTC矿工费
export const estimateMinerFeeBTC = async (nbBlocks: number = 12) => {
    return BtcApi.estimateFee(nbBlocks);
};

/**
 * 处理BTC转账
 */
export const doBtcTransfer = async (psw:string,addrIndex:number,txRecord:TxHistory) => {
    const wlt = await GlobalWallet.createWlt('BTC', psw, addrIndex);
    const toAddr = txRecord.toAddr;
    const pay = txRecord.pay;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const output = {
        toAddr,
        amount: pay,
        chgAddr: fromAddr
    };
    console.log('output----------------',output);
    wlt.unlock();
    await wlt.init();

    // const retArr = await wlt.buildRawTransaction(output, fetchBtcMinerFee(minerFeeLevel));
    const retArr = await wlt.buildRawTransactionFromSingleAddress(fromAddr,output, fetchBtcMinerFee(minerFeeLevel));
    wlt.lock();
    // const rawHexString: string = retArr[0];
    // console.log('rawTx',rawHexString);
    const rawHexString: string = retArr.rawTx;
    console.log('rawTx==========',rawHexString);

    return BtcApi.sendRawTransaction(rawHexString);
};

/**
 * btc重发
 */
export const resendBtcTransfer = async (psw:string,addrIndex:number,txRecord:TxHistory) => {
    const wlt = await GlobalWallet.createWlt('BTC', psw, addrIndex);
    const minerFeeLevel = txRecord.minerFeeLevel;
    const hash = txRecord.hash;
    wlt.unlock();
    await wlt.init();

    const retArr = await wlt.resendTx(hash, fetchBtcMinerFee(minerFeeLevel));
    wlt.lock();
    const rawHexString: string = retArr.rawTx;
    // console.log(rawHexString);

    return BtcApi.sendRawTransaction(rawHexString);
};
/**
 * BTC交易签名
 */
export const signRawTransactionBTC = async (psw:string,fromAddr:string,toAddr:string,
    pay:number,minerFeeLevel:MinerFeeLevel) => {
    try {
        const addrIndex = getWltAddrIndex(fromAddr, 'BTC');
        if (addrIndex >= 0) {
            const wlt:BTCWallet = await GlobalWallet.createWlt('BTC', psw, addrIndex);
            const output = {
                toAddr,
                amount: pay,
                chgAddr: fromAddr
            };
            console.log('output----------------',output);
            wlt.unlock();
            await wlt.init();

            // const retArr = await wlt.buildRawTransaction(output, fetchBtcMinerFee(minerFeeLevel));
            const retArr = await wlt.buildRawTransactionFromSingleAddress(fromAddr,output, fetchBtcMinerFee(minerFeeLevel));
            wlt.lock();

            return retArr;
        }
    } catch (error) {
        doErrorShow(error);
    }
};

/**
 * BTC重发交易签名
 */
export const resendSignRawTransactionBTC = async (hash:string,psw:string,fromAddr:string,minerFeeLevel:MinerFeeLevel) => {
    try {
        const addrIndex = getWltAddrIndex(fromAddr, 'BTC');
        if (addrIndex >= 0) {
            const wlt:BTCWallet = await GlobalWallet.createWlt('BTC', psw, addrIndex);
            wlt.unlock();
            await wlt.init();
            const retArr = await wlt.resendTx(hash, fetchBtcMinerFee(minerFeeLevel));
            wlt.lock();

            return retArr;
        }
    } catch (error) {
        doErrorShow(error);
    }
};

/**
 * 发送BTC交易
 * @param signedTx 签名交易
 */
export const sendRawTransactionBTC = async (rawHexString) => {
    let hash = '';
    try {
        const ret = await BtcApi.sendRawTransaction(rawHexString);
        hash = ret.txid;
    } catch (err) {
        doErrorShow(err);
    }

    return hash;
};

// ===================================================== 本地

// ================================重发

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
        const addrIndex = getWltAddrIndex(fromAddr, currencyName);
        if (addrIndex >= 0) {
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(psw,addrIndex,txRecord);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await resendBtcTransfer(psw,addrIndex, txRecord);
                console.log('btc res-----',res);
                ret = {
                    hash:res.txid,
                    nonce:-1
                };
            } else if (ERC20Tokens[currencyName]) {
                ret = await doERC20TokenTransfer(psw,addrIndex,txRecord);
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
        deletLocalTx(txRecord);
        updateLocalTx(tx);
        dataCenter.clearTxTimer(oldHash);// 删除定时器
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        popNewMessage(getStaticLanguage().transfer.againSuccess);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return ret;
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
            tx = await resendBtcRecharge(psw,txRecord);
        } else {
            tx = await ethRecharge(psw,txRecord);
        }
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    } finally {
        loading.callback(loading.widget);
    }
    if (tx) {
        const oldHash = txRecord.hash;
        deletLocalTx(txRecord);
        updateLocalTx(tx);
        dataCenter.clearTxTimer(oldHash);// 删除定时器
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        getRechargeLogs(tx.currencyName);
        popNewMessage(getStaticLanguage().transfer.againSuccess);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return tx.hash;
};

// ================================重发

export const recharge = async (psw:string,txRecord:TxHistory) => {
    let tx;
    const close = popNewLoading(getStaticLanguage().transfer.recharge);
    if (txRecord.currencyName === 'BTC') {
        tx = await btcRecharge(psw,txRecord);
    } else {
        tx = await ethRecharge(psw,txRecord);
    }
    close.callback(close.widget);
    if (tx) {
        popNewMessage(getStaticLanguage().transfer.rechargeSuccess);
        updateLocalTx(tx);
        console.log(`recharge tx is `,tx);
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        getRechargeLogs(tx.currencyName);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
        
        return tx.hash;
    }

};
/**
 * eth充值
 */
export const ethRecharge = async (psw:string,txRecord:TxHistory) => {
    const toAddr = await getBankAddr();
    if (!toAddr) return;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const gasPrice = fetchGasPrice(minerFeeLevel);
    const pay = txRecord.pay;
    const info = txRecord.info;
    const gasLimit = await estimateGasETH(toAddr,info);
    const minerFee = wei2Eth(gasLimit * fetchGasPrice(minerFeeLevel));
    let nonce = txRecord.nonce;
    const obj = await signRawTransactionETH(psw,fromAddr,toAddr,pay,minerFeeLevel,info,nonce);
    if (!obj) return;
    const signedTX = obj.signedTx;
    const hash = `0x${obj.hash}`;
    nonce = Number(obj.nonce);
    const canTransfer = await rechargeToServer(fromAddr,toAddr,hash,nonce,gasPrice,eth2Wei(pay));
    if (!canTransfer) return;
    const h = await sendRawTransactionETH(signedTX);
    if (!h) return;
    if (!txRecord.nonce) {
        setEthNonce(nonce + 1,fromAddr);
    }
    
    // 维护本地交易记录
    const t = new Date();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const record:TxHistory = {
        ...txRecord,
        nonce,
        hash,
        toAddr,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };

    return record;
};

/**
 * btc充值
 */
export const btcRecharge = async (psw:string,txRecord:TxHistory) => {
    const toAddr = await getBtcBankAddr();
    
    if (!toAddr) return;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const minerFee = fetchBtcMinerFee(minerFeeLevel);
    const obj =  await signRawTransactionBTC(psw,fromAddr,toAddr,pay,minerFeeLevel);
    if (!obj) return;
    const oldHash = txRecord.hash;
    const signedTX = obj.rawTx;
    const hash = obj.hash;
    const canTransfer = await btcRechargeToServer(toAddr,hash,btc2Sat(pay).toString(),minerFee,oldHash);
    if (!canTransfer) return;
    const h = await sendRawTransactionBTC(signedTX);
    if (!h) return;
    // 维护本地交易记录
    const t = new Date();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const record:TxHistory = {
        ...txRecord,
        hash,
        toAddr,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };

    return record;
};

/**
 * btc重发充值
 */
export const resendBtcRecharge = async (psw:string,txRecord:TxHistory) => {
    const toAddr = await getBtcBankAddr();
    
    if (!toAddr) return;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const minerFee = fetchBtcMinerFee(minerFeeLevel);
    const ret =  await resendSignRawTransactionBTC(txRecord.hash,psw,fromAddr,minerFeeLevel);
    if (!ret) return;
    const oldHash = txRecord.hash;
    const hash = ret.newTxid;
    const signedTx = ret.rawTx;
    const canTransfer = await btcRechargeToServer(toAddr,hash,btc2Sat(pay).toString(),minerFee,oldHash);
    if (!canTransfer) return;
    const h = await sendRawTransactionBTC(signedTx);
    if (!h) return;
    // 维护本地交易记录
    const t = new Date();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const record:TxHistory = {
        ...txRecord,
        hash,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };

    return record;
};

/**
 * 
 * 提现
 */
export const withdraw = async (passwd:string,toAddr:string,currencyName:string,amount:number | string) => {
    if (currencyName === 'BTC') {
        return btcWithdraw(passwd,toAddr,amount);
    } else {
        return ethWithdraw(passwd,toAddr,amount);
    }
};
// eth提现
export const ethWithdraw = async (passwd:string,toAddr:string,amount:number | string) => {
    const close = popNewLoading(getStaticLanguage().transfer.withdraw);
    const secretHash = await VerifyIdentidy(passwd);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(getStaticLanguage().transfer.wrongPsw);

        return;
    }
    const hash = await withdrawFromServer(toAddr,eth2Wei(amount),secretHash);
    close.callback(close.widget);
    if (hash) {
        popNewMessage(getStaticLanguage().transfer.withdrawSuccess);
        const tx:TxHistory = {
            hash,
            addr:toAddr,
            txType:TxType.Receipt,
            fromAddr:'',
            toAddr,
            pay: Number(amount),
            time: new Date().getTime(),
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName:'ETH',
            fee: 0,
            nonce:undefined
        };
        dataCenter.timerUpdateTxWithdraw(tx);
        getWithdrawLogs('ETH');
        updateLocalTx(tx);
    }
   
    return hash;
};

// btc提现
export const btcWithdraw = async (passwd:string,toAddr:string,amount:number | string) => {
    const close = popNewLoading(getStaticLanguage().transfer.withdraw);
    const secretHash = await VerifyIdentidy(passwd);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(getStaticLanguage().transfer.wrongPsw);

        return;
    }
    const hash = await btcWithdrawFromServer(toAddr,btc2Sat(amount).toString(),secretHash);
    close.callback(close.widget);
    if (hash) {
        popNewMessage(getStaticLanguage().transfer.withdrawSuccess);
        const tx:TxHistory = {
            hash,
            addr:toAddr,
            txType:TxType.Receipt,
            fromAddr:'',
            toAddr,
            pay: Number(amount),
            time: new Date().getTime(),
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName:'BTC',
            fee: 0,
            nonce:undefined
        };
        dataCenter.timerUpdateTxWithdraw(tx);
        getWithdrawLogs('BTC');
        updateLocalTx(tx);
    }
   
    return hash;
};