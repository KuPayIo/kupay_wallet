/**
 * 主动向钱包通讯
 */
// ===================================================== 导入
import { popNew } from '../../pi/ui/root';
import { isNumber } from '../../pi/util/util';
import { defaultEthToAddr, ERC20Tokens } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet } from '../core/eth/wallet';
import { GlobalWallet } from '../core/globalWallet';
import { shapeshift } from '../exchange/shapeshift/shapeshift';
import { CurrencyType, MinerFeeLevel, priorityMap, TransRecordLocal } from '../store/interface';
import { find, getBorn, updateStore } from '../store/store';
import { shapeshiftApiPrivateKey, shapeshiftApiPublicKey, shapeshiftTransactionRequestNumber } from '../utils/constants';
import { doErrorShow } from '../utils/toolMessages';
import { formatBalance, fetchGasPrice, fetchBtcMinerFee } from '../utils/tools';
import { eth2Wei, ethTokenMultiplyDecimals, wei2Eth, btc2Sat } from '../utils/unitTools';
import { VerifyIdentidy } from '../utils/walletTools';
import { dataCenter } from '../logic/dataCenter';
import { getBankAddr, rechargeToServer, withdrawFromServer, getWithdrawLogs, getCloudBalance, getBtcBankAddr, btcRechargeToServer, btcWithdrawFromServer } from './pull';
// ===================================================== 导出

/**
 * 交易
 */
export const transfer = async (psw:string,txRecord:TransRecordLocal) => {
    const wallet = find('curWallet');
    const fromAddr = txRecord.fromAddr;
    const currencyName = txRecord.currencyName;
    let ret: any;
    const loading = popNew('app-components1-loading-loading', { text: '交易中...' });
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, currencyName);
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt(currencyName, psw, wallet, addrIndex);
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(<any>wlt,txRecord);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(<any>wlt, txRecord);
                ret = {
                    hash:res.txid,
                    nonce:0
                };
            } else if (ERC20Tokens[currencyName]) {
                ret = await doERC20TokenTransfer(<any>wlt,txRecord);
            }
        }
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    } finally {
        loading.callback(loading.widget);
    }
    if (ret) {
        const tx = {
            ...txRecord,
            hash:ret.hash,
            nonce:ret.nonce
        };
        
        // addRecord(currencyName, fromAddr, tx);
        const trans = find('transactions');
        trans.push(tx);
        updateStore('transactions',trans);
        dataCenter.refreshTrans(tx.fromAddr,tx.currencyName);
        popNew('app-components-message-message',{ content:'转账成功' });
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return ret;
};

/**
 * 预估矿工费
 * @param currencyName 货币名称
 * @param options 可选项,货币为ETH或ERC20时必传
 */
