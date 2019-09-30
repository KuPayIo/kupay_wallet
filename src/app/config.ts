import { defalutShowCurrencys,getModulConfig, sourceIp } from './public/config';

/**
 * config file
 */
// walletName
const walletName = getModulConfig('WALLET_NAME');

// 分享链接前缀
export const sharePerUrl = `http://${sourceIp}/browser/phoneRedEnvelope/openRedEnvelope.html`;

// 分享下载链接
export const shareDownload = `http://${sourceIp}/browser/phoneRedEnvelope/download.html?${Math.random()}`;

// 邀请好友下载链接
export const inviteFriends = `http://${sourceIp}/browser/phoneRedEnvelope/download.html?walletName=${walletName}`;

// 上传图片url
export const uploadFileUrl = `http://${sourceIp}/service/upload`;

/**
 * 提币手续费
 */
export const withdrawMinerFee = {
    ETH: 0.01,
    BTC: 0.001
};

/**
 * 一些常用常量
 */

// 首页默认显示的货币
export const preShowCurrencys = [...defalutShowCurrencys,'SC','KT'];

// 默认不可更改显示货币列表
export const notSwtichShowCurrencys = ['ETH', 'BTC'];

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

// 游客登录默认密码
export const defaultPassword = '123456789';

// 充值赠送KT倍数
export const rechargeGiftMultiple = 10;