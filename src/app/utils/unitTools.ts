/**
 * 单位转换工具类
 */
import { ERC20Tokens } from '../config';
import { BigNumber } from '../res/js/bignumber';
import { formatBalance } from './tools';

/**
 * 根据货币类型小单位转大单位  
 */
export const smallUnit2LargeUnit = (currencyName: string, amount: string | number): number => {
    if (currencyName === 'ETH') {
        return formatBalance(wei2Eth(amount));
    } else if (currencyName === 'KT') {
        return formatBalance(kpt2kt(Number(amount)));
    } else if (currencyName === 'BTC') {
        return formatBalance(sat2Btc(Number(amount)));
    } else { // erc20
        return formatBalance(ethTokenDivideDecimals(Number(amount),currencyName));
    }
};

/**
 * 根据货币类型大单位转小单位 
 */
export const largeUnit2SmallUnit = (currencyName: string, amount: number | string): string => {
    if (currencyName === 'ETH') {
        return Number(eth2Wei(amount)).toString(10);
    } else if (currencyName === 'KT') {
        return kt2kpt(Number(amount)).toString(10);
    } else if (currencyName === 'BTC') {
        return btc2Sat(Number(amount)).toString(10);
    } else { // erc20
        return Number(ethTokenMultiplyDecimals(Number(amount),currencyName)).toString(10);
    }
};

/**
 * eth 2 wei
 */
export const eth2Wei = (amount:number|string):string => {
    const decimals = new BigNumber('1000000000000000000');
    const balance = decimals.times(amount);

    return  `0x${balance.toString(16)}`;
};

/**
 * wei 2 eth
 */
export const wei2Eth = (amount:string|number):number => {
    const decimals = BigNumber('1000000000000000000');
    const wei = new BigNumber(amount);
    
    const balance = wei.div(decimals);

    return formatBalance(Number(balance.toString(10)));
};

/**
 * sat转btc
 */
export const sat2Btc = (num: number | string) => {
    num = Number(num);

    return num / Math.pow(10, 8);
};

/**
 * btc转sat
 */
export const btc2Sat = (num: number | string) => {
    num = Number(num);

    return num * Math.pow(10, 8);
};

/**
 * kpt转kt
 */
export const kpt2kt = (num: number | string) => {
    num = Number(num);

    return num / Math.pow(10, 9);
};

/**
 * kt转kpt
 */
export const kt2kpt = (num: number | string) => {
    num = Number(num);

    return num * Math.pow(10, 9);
};

/**
 * eth 代币除以精度计算
 */
export const ethTokenDivideDecimals = (amount: string | number, tokenName: string) => {
    const decimals = BigNumber(Math.pow(10,ERC20Tokens[tokenName].decimals));

    const bigNum = new BigNumber(amount);
    
    const balance = bigNum.div(decimals);

    return Number(balance.toString(10));
};
/**
 * eth 代币乘以精度计算
 */
export const ethTokenMultiplyDecimals = (amount: string | number, tokenName: string) => {
    const decimals = BigNumber(Math.pow(10,ERC20Tokens[tokenName].decimals));
    const balance = decimals.times(amount);
    
    return  `0x${balance.toString(16)}`;
};