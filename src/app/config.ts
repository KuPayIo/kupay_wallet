import { erlangLogicIp, erlangLogicPort, sourceIp, sourcePort } from './ipConfig';
import { getModulConfig } from './modulConfig';

/**
 * config file
 */

// walletName
const walletName = getModulConfig('WALLET_NAME');
const ktShow = getModulConfig('KT_SHOW');
// 向资源服务器请求第3方数据url prefix
export const thirdUrlPre = `http://${sourceIp}:${sourcePort}/proxy`;

// 分享链接前缀
export const sharePerUrl = `http://${sourceIp}:${sourcePort}/wallet/phoneRedEnvelope/openRedEnvelope.html`;

// 分享下载链接
export const shareDownload = `http://${sourceIp}:${sourcePort}/wallet/phoneRedEnvelope/download.html?${Math.random()}`;

// 邀请好友下载链接
export const inviteFriends = `http://${sourceIp}:${sourcePort}/wallet/phoneRedEnvelope/download.html?walletName=${walletName}`;

// 上传图片url
export const uploadFileUrl = `http://${sourceIp}:${sourcePort}/service/upload`;

// 上传的文件url前缀
export const uploadFileUrlPrefix = `http://${sourceIp}:${sourcePort}/service/get_file?sid=`;

// websock连接url
export const wsUrl = `ws://${erlangLogicIp}:${erlangLogicPort}`;

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

// 默认ETH ERC20转账地址,预估矿工费的时候使用
export const defaultEthToAddr = '0x040e7783A06e9b994F6e90DF5b2933C03F1b8F21';

/**
 * 所有单独ts文件中的静态文字
 */
