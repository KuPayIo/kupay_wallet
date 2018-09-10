/**
 * 主动向钱包通讯
 */
// ===================================================== 导入
import { defaultEthToAddr, ERC20Tokens } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet } from '../core/eth/wallet';
import { GlobalWallet } from '../core/globalWallet';
import { shapeshift } from '../exchange/shapeshift/shapeshift';
import { priorityMap } from '../store/interface';
import { find, getBorn, updateStore } from '../store/store';
// tslint:disable-next-line:max-line-length
import { shapeshiftApiPrivateKey, shapeshiftApiPublicKey, shapeshiftTransactionRequestNumber } from '../utils/constants';
import { doErrorShow } from '../utils/toolMessages';
import { formatBalance } from '../utils/tools';
import { eth2Wei, ethTokenMultiplyDecimals, wei2Eth } from '../utils/unitTools';
// ===================================================== 导出

/**
 * 交易
 */
// tslint:disable-next-line:max-line-length
export const transfer = async (psw:string,fromAddr:string,toAddr:string,gasPrice:number,pay:number,currencyName:string,info?:string,nonce?:number) => {
    const wallet = find('curWallet');
    let ret: any;
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, currencyName);
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt(currencyName, psw, wallet, addrIndex);
            if (currencyName === 'ETH') {
                ret = doEthTransfer(<any>wlt, fromAddr, toAddr, gasPrice, pay, info,nonce);
                console.log('--------------ret',ret);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(<any>wlt, fromAddr, toAddr, pay, info);
                ret = {
                    hash:res.txid,
                    nonce:0
                };
            } else if (ERC20Tokens[currencyName]) {
                ret = await doERC20TokenTransfer(<any>wlt, fromAddr, toAddr, gasPrice, pay,currencyName);
            }
        }
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
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
    const btcMinerFee:any = {};
    if (currencyName === 'ETH') {
        gasLimit = await estimateGasETH(toAddr);
    } else if (currencyName === 'BTC') {
        // todo 获取BTC矿工费估值
        for (const k in priorityMap) {
            const nbBlocks = priorityMap[k];
            const feeObj = await estimateMinerFeeBTC(nbBlocks);
            btcMinerFee[nbBlocks] = formatBalance(feeObj[nbBlocks]);
        }
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
const doEthTransfer = async (wlt:EthWallet, fromAddr:string,
     toAddr:string, gasPrice:number, value:number | string, info:string,nonce?:number) => {
    const api = new EthApi();
    const nonceMap = getBorn('nonceMap');
    if (!nonce) {
        const localNonce = nonceMap.get(fromAddr);
        const chainNonce = await api.getTransactionCount(fromAddr);
        nonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
        nonceMap.set(fromAddr,nonce + 1);
    }
    const gasLimit = await estimateGasETH(toAddr,info);
    const txObj = {
        to: toAddr,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: eth2Wei(value),
        data: info
    };
    console.log('txObj------------------',txObj);
    const tx = wlt.signRawTransaction(txObj);
    console.log('tx------------------',tx);
    try {
        const hash = await api.sendRawTransaction(tx);
        if (!nonce) {
            updateStore('nonceMap',nonceMap);
        }
        
        return {
            hash,
            nonce
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
    gasPrice:number,pay:number,info?:string,nonce?:number) => {
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
                nonceMap.set(fromAddr,nonce + 1);
                updateStore('nonceMap',nonceMap);
            }
            const gasLimit = await estimateGasETH(toAddr,info);
            const txObj = {
                to: toAddr,
                nonce: nonce,
                gasPrice: Number(gasPrice),
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
const doERC20TokenTransfer = async (wlt: EthWallet, fromAddr: string, toAddr: string, gasPrice: number,value: number, currencyName: string,nonce?:number) => {
    const api = new EthApi();
    const nonceMap = getBorn('nonceMap');
    if (!nonce) {
        const localNonce = nonceMap.get(fromAddr);
        const chainNonce = await api.getTransactionCount(fromAddr);
        nonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
        nonceMap.set(fromAddr,nonce + 1);
    }
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(value, currencyName));
    const gasLimit = await estimateGasERC20(currencyName,toAddr,value);
    console.log('gasLimit-------------',gasLimit);
    const txObj = {
        to: ERC20Tokens[currencyName],
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: 0,
        data: transferCode
    };
    console.log('txObj---------------',txObj);
    const tx = wlt.signRawTransaction(txObj);

    try {
        const hash = await api.sendRawTransaction(tx);
        if (!nonce) {
            updateStore('nonceMap',nonceMap);
        }

        return {
            hash,
            nonce
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
const doBtcTransfer = async (wlt:BTCWallet,acct1:string, acct2:string, value: number, info: string) => {
    const output = {
        toAddr: acct2,
        amount: value,
        chgAddr: acct1
    };
    console.log('output----------------',output);
    wlt.unlock();
    await wlt.init();

    const retArr = await wlt.buildRawTransaction(output, 'medium');
    wlt.lock();
    const rawHexString: string = retArr[0];

    return BtcApi.sendRawTransaction(rawHexString);
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
