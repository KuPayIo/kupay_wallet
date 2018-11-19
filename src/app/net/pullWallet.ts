/**
 * 主动向钱包通讯
 */
// ===================================================== 导入
import { popNew } from '../../pi/ui/root';
import { isNumber } from '../../pi/util/util';
import { Collapse } from '../components/collapse/collapse1';
import { defaultEthToAddr, ERC20Tokens } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet } from '../core/eth/wallet';
import { GlobalWallet } from '../core/globalWallet';
import { shapeshift } from '../exchange/shapeshift/shapeshift';
import { dataCenter } from '../logic/dataCenter';
import { MinerFeeLevel, TxHistory, TxStatus, TxType } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
import { shapeshiftApiPrivateKey, shapeshiftApiPublicKey, shapeshiftTransactionRequestNumber } from '../utils/constants';
import { doErrorShow } from '../utils/toolMessages';
// tslint:disable-next-line:max-line-length
import { deletLocalTx, fetchBtcMinerFee, fetchGasPrice, fetchMinerFeeList, getConfirmBlockNumber, getEthNonce, getStaticLanguage, popNewMessage, setEthNonce, updateLocalTx } from '../utils/tools';
import { btc2Sat, eth2Wei, ethTokenMultiplyDecimals, wei2Eth } from '../utils/unitTools';
import { getWltAddrIndex, VerifyIdentidy } from '../utils/walletTools';
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
    pay:string;             // 转账金额
    currencyName:string;    // 转账货币
    data:string;
}

/**
 * 普通转账
 */
