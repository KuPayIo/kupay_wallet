import { MinerFeeLevel } from './interface';

/**
 * 配置
 */
declare var pi_update: any;
// tar zxvf xxx.tar.gz
// 资源服务器ip
// export const sourceIp = 'app.herominer.net' || '127.0.0.1';
export const sourceIp = pi_update.severIp || '127.0.0.1';

// 资源服务器port 有些手机浏览器显示端口号无法识别  全部使用默认端口
// export const sourcePort = pi_update.severPort || '80';

// erlang逻辑服务器ip
// app.herominer.net
export const erlangLogicIp = sourceIp; 

// erlang逻辑服务器port
export const erlangLogicPort = '2081';

 // websock连接url
export const wsUrl = `ws://${erlangLogicIp}:${erlangLogicPort}`;

console.log('sourceIp=',sourceIp);

console.log('erlangLogicIp=',erlangLogicIp);
console.log('erlangLogicPort=',erlangLogicPort);

// 上传的文件url前缀
export const uploadFileUrlPrefix = `http://${sourceIp}/service/get_file?sid=`;

/**
 * 预估出来的erc20 gasLimit倍数
 */
export const erc20GasLimitRate = 2;

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';

// 语言
export const lang = 'english';

// eth 长度
export const strength = 128;

// 主网的币种
export const MainChainCoin = {
    ETH: {
        description: 'Ethereum',
        rate: { CNY: 3337.01, USD: 517.42 }
    },
    BTC: {
        description: 'Bitcoin',
        rate: { CNY: 42868.55, USD: 6598.71 }
    }
};

// 分页每页条目数量
export const PAGELIMIT = 10;

/**
 * 环境配置
 */
export enum DevMode {
    Prod = 'prod',      // 发布环境
    Ropsten = 'ropsten',   // ropsten测试环境
    Rinkeby = 'rinkeby'   // rinkeby测试环境
}
// tslint:disable-next-line:variable-name
export const dev_mode:DevMode = DevMode.Ropsten;

// btc网络
export const btcNetwork = dev_mode === DevMode.Prod ? 'mainnet' : 'testnet';

// 主网erc20
const ERC20TokensMainnet = {
    TRX:{
        contractAddr:'0xf230b790e05390fc8295f4d3f60332c93bed42e2',
        description:'TRON',
        decimals:6
    },
    BNB:{
        contractAddr:'0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        description:'Binance Coin',
        decimals:18
    },
    WTC:{
        contractAddr:'0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74',
        description:'Walton',
        decimals:18
    },
    VEN:{
        contractAddr:'0xd850942ef8811f2a866692a623011bde52a462c1',
        description:'VeChain',
        decimals:18
    },
    MKR:{
        contractAddr:'0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        description:'Maker',
        decimals:18
    },
    OMG:{
        contractAddr:'0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
        description:'OmiseGO',
        decimals:18
    },
    ZRX:{
        contractAddr:'0xe41d2489571d322189246dafa5ebde1f4699f498',
        description:'ZRX',
        decimals:18
    },
    ZIL:{
        contractAddr:'0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
        description:'Zilliqa',
        decimals:12
    },
    AE:{
        contractAddr:'0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d',
        description:'Aeternity',
        decimals:18
    },
    ICX:{
        contractAddr:'0xb5a5f22694352c15b00323844ad545abb2b11028',
        description:'ICON',
        decimals:18
    },
    BTM:{
        contractAddr:'0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750',
        description:'Bytom',
        decimals:8
    },
    LINK:{
        contractAddr:'0x514910771af9ca656af840dff83e8264ecf986ca',
        description:'BAChainLinkT',
        decimals:18
    },
    REP:{
        contractAddr:'0x1985365e9f78359a9B6AD760e32412f4a445E862',
        description:'Reputation',
        decimals:18
    },
    GNT:{
        contractAddr:'0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
        description:'Golem',
        decimals:18
    },
    XPA:{
        contractAddr:'0x90528aeb3a2b736b780fd1b6c478bb7e1d643170',
        description:'XPlay',
        decimals:18
    },
    PPT:{
        contractAddr:'0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a',
        description:'Populous',
        decimals:8
    },
    SNT:{
        contractAddr:'0x744d70fdbe2ba4cf95131626614a1763df805b9e',
        description:'StatusNetwork',
        decimals:18
    },
    PRL:{
        contractAddr:'0x1844b21593262668b7248d0f57a220caaba46ab9',
        description:'Oyster Pearl',
        decimals:18
    },
    KCS:{
        contractAddr:'0x039b5649a59967e3e936d7471f9c3700100ee1ab',
        description:'KuCoin Shares',
        decimals:6
    },
    IOST:{
        contractAddr:'0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
        description:'IOStoken',
        decimals:18
    },
    AION:{
        contractAddr:'0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
        description:'AION',
        decimals:8
    },
    LRC:{
        contractAddr:'0xef68e7c694f40c8202821edf525de3782458639f',
        description:'Loopring ',
        decimals:18
    },
    DGD:{
        contractAddr:'0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
        description:'DigixDAO',
        decimals:9
    }
};

