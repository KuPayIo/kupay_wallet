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

/**
 * 初始化设置
 */
export const defaultSetting = {
    DEFAULT_LANGUAGE:'zh_Hans',   // 默认语言 zh_Hans(中文简体),zh_Hant(中文繁体)
    DEFAULT_CURRENCY:'CNY',       // 默认货币 CNY,USD
    DEFAULT_CHANGECOLOR:'redUp'   // 默认涨跌颜色 redUp(红涨),greenUp(绿涨)
};

// walletName
const ktShow = getModulConfig('ktShow');

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