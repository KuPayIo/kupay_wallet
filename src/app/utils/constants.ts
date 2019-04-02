import { MinerFeeLevel } from '../store/interface';

/**
 * 一些常用常量
 */

// 分页每页条目数量
export const PAGELIMIT = 10;

// 默认显示得ETH代币
export const defaultEthToken = [];

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC','TRX','BNB','WTC','VEN'];

// 首页默认显示的货币
export const preShowCurrencys = [...defalutShowCurrencys,'SC','KT'];

// 默认不可更改显示货币列表
export const notSwtichShowCurrencys = ['ETH', 'BTC'];

//
export const strength = 128;

// 语言
export const lang = 'english';

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';

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

/**
 * 一些指令
 */
export enum CMD {
    FORCELOGOUT = 1, // 强制下线保留数据
    FORCELOGOUTDEL = 2 // 强制下线删除数据
} 

/**
 * 预估出来的erc20 gasLimit倍数
 */
export const erc20GasLimitRate = 2;

// 默认顶部留出40px高度
export const topHeight = 40;

// 游客登录默认密码
export const defaultPassword = '123456789';

// 充值赠送KT倍数
export const rechargeGiftMultiple = 10;

// SC单价
export const SCUnitprice =  1;

// SC精度
export const SCPrecision = 100;

// 微信支付显示
export const wxPayShow = 'HighApp';

// 美元默认汇率
export const USD2CNYRateDefault = 6;