export const estimateMinerFee = async (currencyName:string) => {
    const toAddr = defaultEthToAddr;
    const pay = 0;
    let gasLimit = 21000;
    let btcMinerFee;
    if (currencyName === 'ETH') {
        gasLimit = await estimateGasETH(toAddr);
    } else if (currencyName === 'BTC') {
        // todo 获取BTC矿工费估值
        // for (const k in priorityMap) {
        //     const nbBlocks = priorityMap[k];
        //     const feeObj = await estimateMinerFeeBTC(nbBlocks);
        //     console.log('estimateMinerFee---------------',feeObj);
        //     btcMinerFee[nbBlocks] = formatBalance(feeObj[nbBlocks]);
        // }
        btcMinerFee = find('btcMinerFee');
    } else if (ERC20Tokens[currencyName]) {
        gasLimit = await estimateGasERC20(currencyName,toAddr,pay);
    }

    return {
        gasLimit,
        btcMinerFee
    };
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
export const doEthTransfer = async (wlt:EthWallet,txRecord:TransRecordLocal) => {
    const api = new EthApi();
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const minerFeeLevel = txRecord.minerFeeLevel || MinerFeeLevel.STANDARD;
    const pay = txRecord.pay;
    const info = txRecord.info;
    const nonce = txRecord.nonce;
    const nonceMap = getBorn('nonceMap');
    let newNonce = nonce;
    if (!isNumber(nonce)) {
        const localNonce = nonceMap.get(fromAddr);
        const chainNonce = await api.getTransactionCount(fromAddr);
        newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
        nonceMap.set(fromAddr,newNonce + 1);
    }
    const gasLimit = await estimateGasETH(toAddr,info);
    const txObj = {
        to: toAddr,
        nonce: newNonce,
        gasPrice: fetchGasPrice(minerFeeLevel),
        gasLimit: gasLimit,
        value: eth2Wei(pay),
        data: info
    };
    const tx = wlt.signRawTransaction(txObj);
    try {
        const hash = await api.sendRawTransaction(tx);
        if (!isNumber(nonce)) {
            updateStore('nonceMap',nonceMap);
        }
        
        return {
            hash,
            nonce:newNonce
        };
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    }

};

/**
 * ETH交易签名
 */
export const signRawTransactionETH = async (psw:string,fromAddr:string,toAddr:string,
    pay:number,minerFeeLevel:MinerFeeLevel,info?:string,nonce?:number) => {
    const wallet = find('curWallet');
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, 'ETH');
        if (addrIndex >= 0) {
            const wlt:EthWallet = await GlobalWallet.createWlt('ETH', psw, wallet, addrIndex);
            const api = new EthApi();
            if (!nonce) {
                const nonceMap = getBorn('nonceMap');
                const localNonce = nonceMap.get(fromAddr);
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
export const estimateGasERC20 = (currencyName:string,toAddr:string,amount:number) => {
    const api = new EthApi();

    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(amount, currencyName));

    return api.estimateGas({ to: ERC20Tokens[currencyName].contractAddr, data: transferCode });
};

/**
 * 处理eth代币转账
 */
// tslint:disable-next-line:max-line-length
export const doERC20TokenTransfer = async (wlt: EthWallet, txRecord:TransRecordLocal) => {
    const api = new EthApi();
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const nonce = txRecord.nonce;
    const currencyName = txRecord.currencyName;
    const nonceMap = getBorn('nonceMap');
    let newNonce = nonce;
    if (!isNumber(nonce)) {
        const localNonce = nonceMap.get(fromAddr);
        const chainNonce = await api.getTransactionCount(fromAddr);
        newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
        nonceMap.set(fromAddr,newNonce + 1);
    }
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(pay, currencyName));
    let gasLimit = await estimateGasERC20(currencyName,toAddr,pay);
    // TODO  零时解决
    gasLimit = Math.floor(gasLimit * 4);
    console.log('gasLimit-------------',gasLimit);
    const txObj = {
        to: ERC20Tokens[currencyName].contractAddr,
        nonce: newNonce,
        gasPrice: fetchGasPrice(minerFeeLevel),
        gasLimit: gasLimit,
        value: 0,
        data: transferCode
    };
    console.log('txObj---------------',txObj);
    const tx = wlt.signRawTransaction(txObj);

    try {
        const hash = await api.sendRawTransaction(tx);
        if (!isNumber(nonce)) {
            updateStore('nonceMap',nonceMap);
        }

        return {
            hash,
            nonce:newNonce
        };
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    }

};

// ==================================================BTC
// 预估BTC矿工费
export const estimateMinerFeeBTC = async (nbBlocks: number = 12) => {
    return BtcApi.estimateFee(nbBlocks);
};

/**
 * 处理BTC转账
 */
export const doBtcTransfer = async (wlt:BTCWallet,txRecord:TransRecordLocal) => {
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

    const retArr = await wlt.buildRawTransaction(output, fetchBtcMinerFee(minerFeeLevel));
    wlt.lock();
    const rawHexString: string = retArr[0];

    return BtcApi.sendRawTransaction(rawHexString);
};
/**
 * BTC交易签名
 */
export const signRawTransactionBTC = async (psw:string,fromAddr:string,toAddr:string,
    pay:number,minerFeeLevel:MinerFeeLevel) => {
    const wallet = find('curWallet');
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, 'BTC');
        if (addrIndex >= 0) {
            const wlt:BTCWallet = await GlobalWallet.createWlt('BTC', psw, wallet, addrIndex);
            const output = {
                toAddr,
                amount: pay,
                chgAddr: fromAddr
            };
            console.log('output----------------',output);
            wlt.unlock();
            await wlt.init();

            const retArr = await wlt.buildRawTransaction(output, fetchBtcMinerFee(minerFeeLevel));
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

// ===================================================shapeShift相关start
/**
 * 获取shapeShift所支持的币种
 */
export const getShapeShiftCoins = () => {
    shapeshift.coins((err, data) => {
        if (err) {
            console.error(err);

            return;
        }
        const list = [];
        for (const k in data) {
            list.push(data[k]);
        }
        updateStore('shapeShiftCoins', list);
    });
};
/**
 * 
 * @param pair 交易对
 */
export const getMarketInfo = (pair:string) => {
    shapeshift.marketInfo(pair, (err, marketInfo) => {
        if (err) {
            console.error(err);
            
            return;
        }
        updateStore('shapeShiftMarketInfo', marketInfo);
    });
};

/**
 * 开始进行币币兑换
 * @param withdrawalAddress 入账币种的地址
 * @param returnAddress 失败后的退款地址
 * @param pair 交易对
 */
export const beginShift = (withdrawalAddress:string,returnAddress:string,pair:string,success?:Function,fail?:Function) => {
    const options = {
        returnAddress,
        apiKey:shapeshiftApiPublicKey
    };
    shapeshift.shift(withdrawalAddress, pair, options, async (err, returnData) => {
        console.log('returnData',returnData);
        if (err) {
            fail && fail(err);

            return;
        }
        // ShapeShift owned BTC address that you send your BTC to
        // const depositAddress = returnData.deposit;
        
        // NOTE: `depositAmount`, `expiration`, and `quotedRate` are only returned if
        // you set `options.amount`

        // amount to send to ShapeShift (type string)
        // const shiftAmount = returnData.depositAmount;

        // Time before rate expires (type number, time from epoch in seconds)
        // const expiration = new Date(returnData.expiration * 1000);

        // rate of exchange, 1 BTC for ??? LTC (type string)
        // const rate = returnData.quotedRate;
        // you need to actually then send your BTC to ShapeShift
        // you could use module `spend`: https://www.npmjs.com/package/spend
        // CONVERT AMOUNT TO SATOSHIS IF YOU USED `spend`
        // spend(SS_BTC_WIF, depositAddress, shiftAmountSatoshis, function (err, txId) { /.. ../ })

        // later, you can then check the deposit status
        success && success(returnData);
    });
};

/**
 * 获取币币交易记录
 * @param addr 要获取交易记录的地址
 */
export const getTransactionsByAddr = async (addr: string) => {
    const addrLowerCase = addr.toLowerCase();
    const transactions = (addr: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            shapeshift.transactions(shapeshiftApiPrivateKey, addr, (err, transactions) => {
                if (err || transactions.length === 0) {
                    reject(err || new Error('null array'));
                }
                resolve(transactions);
            });
        });
    };
    const getTxByHash = (txs: any[], hash: string) => {
        for (let i = 0; i < txs.length; i++) {
            // tslint:disable-next-line:possible-timing-attack
            if (txs[i].inputTXID === hash) {
                return i;
            }
        }

        return -1;
    };
    const shapeShiftTxsMap = getBorn('shapeShiftTxsMap');
    const shapeShiftTxs =  shapeShiftTxsMap.get(addrLowerCase) || { addr:addrLowerCase,list:[] };
    let count = shapeshiftTransactionRequestNumber;
    while (count >= 0) {
        let txs;
        try {
            txs = await transactions(addrLowerCase);
        } catch (err) {
            // console.error(err);
        }
        if (txs) {
            console.log('shapeshifttx',txs);
            txs.forEach(tx => {
                const index = getTxByHash(shapeShiftTxs.list || [], tx.inputTXID);
                if (index >= 0) {
                    shapeShiftTxs.list[index] = tx;
                } else {
                    shapeShiftTxs.list.push(tx);
                }
            });
            shapeShiftTxsMap.set(addrLowerCase,shapeShiftTxs);
            updateStore('shapeShiftTxsMap',shapeShiftTxsMap);

            return;
        }
        count--;
        console.log(count);
    }
    updateStore('shapeShiftTxsMap',shapeShiftTxsMap);
};