export const transfer3 = async (psw:string,txPayload:TxPayload3) => {
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

    try {        
        const addrIndex = getWltAddrIndex(fromAddr, currencyName);
        let hash;
        if (addrIndex >= 0) {    
            // alert(1);
            const wlt = await GlobalWallet.createWlt(currencyName, psw, addrIndex);
            const api = new EthApi();
            const nonce = txRecord.nonce;
            const localNonce = getEthNonce(fromAddr);
            // 0xe209a49a0000000000000000000000000000000000000000000000000000000000000001
            // toAddr  0x0e7f42cdf739c06dd3c1c32fab5e50ec9620102a
            // api.estimateGas({ to: txPayload.toAddr, data: txPayload.data });
            // TODO  直接使用预估出来的gasLimit交易有可能失败   零时解决
            const gasLimit = Math.floor(21000 * 10);
            let newNonce = nonce;
            if (!isNumber(nonce)) {
                const chainNonce = await api.getTransactionCount(fromAddr);
                newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
            }
            const txObj = {
                to: txPayload.toAddr,
                nonce: newNonce,
                gasPrice: fetchGasPrice(minerFeeLevel),
                gasLimit: gasLimit,
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
export const transfer = async (psw:string,txPayload:TxPayload,success?:Function,fail?:Function) => {
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
            const wlt = await GlobalWallet.createWlt(currencyName, psw, addrIndex);
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(<any>wlt,txRecord);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(<any>wlt, txRecord);
                if (res) {
                    ret = {
                        hash:res.txid,
                        nonce:0
                    };
                }
            } else if (ERC20Tokens[currencyName]) {
                ret = await doERC20TokenTransfer(<any>wlt,txRecord);
            }
        }
        if (ret) {
            const tx = {
                ...txRecord,
                hash:ret.hash,
                nonce:ret.nonce,
                time:new Date().getTime()
            };
            success(tx);
        } else {
            throw new Error('send transaction failed');
        }
    } catch (error) {
        fail(error);
    }
};

/**
 * 交易
 */
export const transfer1 = async (psw:string,txRecord:TxHistory) => {
    const fromAddr = txRecord.fromAddr;
    const currencyName = txRecord.currencyName;
    let ret: any;
    const loading = popNew('app-components1-loading-loading', { text: getStaticLanguage().transfer.loading });
    try {
        const addrIndex = getWltAddrIndex(fromAddr, currencyName);
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt(currencyName, psw, addrIndex);
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(<any>wlt,txRecord);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(<any>wlt, txRecord);
                if (!res) {
                    popNewMessage(getStaticLanguage().transfer.transferFailed);

                } else {
                    ret = {
                        hash:res.txid,
                        nonce:0
                    };
                }
                
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
            nonce:ret.nonce,
            time:new Date().getTime()
        };
        console.log('transfer success',tx);
        updateLocalTx(tx);
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.transSuccess });
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
        btcMinerFee = getStore('third/btcMinerFee');
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
export const doEthTransfer = async (wlt:EthWallet,txRecord:TxHistory) => {
    const api = new EthApi();
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const minerFeeLevel = txRecord.minerFeeLevel || MinerFeeLevel.Standard;
    const pay = txRecord.pay;
    const info = txRecord.info;
    const nonce = txRecord.nonce;
    const localNonce = getEthNonce(fromAddr);
    let newNonce = nonce;
    if (!isNumber(nonce)) {
        const chainNonce = await api.getTransactionCount(fromAddr);
        newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
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
export const estimateGasERC20 = (currencyName:string,toAddr:string,amount:number) => {
    const api = new EthApi();

    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(amount, currencyName));

    return api.estimateGas({ to: ERC20Tokens[currencyName].contractAddr, data: transferCode });
};

/**
 * 处理eth代币转账
 */
// tslint:disable-next-line:max-line-length
export const doERC20TokenTransfer = async (wlt: EthWallet, txRecord:TxHistory) => {
    const api = new EthApi();
    const fromAddr = txRecord.fromAddr;
    const toAddr = txRecord.toAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const nonce = txRecord.nonce;
    const currencyName = txRecord.currencyName;
    const localNonce = getEthNonce(fromAddr);
    let newNonce = nonce;
    if (!isNumber(nonce)) {
        const chainNonce = await api.getTransactionCount(fromAddr);
        newNonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
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
export const doBtcTransfer = async (wlt:BTCWallet,txRecord:TxHistory) => {
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
export const resendBtcTransfer = async (wlt:BTCWallet,txRecord:TxHistory) => {
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
        setStore('third/shapeShiftCoins', list);
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
        setStore('third/shapeShiftMarketInfo', marketInfo);
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
    const shapeShiftTxsMap = getStore('third/shapeShiftTxsMap');
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
            setStore('third/shapeShiftTxsMap',shapeShiftTxsMap);

            return;
        }
        count--;
        console.log(count);
    }
    setStore('third/shapeShiftTxsMap',shapeShiftTxsMap);
};

// ===================================================shapeShift相关end

// ===================================================== 本地

// ================================重发

/**
 * 普通转账重发
 */
export const resendNormalTransfer = async (psw:string,txRecord:TxHistory) => {
    console.log('----------resendNormalTransfer--------------');
    const loading = popNew('app-components1-loading-loading', { text: getStaticLanguage().transfer.againSend });
    const fromAddr = txRecord.fromAddr;
    const currencyName = txRecord.currencyName;
    let ret: any;
    try {
        const addrIndex = getWltAddrIndex(fromAddr, currencyName);
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt(currencyName, psw, addrIndex);
            if (currencyName === 'ETH') {
                ret = await doEthTransfer(<any>wlt,txRecord);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await resendBtcTransfer(<any>wlt, txRecord);
                console.log('btc res-----',res);
                ret = {
                    hash:res.txid,
                    nonce:-1
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
        
        const oldHash = txRecord.hash;
        deletLocalTx(txRecord);
        updateLocalTx(tx);
        dataCenter.clearTxTimer(oldHash);// 删除定时器
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.againSuccess });
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return ret;
};

/**
 * 充值重发
 */
export const resendRecharge = async (psw:string,txRecord:TxHistory) => {
    console.log('----------resendRecharge--------------');
    const loading = popNew('app-components1-loading-loading', { text: getStaticLanguage().transfer.againSend });
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
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.againSuccess });
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return tx.hash;
};

// ================================重发

export const recharge = async (psw:string,txRecord:TxHistory) => {
    let tx;
    const close = popNew('app-components1-loading-loading', { text: getStaticLanguage().transfer.recharge });
    if (txRecord.currencyName === 'BTC') {
        tx = await btcRecharge(psw,txRecord);
    } else {
        tx = await ethRecharge(psw,txRecord);
    }
    close.callback(close.widget);
    if (tx) {
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.rechargeSuccess });
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
    const close = popNew('app-components1-loading-loading', { text: getStaticLanguage().transfer.withdraw });
    const verify = await VerifyIdentidy(passwd);
    if (!verify) {
        close.callback(close.widget);
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.wrongPsw });

        return;
    }
    const hash = await withdrawFromServer(toAddr,eth2Wei(amount));
    close.callback(close.widget);
    if (hash) {
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.withdrawSuccess });
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
    const close = popNew('app-components1-loading-loading', { text: getStaticLanguage().transfer.withdraw });
    const verify = await VerifyIdentidy(passwd);
    if (!verify) {
        close.callback(close.widget);
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.wrongPsw });

        return;
    }
    const hash = await btcWithdrawFromServer(toAddr,btc2Sat(amount).toString());
    close.callback(close.widget);
    if (hash) {
        popNew('app-components1-message-message',{ content:getStaticLanguage().transfer.withdrawSuccess });
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