import { getLang } from '../../pi/util/lang';
import { Config, dev_mode, DevMode } from '../config';
import { MinerFeeLevel } from '../store/interface';

/**
 * 一些常用常量
 */

// 钱包数量最大限制
export const walletNumLimit = 10;
// 分页每页条目数量
export const PAGELIMIT = 10;

// 默认显示得ETH代币
export const defaultEthToken = [];

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC','TRX','BNB','WTC','VEN'];

// 默认不可更改显示货币列表
export const notSwtichShowCurrencys = ['ETH', 'BTC'];

//
export const strength = 128;

// todo 测试网络与正式网络切换
// btc网络
export const btcNetwork = dev_mode === DevMode.Prod ? 'mainnet' : 'testnet';

// 语言
export const lang = 'english';

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';

// 导航页广告
export const guidePages = [
    { imgUrl: 'img_security1.png', text: '' },
    { imgUrl: 'img_security2.png', text: '' },
    { imgUrl: 'img_security3.png', text: '' }
];

// 锁屏密码盐值
export const lockScreenSalt = 'salt';

// shapeshift api public key
// tslint:disable-next-line:max-line-length
export const shapeshiftApiPublicKey = '339a363550d4490fb4a0efae308440f4386c7d99ecf0f572584adc0400658b5799e3107eb0fe573c438e6d98b68dbe2ade2873aa7ac2fde8f74ab1be0750fdb2';

// shapeshift api private key
// tslint:disable-next-line:max-line-length
export const shapeshiftApiPrivateKey = 'c98210f4568b04d3f84c5404f8e5be98353849138ed26b3e2723223257d3cbb8bb5cba5060b7c4d44e746342a2eb43e26b9bb5827588d9ed3e712e85d35f054c';

// shapeshift autologin token
export const shapeshiftAutoToken = 'CZfRLxjor2E49vTfTZDjaeeR78nMMi1rKypV9GRBsmt2';

// 如果shapeshift交易记录返回[],请求的最多次数,超过默认没有交易记录
export const shapeshiftTransactionRequestNumber = 5;
// 发红包所支持的货币
export const redEnvelopeSupportCurrency = ['KT', 'ETH'];

// 默认ETH gasLimit
export const defaultGasLimit = 21000;

// 重发时间间隔(超过间隔还未成功即可重发)
export const resendInterval = 3 * 1000;

// 最小提现金额
export const withdrawLimit = {
    KT:1000,
    ETH:0.01,
    BTC:0.001
};

// 不同矿工费的到账时间
export const timeOfArrival = {
    ETH:[{
        level:MinerFeeLevel.Standard,
        text:{ zh_Hans:'标准',zh_Hant:'標準',en:'' },// 标准
        time:{ zh_Hans:'1-3分钟',zh_Hant:'1-3分鐘',en:'' }
    },{
        level:MinerFeeLevel.Fast,
        text:{ zh_Hans:'快',zh_Hant:'快',en:'' },// 快
        time:{ zh_Hans:'30-60秒',zh_Hant:'30-60秒',en:'' }
    },{
        level:MinerFeeLevel.Fastest,
        text:{ zh_Hans:'最快',zh_Hant:'最快',en:'' },// 最快
        time:{ zh_Hans:'10-30秒',zh_Hant:'10-30秒',en:'' }
    }],
    BTC:[{
        level:MinerFeeLevel.Standard,
        text:{ zh_Hans:'标准',zh_Hant:'標準',en:'' },// 标准
        time:{ zh_Hans:'2-3小时',zh_Hant:'2-3小時',en:'' }
    },{
        level:MinerFeeLevel.Fast,
        text:{ zh_Hans:'快',zh_Hant:'快',en:'' },// 快
        time:{ zh_Hans:'0.5-1小时',zh_Hant:'0.5-1小時',en:'' }
    },{
        level:MinerFeeLevel.Fastest,
        text:{ zh_Hans:'最快',zh_Hant:'最快',en:'' },// 最快
        time:{ zh_Hans:'1-30分钟',zh_Hant:'1-30分鐘',en:'' }
    }]
};

// 助记词片段分享最大数
export const MAX_SHARE_LEN = 3;
// 助记词片段分享最小数
export const MIN_SHARE_LEN = 2;

// 交易所需区块确认数
export const currencyConfirmBlockNumber = {
    ETH:[{
        value:1,
        number:7
    },{
        value:2,
        number:12
    },{
        value:4,
        number:16
    },{
        value:7,
        number:20
    },{
        value:10,
        number:30
    },{
        value:Number.MAX_VALUE,
        number:40
    }],
    BTC:[{
        value:0.1,
        number:2
    },{
        value:0.2,
        number:3
    },{
        value:0.4,
        number:4
    },{
        value:0.7,
        number:5
    },{
        value:1,
        number:6
    },{
        value:Number.MAX_VALUE,
        number:7
    }],
    ERC20:7
};

// 打开第三方查询网址eth
export const etherscanUrl = 'https://ropsten.etherscan.io/tx/';
// 打开第三方查询网址btc
export const blockchainUrl = 'https://testnet.blockchain.info/tx/';
// 火币api access key
const huobiApiAccessKey = '6fd70042-c5e4c618-d6e619ec-ecfa2';
// 火币API
export const huobiApi = `https://api.huobipro.com/market/history/kline?period=1day&size=1&AccessKeyId=${huobiApiAccessKey}&symbol=`;

/**
 * 一些指令
 */
export enum CMD {
    FORCELOGOUT = 1, // 强制下线保留数据
    FORCELOGOUTDEL = 2 // 强制下线删除数据
} 

/**
 * 调用本地文件url前缀
 */
export const localUrlPre = 'file:///';