export const Config = {
    /**
     * 简体中文
     */
    zh_Hans: {
        // 理财产品配置
        financialProductList: {
            60001: {
                id: 60001,// 产品id
                title: '优选理财-随存随取',// 产品标题
                profit: '8',// 预期年化收益
                productName: 'ETH资管第1期',// 产品名称
                productDescribe: '赎回T+0到账 | 0.1 ETH/份',// 首页显示的产品描述
                unitPrice: null,// 单价
                coinType: '',// 购买币种
                days: 'T+0',// 锁定日期
                total: 0,// 产品总量
                surplus: 0,// 剩余量
                purchaseDate: '无',// 起购日
                interestDate: '无',// 起息日
                endDate: '无',// 结束日
                productIntroduction: `ETH资管第1期是${walletName}推出的一种固定收益类，回报稳定、无风险定期产品。`,// 产品介绍
                limit: '5',// 购买上限
                lockday: '无',// 锁定期
                isSoldOut: true// 是否售完
            }
        },
        // 云端账户详情
        cloudAccountDetail: {
            types: [
                '游戏',
                '邀请码',
                '领红包',
                '发红包',
                '充值',
                '提现',
                '理财',
                '红包退回',
                '微信充值',
                '支付宝充值',
                '消费',
                '收款',
                '充值赠送'
            ]
        },
        // 红包相关
        luckeyMoney:{
            ordinary:'普通红包',
            random:'随机红包',
            invite:'邀请码'
        },
        // 购买理财
        bugProduct:{
            buying:'正在购买...',
            buySuccess:'购买成功',
            wrong:'密码错误'
        },
        // 矿工费相关
        minerFee:{
            standard:'标准',
            fast:'快',
            fastest:'慢',
            minute:'分钟',
            second:'秒',
            hour:'小时'
        },

        // 账户相关信息
        userInfo: {
            name: '昵称未设置',
            loading: '登录中...',
            exporting: '导出中...',
            loginSuccess: '登录成功',
            wrong: '错误',
            PswBoxInputTitle: '请输入支付密码'
        },
        // 转账交易相关信息
        transfer: {
            receipt:'收款',
            transfer:'转账',
            packing:'打包中',
            confirmed:'已确认',
            loading: '交易中...',
            transSuccess: '转账成功',
            againSend: '重发中...',
            againSuccess: '重发成功',
            recharge: '正在充值...',
            rechargeSuccess: '充值成功',
            withdraw: '正在提现...',
            withdrawSuccess: '提现成功',
            wrongPsw: '密码错误',
            rechargeTips: '充值已到账',
            transferFailed: '交易失败',
            completed:'已完成'
        },
        // 后台对应错误列表
        errorList: {
            22:  '次数超过限制',
            600: '数据库错误',
            701: '红包不存在',
            702: '红包已领完',
            703: '红包已过期',
            704: '红包已领取',
            705: '余额不足',
            711: '兑换码不存在',
            712: '兑换码已兑换',
            713: '兑换码已过期',
            714: '已兑换该红包',
            1001: '用户名为空',
            1002: '创建用户失败',
            1003: '用户注册失败',
            1004: '用户登录失败',
            1005: '手机号已被验证',
            1006: '权限验证错误',
            1007: '用户已存在',
            1008: '密保设置错误',
            1009: '验证密保设置错误',
            1010: '账号异常',
            2001: '挖矿达到上限',
            2010: '无法兑换自己的兑换码',
            2020: '重复充值',
            2021: '充值失败',
            2022: '提现失败',
            2023: '提现金额未达到下限',
            2024: '提现失败(服务未初始化))',
            2025: '提现金额达到上限',
            2030: '购买理财产品失败',
            2031: '出售理财产品失败',
            2032: '已出售',
            2033: '已售罄',
            3001: '黄金价格过期',
            3002: '订单不存在',
            3003: '用户未支付',
            3004: '金额错误',
            3005: '获取金价失败',
            3101: '微信支付请求失败',
            3102: '微信支付结果错误',
            3103: '微信支付订单查询失败',
            3104: '微信支付订单查询失败',
            3201: '支付宝支付请求失败',
            3202: '支付宝支付交易已关闭',
            3203: '支付宝支付订单查询失败',
            '-99': '你已经兑换了同类型的兑换码',
            '-300': '验证码超时',
            '-301': '验证码错误',
            default: '出错啦'
        },
        // 转账相关错误列表
        transError: [
            '密码错误',
            '余额不足',
            'gas过低',
            '交易失败',
            '交易已被确认'
        ],
        // KT 增加
        ktUp: {
            title: '备份助记词',
            content: `您的${ktShow}有增加，为了您的资产安全，建议您备份助记词`,
            sureText: '备份',
            cancelText: '以后'
        }

    },
    /**
     * 繁体中文
     */
    zh_Hant: {
        // 理财产品配置
        financialProductList: {
            60001: {
                id: 60001,// 产品id
                title: '優選理財-隨存隨取',// 产品标题
                profit: '8',// 预期年化收益
                productName: 'ETH資管第1期',// 产品名称
                productDescribe: '贖回T+0到賬 | 0.1 ETH/份',// 首页显示的产品描述
                unitPrice: null,// 单价
                coinType: '',// 购买币种
                days: 'T+0',// 锁定日期
                total: 0,// 产品总量
                surplus: 0,// 剩余量
                purchaseDate: '無',// 起购日
                interestDate: '無',// 起息日
                endDate: '無',// 结束日
                productIntroduction: `ETH資管第1期是${walletName}推出的一種固定收益類，回報穩定、無風險定期產品。`,// 产品介绍
                limit: '5',// 购买上限
                lockday: '無',// 锁定期
                isSoldOut: true// 是否售完
            }
        },
        // 云端账户详情
        cloudAccountDetail: {
            types: [
                '遊戲',
                '邀請碼',
                '領紅包',
                '發紅包',
                '充值',
                '提現',
                '理財',
                '紅包退回',
                '微信充值',
                '支付寶充值',
                '消費',
                '收款',
                '充值贈送'
            ]
        },
        // 红包相关
        luckeyMoney:{
            ordinary:'普通紅包',
            random:'隨機紅包',
            invite:'邀請碼'
        },
        // 购买理财
        bugProduct:{
            buying:'正在購買...',
            buySuccess:'購買成功',
            wrong:'密碼錯誤'
        },
        // 矿工费相关
        minerFee:{
            standard:'標準',
            fast:'快',
            fastest:'最快',
            minute:'分鐘',
            second:'秒',
            hour:'小時'
        },
        // 账户相关信息
        userInfo: {
            name: '暱稱未設置',
            loading: '登錄中...',
            exporting: '導出中...',
            loginSuccess: '登錄成功',
            wrong: '錯誤',
            PswBoxInputTitle: '請輸入支付密碼'
        },
        // 转账交易相关信息
        transfer: {
            receipt:'收款',
            transfer:'轉帳',
            packing:'打包中',
            confirmed:'已確認',
            loading: '交易中...',
            transSuccess: '轉賬成功',
            againSend: '重發中...',
            againSuccess: '重發成功',
            recharge: '正在充值...',
            rechargeSuccess: '充值成功',
            withdraw: '正在提現...',
            withdrawSuccess: '提現成功',
            wrongPsw: '密碼錯誤',
            rechargeTips: '充值已到賬',
            transferFailed:'交易失敗',
            completed:'已完成'
        },
        // 后台对应错误列表
        errorList: {
            22:  '次數超過限制',
            600: '數據庫錯誤',
            701: '紅包不存在',
            702: '紅包已領完',
            703: '紅包已過期',
            704: '紅包已領取',
            705: '餘額不足',
            711: '兌換碼不存在',
            712: '兌換碼已兌換',
            713: '兌換碼已過期',
            714: '已兌換該紅包',
            1001: '用戶名為空',
            1002: '創建用戶失敗',
            1003: '用戶註冊失敗',
            1004: '用戶登錄失敗',
            1005: '手機號已被驗證',
            1006: '權限驗證錯誤',
            1007: '用戶已存在',
            1008: '密保設置錯誤',
            1009: '驗證密保設置錯誤',
            1010: '賬號異常',
            2001: '挖礦達到上限',
            2010: '無法兌換自己的兌換碼',
            2020: '重複充值',
            2021: '充值失敗',
            2022: '提現失敗',
            2023: '提現金額未達到下限',
            2024: '提現失敗(服務未初始化))',
            2025: '提現金額達到上限',
            2030: '購買理財產品失敗',
            2031: '出售理財產品失敗',
            2032: '已出售',
            2033: '已售罄',
            3001: '黃金價格過期',
            3002: '訂單不存在',
            3003: '用戶未支付',
            3004: '金額錯誤',
            3005: '獲取金價失敗',
            3101: '微信支付請求失敗',
            3102: '微信支付結果錯誤',
            3103: '微信支付訂單查詢失敗',
            3104: '微信支付訂單查詢失敗',
            3201: '支付寶支付請求失敗',
            3202: '支付寶支付交易已關閉',
            3203: '支付寶支付訂單查詢失敗',
            '-99': '你已經兌換了同類型的兌換碼',
            '-300': '驗證碼超時',
            '-301': '驗證碼錯誤',
            default: '出错啦'
        },
        // 转账相关错误列表
        transError: [
            '密碼錯誤',
            '餘額不足',
            'gas過低',
            '交易失败',
            '交易已被確認'
        ],
        // 钱包创建成功
        ktUp: {
            title: '備份助記詞',
            content: `您的${ktShow}有增加，為了您的資產安全，建議您備份助記詞`,
            sureText: '備份',
            cancelText: '以後'
        }
    },
    /**
     * 英语
     */
    en: {

    }
};
/**
 * 提币手续费
 */
export const withdrawMinerFee = {
    ETH: 0.01,
    BTC: 0.001
};

/**
 * 初始化设置
 */
export const defaultSetting = {
    DEFAULT_LANGUAGE:'zh_Hans',   // 默认语言 zh_Hans(中文简体),zh_Hant(中文繁体)
    DEFAULT_CURRENCY:'CNY',       // 默认货币 CNY,USD
    DEFAULT_CHANGECOLOR:'redUp'   // 默认涨跌颜色 redUp(红涨),greenUp(绿涨)
};
