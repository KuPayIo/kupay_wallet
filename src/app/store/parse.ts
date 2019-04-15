
import { isArray } from '../../pi/net/websocket/util';
import { uploadFileUrlPrefix } from '../config';
import { PAGELIMIT } from '../utils/constants';
// tslint:disable-next-line:max-line-length
import { currencyType, formatBalance, GetDateDiff,getStaticLanguage,parseRtype, timestampFormat, timestampFormatToDate, transDate, unicodeArray2Str } from '../utils/tools';
import { kpt2kt, sat2Btc, smallUnit2LargeUnit, wei2Eth } from '../utils/unitTools';
// tslint:disable-next-line:max-line-length
import { CloudCurrencyType, LuckyMoneyDetail, LuckyMoneyExchangeDetail, LuckyMoneySendDetail, MineRank, PurchaseHistory } from './interface';
import { getStore } from './memstore';
/**
 * 解析数据
 */
// ===================================================== 导入
// ===================================================== 导出
/**
 * 解析云端账号余额
 */
export const parseCloudBalance = (balanceInfo): Map<CloudCurrencyType, number> => {
    const m = new Map<CloudCurrencyType, number>();
    for (let i = 0; i < balanceInfo.value.length; i++) {
        const each = balanceInfo.value[i];
        m.set(each[0], smallUnit2LargeUnit(CloudCurrencyType[each[0]], each[1]));
    }
    
    return m;
};

/**
 * 后端定义的任务id
 */
export enum TaskSid {
    Mine = '11',                 // 游戏 实际上是appid
    Recharge = 301,            // 充值
    Withdraw = 302,            // 提现
    CreateWallet = 1001,       // 创建钱包
    FirstChargeEth = 1002,     // 以太坊首次转入
    BindPhone = 1003,          // 注册手机
    ChargeEth = 1004,          // 存币
    InviteFriends = 1005,      // 邀请真实好友
    BuyFinancial = 1007,       // 购买理财产品
    Transfer = 1008,           // 交易奖励
    Dividend = 1009,           // 分红
    Mining = 1010,             // 挖矿
    Chat = 1011,               // 聊天
    FinancialManagement = 330, // 理财
    LuckyMoney = 340,           // 红包
    LuckyMoneyRetreat = 341,     // 回退红包
    Wxpay = 370,                // 微信支付
    Alipay = 371,               // 支付宝支付
    Consume = 360,               // 消费
    Receipt = 361               // 收款
}

/**
 * 解析云端账号详情
 */
export const parseCloudAccountDetail = (coinType: string, infos) => {
    if (!infos) return [];
    const list = [];
    infos.forEach(v => {
        const itype = v[0];
        const amount = smallUnit2LargeUnit(coinType, v[1]);
        const detailTypes = getStaticLanguage().cloudAccountDetail.types;
        let behavior = '';
        let behaviorIcon = '';
        switch (itype) {
            case TaskSid.Mine:
                behavior = detailTypes[0];
                behaviorIcon = 'behavior1010.png';
                break;
            case TaskSid.InviteFriends:
                behavior = detailTypes[1];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.LuckyMoney: 
                behavior = amount > 0 ? detailTypes[2] : detailTypes[3];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.Recharge:
                behavior = detailTypes[4];
                behaviorIcon = 'cloud_charge_icon.png';
                break;
            case TaskSid.Withdraw:
                behavior = detailTypes[5];
                behaviorIcon = 'cloud_withdraw_icon.png';
                break;
            case TaskSid.FinancialManagement:
                behavior = detailTypes[6];
                behaviorIcon = 'behavior_manage_money_port.png';
                break;
            case TaskSid.LuckyMoneyRetreat:
                behavior = detailTypes[7];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.Wxpay: 
                behavior = coinType === 'KT' ? detailTypes[12] : detailTypes[8];
                behaviorIcon = 'wxpay_rechange.png';
                break;
            case TaskSid.Alipay:
                behavior = coinType === 'KT' ? detailTypes[12] : detailTypes[9];
                behaviorIcon = 'alipay_rechange.png';
                break;
            case TaskSid.Consume:
                behavior = detailTypes[10];
                behaviorIcon = 'transfer_icon.png';
                break;
            case TaskSid.Receipt:
                behavior = detailTypes[11];
                behaviorIcon = 'transfer_icon.png';
                break;
            default:
                behavior = isArray(v[2]) ? unicodeArray2Str(v[2]) : v[2];
        }
            
        list.push({
            itype,
            amount,
            behavior,
            behaviorIcon,
            oid:v[2],
            time: v[3]
        });
    });

    return list;
};
/**
 * 解析GT流水
 */
