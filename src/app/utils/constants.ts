import { defalutShowCurrencys } from '../publicLib/config';

/**
 * 一些常用常量
 */

// 默认显示得ETH代币
export const defaultEthToken = [];

// 首页默认显示的货币
export const preShowCurrencys = [...defalutShowCurrencys,'SC','KT'];

// 默认不可更改显示货币列表
export const notSwtichShowCurrencys = ['ETH', 'BTC'];

// 发红包所支持的货币
export const redEnvelopeSupportCurrency = ['KT', 'ETH'];

// 重发时间间隔(超过间隔还未成功即可重发)
export const resendInterval = 3 * 1000;

// 最小提现金额
export const withdrawLimit = {
    KT:1000,
    ETH:0.01,
    BTC:0.001
};

// 打开第三方查询网址eth
export const etherscanUrl = 'https://ropsten.etherscan.io/tx/';
// 打开第三方查询网址btc
export const blockchainUrl = 'https://testnet.blockchain.info/tx/';

// 默认顶部留出40px高度
export const topHeight = 40;

// 游客登录默认密码
export const defaultPassword = '123456789';

// 充值赠送KT倍数
export const rechargeGiftMultiple = 10;

// SC单价
export const SCUnitprice =  1;

// 微信支付显示
export const wxPayShow = 'HighApp';
