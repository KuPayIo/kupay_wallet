/**
 * 单位转换工具类
 */
import { ERC20Tokens } from '../config';
import { BigNumber } from '../res/js/bignumber';
import { SCPrecision } from './constants';
import { formatBalance } from './tools';

/**
 * 根据货币类型小单位转大单位  
 */
export const smallUnit2LargeUnit = (currencyName: string, amount: string | number): number => {
    let ret = 0;
    if (currencyName === 'ETH') {
        // tslint:disable-next-line:radix
        ret =  wei2Eth(parseInt(amount.toString()));
    } else if (currencyName === 'KT') {
        // tslint:disable-next-line:radix
        ret = kpt2kt(parseInt(amount.toString()));
    } else if (currencyName === 'BTC') {
        // tslint:disable-next-line:radix
        ret = sat2Btc(parseInt(amount.toString()));
    } else if (currencyName === 'ST') {
        // tslint:disable-next-line:radix
        ret = st2ST(parseInt(amount.toString()));
    } else if (currencyName === 'SC') {
        // tslint:disable-next-line:radix
        ret = parseInt(amount.toString()) / SCPrecision;
    }  else { // erc20
        // tslint:disable-next-line:radix
        ret = ethTokenDivideDecimals(parseInt(amount.toString()),currencyName);
    }

    return formatBalance(ret);
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

    return formatBalance(num / Math.pow(10, 8));
};

/**
 * btc转sat
 */
export const btc2Sat = (num: number | string) => {
    num = Number(num);

    return  Math.floor(num * Math.pow(10, 8));
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
 * st转ST
 */
export const st2ST = (num:number | string) => {
    num = Number(num);

    return num / Math.pow(10, 6);
};

/**
 * ST转st
 */
export const ST2st = (num:number | string) => {
    num = Number(num);

    return num * Math.pow(10, 6);
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