export const splitCloudCurrencyDetail = (list:any[]) => {
    const res = {
        rechangeList :[],
        withdrawList :[]
    };
    list.forEach(v => {
        if (v.amount > 0) {
            res.rechangeList.push(v);
        } else {
            res.withdrawList.push(v);
        }
    });

    return res;
};

/**
 * 处理矿山排名列表
 */
export const parseMineRank = (data) => {
    const mineData: MineRank = {
        page: 1,
        isMore: false,
        rank: [],
        myRank: data.me
    };
    if (data.value.length > 100) {
        mineData.isMore = true;
    } 
    const data1 = [];
    for (let i = 0; i < data.value.length && i < 100; i++) {
        const user = unicodeArray2Str(data.value[i][1]);
        const userData = user ? JSON.parse(user) :'' ;
        let avatar = userData ? userData.avatar :'';
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        }
        data1.push({
            index: data.value[i][3],
            name: userData ? userData.nickName :getStaticLanguage().userInfo.name,
            avatar,
            num : formatBalance(kpt2kt(data.value[i][2]))
        });
    }
    mineData.rank = data1;
    
    return mineData;
};

/**
 * 处理挖矿排名列表
 */
export const parseMiningRank = (data) => {
    const miningData = {
        rank: [],  // 排名列表
        miningRank: data.me  // 当前用户的排名
    };
    const res = [];

    for (let i = 0; i < data.value.length && i < 100; i++) {
        const user = unicodeArray2Str(data.value[i][2]);
        const userData = user ? JSON.parse(user) :'';
        let avatar = userData ? userData.avatar :'';
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        }  
        res.push({
            rank: data.value[i][4],  // 排名
            userName: userData ? userData.nickName :getStaticLanguage().userInfo.name, // 用户名称
            avatar,  // 头像
            ktNum: formatBalance(kpt2kt(data.value[i][3])),  // 嗨豆数量
            acc_id: data.value[i][0] // 用户 accId
        });
    }
    miningData.rank = res;
     
    return miningData;
   
};
/**
 * 解析挖矿历史记录
 */
export const parseMiningHistory = (data) => {
    const list = [];
    for (let i = 0; i < data.value.length; i++) {
        list.push({
            num: formatBalance(kpt2kt(data.value[i][0])),
            total: kpt2kt(data.value[i][1]),
            time: transDate(new Date(data.value[i][2]))
        });
    }
      
    const miningHistory = getStore('activity/mining/history');
    const rList = miningHistory && miningHistory.list || [];
    const start = String(data.start); 
    const canLoadMore = list.length > PAGELIMIT;

    return {
        list:rList.concat(list),
        start,
        canLoadMore
    };
};
/**
 * 解析分红历史记录
 */
export const parseDividHistory = (data) => {
    const list = [];
    for (let i = 0; i < data.value.length; i++) {
        list.push({
            num: kpt2kt(data.value[i][0]),
            total: kpt2kt(data.value[i][1]),
            time: transDate(new Date(data.value[i][2]))
        });
    }
      
    const dividHistory = getStore('activity/dividend/history');
    const rList = dividHistory && dividHistory.list || [];
    const start = String(data.start); 
    const canLoadMore = list.length > PAGELIMIT;

    return {
        list:rList.concat(list),
        start,
        canLoadMore
    };
};

