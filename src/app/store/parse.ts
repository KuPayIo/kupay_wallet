import { isArray } from '../../pi/net/websocket/util';
import { cloudCurrency } from '../config';
import { PAGELIMIT } from '../utils/constants';
// tslint:disable-next-line:max-line-length
import { formatBalance, GetDateDiff, getStaticLanguage,parseRtype,timestampFormat, timestampFormatToDate, transDate, unicodeArray2Str } from '../utils/tools';
import { kpt2kt, sat2Btc, smallUnit2LargeUnit, wei2Eth } from '../utils/unitTools';
// tslint:disable-next-line:max-line-length
import { CloudCurrencyType, MineRank, MiningRank, TaskSid, LuckyMoneySendDetail, LuckyMoneyExchangeDetail, LuckyMoneyDetail } from './interface';
import { getStore} from './memstore';
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
    if (!balanceInfo) {
        for (let i = 0; i < cloudCurrency.length;i++) {
            m.set(cloudCurrency[cloudCurrency[i]],0);
        }

        return m;
    }
    for (let i = 0; i < balanceInfo.value.length; i++) {
        const each = balanceInfo.value[i];
        m.set(each[0], smallUnit2LargeUnit(cloudCurrency[each[0]], each[1]));
    }
    m.set(CloudCurrencyType.CNYT,0);
    
    return m;
};

/**
 * 解析云端账号详情
 */
export const parseCloudAccountDetail = (coinType: string, infos): AccountDetail[] => {
    if (!infos) return [];
    const list = [];
    infos.forEach(v => {
        const itype = v[0];
        const amount = formatBalance(smallUnit2LargeUnit(coinType, v[1]));
        let behavior = '';
        let behaviorIcon = '';
        switch (itype) {
            case TaskSid.Mining:
                behavior = getStaticLanguage().cloudAccountDetail.types[0];
                behaviorIcon = 'behavior1010.png';
                break;
            case TaskSid.InviteFriends:
                behavior = getStaticLanguage().cloudAccountDetail.types[1];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.LuckyMoney: 
                behavior = amount > 0 ? getStaticLanguage().cloudAccountDetail.types[2] : getStaticLanguage().cloudAccountDetail.types[3];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.Recharge:
                behavior = getStaticLanguage().cloudAccountDetail.types[4];
                behaviorIcon = 'cloud_charge_icon.png';
                break;
            case TaskSid.Withdraw:
                behavior = getStaticLanguage().cloudAccountDetail.types[5];
                behaviorIcon = 'cloud_withdraw_icon.png';
                break;
            case TaskSid.FinancialManagement:
                behavior = getStaticLanguage().cloudAccountDetail.types[6];
                behaviorIcon = 'behavior_manage_money_port.png';
                break;
            default:
                behavior = isArray(v[2]) ? unicodeArray2Str(v[2]) : v[2];
        }
            
        list.push({
            itype,
            amount,
            behavior,
            behaviorIcon,
            time: v[3]
        });
    });

    return list;
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
    if (data.value.length > 10) {
        mineData.isMore = true;
    } 
    const data1 = [];
    for (let i = 0; i < data.value.length && i < 10; i++) {
        const user = unicodeArray2Str(data.value[i][1]);
        const userData = user ? JSON.parse(user) :'' ;
        data1.push({
            index: data.value[i][3],
            name: userData ? userData.nickName :getStaticLanguage().userInfo.name,
            avater: userData ? userData.avatar :'',
            num : kpt2kt(data.value[i][2])
        });
    }
    mineData.rank = data1;
    
    return mineData;
};

/**
 * 处理挖矿排名列表
 */
export const parseMiningRank = (data) => {
    const miningData: MiningRank = {
        page: 1,
        isMore: false,
        rank: [],
        myRank:data.me
    };

    if (data.value.length > 10) {
        miningData.isMore = true;
    } 
    const data2 = [];
    for (let i = 0; i < data.value.length && i < 10; i++) {
        const user = unicodeArray2Str(data.value[i][1]);
        const userData = user ? JSON.parse(user) :'';
        data2.push({
            index: data.value[i][3],
            name: userData ? userData.nickName :getStaticLanguage().userInfo.name,
            avater: userData ? userData.avatar :'',
            num: kpt2kt(data.value[i][2])
        });
    }
    miningData.rank = data2;
    
    return miningData;
};
/**
 * 解析挖矿历史记录
 */
export const parseMiningHistory = (data) => {
    const list = [];
    for (let i = 0; i < data.value.length; i++) {
        list.push({
            num: kpt2kt(data.value[i][0]),
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
    const productList = getStore('productList');
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
        const result:PurchaseRecordOne = {
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
        
        const record:LuckyMoneySendDetail = {
            rid:r[i][0].toString(),
            rtype:r[i][1],
            ctype:r[i][2],
            ctypeShow:currencyName,
            amount:smallUnit2LargeUnit(currencyName,r[i][3]),
            time:r[i][4],
            timeShow:timestampFormat(r[i][4]),
            codes:r[i][5]
           
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
            ctypeShow:currencyName,
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
 * 解析我的邀请红包被领取记录
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