import { dev_mode } from '../config';
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
export const defalutShowCurrencys = ['ETH', 'BTC','KT'];

//
export const strength = 128;

// todo 测试网络与正式网络切换
// btc网络
export const btcNetwork = dev_mode === 'dev' ? 'testnet' : 'mainnet';

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
        level:MinerFeeLevel.STANDARD,
        text:'标准',
        time:'1-3分钟'
    },{
        level:MinerFeeLevel.FAST,
        text:'快',
        time:'30-60秒'
    },{
        level:MinerFeeLevel.FASTEST,
        text:'最快',
        time:'10-30秒'
    }],
    BTC:[{
        level:MinerFeeLevel.STANDARD,
        text:'标准',
        time:'2-3小时'
    },{
        level:MinerFeeLevel.FAST,
        text:'快',
        time:'0.5-1小时'
    },{
        level:MinerFeeLevel.FASTEST,
        text:'最快',
        time:'0-30分钟'
    }]
};

//助记词片段分享最大数
export const MAX_SHARE_LEN = 3;
//助记词片段分享最小数
export const MIN_SHARE_LEN = 2;