// ===================================================shapeShift相关end

// ===================================================== 本地

// ================================重发

/**
 * 普通转账重发
 */
export const resendNormalTransfer = async (psw:string,txRecord:TransRecordLocal) => {
    console.log('----------resendNormalTransfer--------------');
    const loading = popNew('app-components1-loading-loading', { text: '重发中...' });
    const wallet = find('curWallet');
    const fromAddr = txRecord.fromAddr;
    const currencyName = txRecord.currencyName;
    let ret: any;
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, currencyName);
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt(currencyName, psw, wallet, addrIndex);
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(<any>wlt,txRecord);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(<any>wlt, txRecord);
                ret = {
                    hash:res.txid,
                    nonce:0
                };
            } else if (ERC20Tokens[currencyName]) {
                ret = await doERC20TokenTransfer(<any>wlt,txRecord);
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
        
        const trans = find('transactions');
        trans.push(tx);
        updateStore('transactions',trans);
        dataCenter.refreshTrans(tx.fromAddr,tx.currencyName);
        popNew('app-components-message-message',{ content:'重发成功' });
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return ret;
};
// ================================重发

export const recharge = async (psw:string,txRecord:TransRecordLocal)=>{
    if(txRecord.currencyName === 'BTC'){
        return btcRecharge(psw,txRecord);
    }else{
        return ethRecharge(psw,txRecord);
    }
}
/**
 * eth充值
 */