// 测试网erc20
const ERC20TokensRopsten = {
    TRX:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'TRON',
        decimals:6
    },
    BNB:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Binance Coin',
        decimals:6
    },
    WTC:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Walton',
        decimals:6
    },
    VEN:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'VeChain',
        decimals:6
    },
    MKR:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Maker',
        decimals:6
    },
    OMG:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'OmiseGO',
        decimals:6
    },
    ZRX:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'ZRX',
        decimals:6
    },
    ZIL:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Zilliqa',
        decimals:6
    },
    AE:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Aeternity',
        decimals:6
    },
    ICX:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'ICON',
        decimals:6
    },
    BTM:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Bytom',
        decimals:6
    },
    LINK:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'BAChainLinkT',
        decimals:6
    },
    REP:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Reputation',
        decimals:6
    },
    GNT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Golem',
        decimals:6
    },
    XPA:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'XPlay',
        decimals:6
    },
    PPT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Populous',
        decimals:6
    },
    SNT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'StatusNetwork',
        decimals:6
    },
    PRL:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Oyster Pearl',
        decimals:6
    },
    KCS:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'KuCoin Shares',
        decimals:6
    },
    IOST:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'IOStoken',
        decimals:6
    },
    AION:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'AION',
        decimals:6
    },
    LRC:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Loopring ',
        decimals:6
    },
    DGD:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'DigixDAO',
        decimals:6
    }
};

// 测试网rinkeby erc20
const ERC20TokensRinkeby = {
    TRX:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'TRON',
        decimals:6
    },
    BNB:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Binance Coin',
        decimals:6
    },
    WTC:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Walton',
        decimals:6
    },
    VEN:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'VeChain',
        decimals:6
    },
    MKR:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Maker',
        decimals:6
    },
    OMG:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'OmiseGO',
        decimals:6
    },
    ZRX:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'ZRX',
        decimals:6
    },
    ZIL:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Zilliqa',
        decimals:6
    },
    AE:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Aeternity',
        decimals:6
    },
    ICX:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'ICON',
        decimals:6
    },
    BTM:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Bytom',
        decimals:6
    },
    LINK:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'BAChainLinkT',
        decimals:6
    },
    REP:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Reputation',
        decimals:6
    },
    GNT:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Golem',
        decimals:6
    },
    XPA:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'XPlay',
        decimals:6
    },
    PPT:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Populous',
        decimals:6
    },
    SNT:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'StatusNetwork',
        decimals:6
    },
    PRL:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Oyster Pearl',
        decimals:6
    },
    KCS:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'KuCoin Shares',
        decimals:6
    },
    IOST:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'IOStoken',
        decimals:6
    },
    AION:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'AION',
        decimals:6
    },
    LRC:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'Loopring ',
        decimals:6
    },
    DGD:{
        contractAddr:'0x06561C88B07600d9cF423e6238502733c9Ca4c5B',
        description:'DigixDAO',
        decimals:6
    }
};

const getERC20Tokens = () => {
    let erc20Tokens = ERC20TokensMainnet;
    switch (dev_mode) {
        case DevMode.Ropsten:
            erc20Tokens = ERC20TokensRopsten;
            break;
        case DevMode.Rinkeby:
            erc20Tokens = ERC20TokensRinkeby;
            break;
        default: 
            erc20Tokens = ERC20TokensMainnet;
    }
    
    return erc20Tokens;
};

// 导出ERC20Tokens
export const ERC20Tokens = getERC20Tokens(); 

/**
 * 一些指令
 */
export enum CMD {
    FORCELOGOUT = 1, // 强制下线保留数据
    FORCELOGOUTDEL = 2 // 强制下线删除数据
} 

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

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC','TRX','BNB','WTC','VEN'];

// 美元默认汇率
export const USD2CNYRateDefault = 6;

// 默认ETH gasLimit
export const defaultGasLimit = 21000;

// 助记词片段分享最大数
export const MAX_SHARE_LEN = 3;
// 助记词片段分享最小数
export const MIN_SHARE_LEN = 2;

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

// 默认ETH ERC20转账地址,预估矿工费的时候使用
export const defaultEthToAddr = '0x040e7783A06e9b994F6e90DF5b2933C03F1b8F21';

// SC精度
export const SCPrecision = 100;