import { sourceIp } from './publicLib/config';
import { getModulConfig } from './publicLib/modulConfig';

/**
 * config file
 */
// walletName
const walletName = getModulConfig('WALLET_NAME');

// 向资源服务器请求第3方数据url prefix
export const thirdUrlPre = `http://${sourceIp}/proxy`;

// 分享链接前缀
export const sharePerUrl = `http://${sourceIp}/wallet/phoneRedEnvelope/openRedEnvelope.html`;

// 分享下载链接
export const shareDownload = `http://${sourceIp}/wallet/phoneRedEnvelope/download.html?${Math.random()}`;

// 邀请好友下载链接
export const inviteFriends = `http://${sourceIp}/wallet/phoneRedEnvelope/download.html?walletName=${walletName}`;

// 上传图片url
export const uploadFileUrl = `http://${sourceIp}/service/upload`;

/**
 * 提币手续费
 */
export const withdrawMinerFee = {
    ETH: 0.01,
    BTC: 0.001
};
