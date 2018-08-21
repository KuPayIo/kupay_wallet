/**
 * 主动向钱包通讯
 */
// ===================================================== 导入
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { ERC20Tokens } from '../core/eth/tokens';
import { EthWallet } from '../core/eth/wallet';
import { eth2Wei, GlobalWallet, wei2Eth } from '../core/globalWallet';
import { shapeshift } from '../exchange/shapeshift/shapeshift';
import { find, getBorn, updateStore } from '../store/store';
import { shapeshiftApiPrivateKey, shapeshiftApiPublicKey, shapeshiftTransactionRequestNumber } from '../utils/constants';
import { doErrorShow } from '../utils/toolMessages';
import { ethTokenMultiplyDecimals } from '../utils/tools';
// ===================================================== 导出

/**
 * 交易
 */
// tslint:disable-next-line:max-line-length
export const transfer = async (psw:string,fromAddr:string,toAddr:string,gasPrice:number,gasLimit:number,pay:number,currencyName:string,info?:string) => {
    const wallet = find('curWallet');
    let hash: string;
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, currencyName);
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt(currencyName, psw, wallet, addrIndex);
            if (currencyName === 'ETH') {
                hash = await doEthTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, pay, info);
            } else if (currencyName === 'BTC') {
                const res = await doBtcTransfer(<any>wlt, fromAddr, toAddr, pay, info);
                hash = res.txid;
            } else if (ERC20Tokens[currencyName]) {
                hash = await doERC20TokenTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, pay, currencyName);
            }
        }
        console.log('transfer hash',hash);
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    }

    return hash;
};
/**
 * 预估矿工费
 * @param currencyName 货币名称
 * @param options 可选项,货币为ETH或ERC20时必传
 */
export const estimateMinerFee = async (currencyName:string,options?:{toAddr:string;pay:number;gasPrice:number}) => {
    console.log('options',options);
    let gasLimit = 21000;
    let fee = 0;
    if (currencyName === 'ETH') {
        gasLimit = await estimateGasETH(options.toAddr);
        fee = gasLimit * wei2Eth(options.gasPrice);
    } else if (currencyName === 'BTC') {
        // todo 获取BTC矿工费估值
        const nbBlocks = 2;
        const feeObj = await estimateMinerFeeBTC(nbBlocks);
        gasLimit = 0;
        fee = feeObj[nbBlocks];
    } else if (ERC20Tokens[currencyName]) {
        gasLimit = await estimateGasERC20(currencyName,options.toAddr,options.pay);
        // 临时解决方案
        gasLimit  = gasLimit * 2;
        fee = gasLimit * wei2Eth(options.gasPrice);
    }

    return {
        minerFee:fee,
        gasLimit
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
     toAddr:string, gasPrice:number, gasLimit:number, value:number | string, info:string) => {
    const api = new EthApi();
    const localNonce = find('nonce');
    const chainNonce = await api.getTransactionCount(fromAddr);
    const nonce = localNonce > chainNonce ? localNonce : chainNonce;
    updateStore('nonce',nonce + 1);
    const txObj = {
        to: toAddr,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: eth2Wei(value),
        data: info
    };
    console.log('txObj',txObj);
    const tx = wlt.signRawTransaction(txObj);

    return api.sendRawTransaction(tx);

};

/**
 * ETH交易签名
 */
export const signRawTransactionETH = async (psw:string,fromAddr:string,toAddr:string,
    gasPrice:number,gasLimit:number,pay:number,info?:string) => {
    const wallet = find('curWallet');
    try {
        const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, 'ETH');
        if (addrIndex >= 0) {
            const wlt:EthWallet = await GlobalWallet.createWlt('ETH', psw, wallet, addrIndex);
            const api = new EthApi();
            const localNonce = find('nonce');
            const chainNonce = await api.getTransactionCount(fromAddr);
            const nonce = localNonce > chainNonce ? localNonce : chainNonce;
            updateStore('nonce',nonce + 1);
            const txObj = {
                to: toAddr,
                nonce: nonce,
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                value: eth2Wei(pay),
                data: info
            };

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

    return api.estimateGas({ to: ERC20Tokens[currencyName], data: transferCode });
};

/**
 * 处理eth代币转账
 */
const doERC20TokenTransfer = async (wlt: EthWallet, fromAddr: string, toAddr: string, gasPrice: number, gasLimit: number
    , value: number, currencyName: string) => {
    const api = new EthApi();
    const localNonce = find('nonce');
    const chainNonce = await api.getTransactionCount(fromAddr);
    const nonce = localNonce > chainNonce ? localNonce : chainNonce;
    updateStore('nonce',nonce + 1);
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(value, currencyName));
    const txObj = {
        to: ERC20Tokens[currencyName],
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: 0,
        data: transferCode
    };

    const tx = wlt.signRawTransaction(txObj);

    return api.sendRawTransaction(tx);

};

// ==================================================BTC
// 预估BTC矿工费
export const estimateMinerFeeBTC = async (nbBlocks: number = 2) => {
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

// ==========================================提现gasPrice获取,后台服务器也使用此接口
export const fetchWithdrawGasPrice = () => {
    // todo
};
// ===================================================== 本地