/**
 * 解析矿山增加记录
 */
export const parseMineDetail = (detail) => {
    const list = [
        {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }
    ];
    if (detail.value.length !== 0) {
        for (let i = 0; i < detail.value.length; i++) {
            if (detail.value[i][0] === TaskSid.CreateWallet) {// 创建钱包
                list[0].isComplete = true;
                list[0].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.BindPhone) {// 注册手机号
                list[1].isComplete = true;
                list[1].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.ChargeEth) {// 存币
                list[2].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.InviteFriends) {// 与好友分享
                list[3].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.BuyFinancial) {// 购买理财
                list[4].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.Chat) {// 聊天
                list[5].isComplete = true;
                list[5].itemNum = kpt2kt(detail.value[i][1]);
            }
        }
    }

    return list;
};
/**
 * 解析充值提现记录
 */
export const parseRechargeWithdrawalLog = (coin,val) => {
    const infoList = [];
    if (coin === 'BTC') {
        for (let i = 0; i < val.length;i++) {
            const record = {
                time:val[i][3],
                amount:sat2Btc(val[i][1]),
                hash:val[i][2][0]
            };
            infoList.push(record);
        }
    } else {
        for (let i = 0; i < val.length;i++) {
            const record = {
                time:val[i][0],
                amount:wei2Eth(val[i][1]),
                hash:val[i][3]
            };
            infoList.push(record);
        }
    }
    
    return infoList;
};

/**
 * 解析购买记录
 */
const getproductById = (id:string) => {
    const productList = getStore('activity/financialManagement/products');
    for (let i = 0;i < productList.length;i++) {
        if (productList[i].id === id) {
            return productList[i];
        }
    }

    return null;
};

export const parsePurchaseRecord = (res:any) => {
    const record = [];
    for (let i = 0;i < res.value.length;i++) {
        const item = res.value[i];
        const id = item[0];
        const product = getproductById(id);
        const result:PurchaseHistory = {
            id,
            yesterdayIncoming:wei2Eth(item[2]),
            totalIncoming:wei2Eth(item[4]),
            profit:product.profit,
            productName:product.productName,
            unitPrice:product.unitPrice,// 产品列表获取TODO
            amount:item[3],
            coinType:product.coinType,// 产品列表获取TODO
            days:GetDateDiff(new Date(item[1]),new Date()).toString(),// 本地时间计算TODO
            purchaseDate:product.purchaseDate,
            interestDate:product.interestDate,
            endDate:product.endDate,
            purchaseTimeStamp:item[1],
            productIntroduction:product.productIntroduction,
            lockday:product.lockday,
            state:item[5]
        };
        
        record.push(result);
    }

    return record;
};
/**
 * 解析理财产品列表数据
 */
export const parseProductList = (res:any) => {
    const result = [];
    for (let i = 0;i < res.value.length;i++) {
        const item = res.value[i];
        const id = item[0];
        const product = getStaticLanguage().financialProductList[id];
        product.coinType = CloudCurrencyType[`${item[1]}`];
        product.unitPrice = wei2Eth(item[2]);
        product.total = item[3];
        product.surplus = item[3] - item[4];
        product.purchaseDate = timestampFormatToDate(new Date().getTime());
        if (product.surplus <= 0) {
            product.isSoldOut = true;
        } else {
            product.isSoldOut = false;
        }
        result.push(product);
    }

    return result;
};
/**
 * 解析发送红包历史记录
 */