export const ethRecharge = async (psw:string,txRecord:TransRecordLocal) => {
    const close = popNew('app-components1-loading-loading', { text: '正在充值...' });
    const toAddr = await getBankAddr();
    if (!toAddr) {
        close.callback(close.widget);

        return;
    }
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const gasPrice = fetchGasPrice(minerFeeLevel);
    const pay = txRecord.pay;
    const info = txRecord.info;
    const gasLimit = await estimateGasETH(toAddr,info);
    const minerFee = wei2Eth(gasLimit * fetchGasPrice(minerFeeLevel));
    let nonce = txRecord.nonce;
    const obj = await signRawTransactionETH(psw,fromAddr,toAddr,pay,minerFeeLevel,info,nonce);
    if (!obj) {
        close.callback(close.widget);

        return;
    }
    const signedTX = obj.signedTx;
    const hash = `0x${obj.hash}`;
    nonce = Number(obj.nonce);
    const canTransfer = await rechargeToServer(fromAddr,toAddr,hash,nonce,gasPrice,eth2Wei(pay));
    if (!canTransfer) {
        close.callback(close.widget);

        return;
    }
    const h = await sendRawTransactionETH(signedTX);
    close.callback(close.widget);
    if (!h) return;
    if(!txRecord.nonce){
        const nonceMap = getBorn('nonceMap');
        nonceMap.set(fromAddr,nonce + 1);
        updateStore('nonceMap',nonceMap);
    }
    
    popNew('app-components-message-message',{ content:'充值成功' });
    // 维护本地交易记录
    const t = new Date();
    const record:TransRecordLocal = {
        ...txRecord,
        nonce,
        hash,
        toAddr,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };
    const trans = find('transactions');
    trans.push(record);
    updateStore('transactions',trans);
    dataCenter.refreshTrans(record.fromAddr,record.currencyName);
    popNew('app-view-wallet-transaction-transactionDetails', { hash:record.hash });
    return h;
};


/**
 * btc充值
 */
export const btcRecharge = async (psw:string,txRecord:TransRecordLocal) => {
    const close = popNew('app-components1-loading-loading', { text: '正在充值...' });
    const toAddr = await getBtcBankAddr();
    
    if (!toAddr) {
        close.callback(close.widget);

        return;
    }
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const minerFee = fetchBtcMinerFee(minerFeeLevel);
    const arr =  await signRawTransactionBTC(psw,fromAddr,toAddr,pay,minerFeeLevel);
    if(!arr){
        close.callback(close.widget);

        return;
    }
    const signedTX = arr[0];
    const hash = arr[2];
    const canTransfer = await btcRechargeToServer(toAddr,hash,btc2Sat(pay).toString(),minerFee);
    if (!canTransfer) {
        close.callback(close.widget);

        return;
    }
    const h = await sendRawTransactionBTC(signedTX);
    
    close.callback(close.widget);
    if (!h) return;
    popNew('app-components-message-message',{ content:'充值成功' });
    // 维护本地交易记录
    const t = new Date();
    const record:TransRecordLocal = {
        ...txRecord,
        hash,
        toAddr,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };
    const trans = find('transactions');
    trans.push(record);
    updateStore('transactions',trans);
    dataCenter.refreshTrans(record.fromAddr,record.currencyName);
    popNew('app-view-wallet-transaction-transactionDetails', { hash:record.hash });
    return h;
};

/**
 * 
 * 提现
 */
export const withdraw = async (passwd:string,toAddr:string,currencyName:string,amount:number | string) =>{
    if(currencyName === 'BTC'){
        return btcWithdraw(passwd,toAddr,amount);
    }else{
        return ethWithdraw(passwd,toAddr,currencyName,amount);
    }
}
// eth提现
export const ethWithdraw = async (passwd:string,toAddr:string,currencyName:string,amount:number | string) => {
    const wallet = find('curWallet');
    const close = popNew('app-components1-loading-loading', { text: '正在提现...' });
    const verify = await VerifyIdentidy(wallet,passwd);
    if (!verify) {
        close.callback(close.widget);
        popNew('app-components-message-message',{ content:'密码错误' });

        return;
    }
    const coin = Number(CurrencyType[currencyName]);
    const success = await withdrawFromServer(toAddr,coin,eth2Wei(amount));
    close.callback(close.widget);
    if (success) {
        popNew('app-components-message-message',{ content:'提现成功' });
        getWithdrawLogs(currencyName);
        getCloudBalance();
    }
   
    return success;
};





// btc提现
export const btcWithdraw = async (passwd:string,toAddr:string,amount:number | string) => {
    const wallet = find('curWallet');
    const close = popNew('app-components1-loading-loading', { text: '正在提现...' });
    const verify = await VerifyIdentidy(wallet,passwd);
    if (!verify) {
        close.callback(close.widget);
        popNew('app-components-message-message',{ content:'密码错误' });

        return;
    }
    const success = await btcWithdrawFromServer(toAddr,btc2Sat(amount).toString());
    close.callback(close.widget);
    if (success) {
        popNew('app-components-message-message',{ content:'提现成功' });
        getCloudBalance();
    }
   
    return success;
};