export const parseSendRedEnvLog = (value,sta) => {
    const sHisRec = getStore('activity/luckyMoney/sends');
    let rList:LuckyMoneySendDetail[] = [];
    if (sta) {
        rList = sHisRec && sHisRec.list || [];
    }
    const sendNumber = value[0];
    const start = value[1];
    const recordList:LuckyMoneySendDetail[] = [];
    const r = value[2];
    for (let i = 0; i < r.length;i++) {
        const currencyName = CloudCurrencyType[r[i][2]];
        const otherDetail = parseExchangeDetail(r[i][6]);
        const record:LuckyMoneySendDetail = {
            rid:r[i][0].toString(),
            rtype:r[i][1],
            ctype:r[i][2],
            ctypeShow:currencyType(currencyName),
            amount:smallUnit2LargeUnit(currencyName,r[i][3]),
            time:r[i][4],
            timeShow:timestampFormat(r[i][4]),
            codes:r[i][5],
            curNum:otherDetail[2] || 0,
            totalNum:otherDetail[3] || 0
           
        };
        recordList.push(record);
    }
   
    return {
        start,
        sendNumber,
        list:rList.concat(recordList)
    };
};

/**
 * 解析红包兑换历史记录
 */
export const parseConvertLog = (data,sta) => {
    const cHisRec = getStore('activity/luckyMoney/exchange');
    let rList:LuckyMoneyExchangeDetail[] = [];
    if (sta) {
        rList = cHisRec && cHisRec.list || [];
    }
    const convertNumber = data.value[0];
    const startNext = data.value[1];
    const recordList:LuckyMoneyExchangeDetail[] = [];
    const r = data.value[2];
    for (let i = 0; i < r.length;i++) {
        const currencyName = CloudCurrencyType[r[i][3]];
        
        const record: LuckyMoneyExchangeDetail = {
            suid: r[i][0],
            rid: r[i][1].toString(),
            rtype: r[i][2],
            rtypeShow: parseRtype(r[i][2]),
            ctype: r[i][3],
            ctypeShow:currencyType(currencyName),
            amount: smallUnit2LargeUnit(currencyName, r[i][4]),
            time: r[i][5],
            timeShow: timestampFormat(r[i][5])
            
        };
        recordList.push(record);
    }
    
    return {
        start:startNext,
        convertNumber,
        list:rList.concat(recordList)
    };
};

/**
 * 解析红包兑换详情
 */
export const parseExchangeDetail = (value) => {
    const data = value[1];
    const redBagList:LuckyMoneyDetail[] = [];
    let curNum = 0;  
    let totalAmount = 0;  
    for (let i = 0;i < data.length;i++) {
        const amount = smallUnit2LargeUnit(CloudCurrencyType[data[i][3]],data[i][4]);
        if (data[i][1] !== 0 && data[i][5] !== 0) {
            const redBag:LuckyMoneyDetail = {
                suid:data[i][0],
                cuid:data[i][1],
                rtype:data[i][2],
                ctype:data[i][3],
                amount,
                time:data[i][5],
                timeShow:timestampFormat(data[i][5])
            };
            redBagList.push(redBag);
            curNum ++;
        }
        totalAmount += Number(data[i][4]);
    }
    const message = unicodeArray2Str(value[0]);
    totalAmount = smallUnit2LargeUnit(CloudCurrencyType[data[0][3]],totalAmount);

    return [redBagList, message, curNum, data.length, totalAmount]; // 兑换人员列表，红包留言，已兑换个数，总个数，红包总金额
};

/**
 * 解析我的邀请码被领取记录
 */
export const parseMyInviteRedEnv = (value) => {
    if (value) return;
    const data = value[1];
    const redBagList:LuckyMoneyDetail[] = [];
    let curNum = 0;    
    for (let i = 0;i < data.length;i++) {
        const amount = smallUnit2LargeUnit('ETH',data[i][1][0]);
        if (data[i][1] !== 0 && data[i][5] !== 0) {
            const redBag:LuckyMoneyDetail = {
                suid:0,
                cuid:data[i][0],
                rtype:99,
                ctype:100,
                amount,
                time:0,
                timeShow:''
            };
            redBagList.push(redBag);
            curNum ++;
        }
    }
    
    return [redBagList,curNum];
};
// ===================================================== 本地

// ===================================================== 立即执行