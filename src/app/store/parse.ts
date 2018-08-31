import { isArray } from '../../pi/net/websocket/util';
import { deepCopy } from '../../pi/util/util';
import { financialProductList } from '../config';
// tslint:disable-next-line:max-line-length
import { formatBalance, GetDateDiff, timestampFormat,timestampFormatToDate,unicodeArray2Str } from '../utils/tools';
import { kpt2kt, smallUnit2LargeUnit, wei2Eth } from '../utils/unitTools';
import { AccountDetail, CurrencyType, CurrencyTypeReverse, PurchaseRecordOne,TaskSid } from './interface';
import { find } from './store';
/**
 * 解析数据
 */
// ===================================================== 导入
// ===================================================== 导出
/**
 * 解析云端账号余额
 */
export const parseCloudBalance = (balanceInfo): Map<CurrencyType, number> => {
    const m = new Map<CurrencyType, number>();
    for (let i = 0; i < balanceInfo.value.length; i++) {
        const each = balanceInfo.value[i];
        m.set(each[0], smallUnit2LargeUnit(CurrencyTypeReverse[each[0]], each[1]));
    }

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
            case TaskSid.mines:
                behavior = '挖矿';
                behaviorIcon = 'cloud_others_drag.png';
                break;
            case TaskSid.inviteFriends:
                behavior = '邀请红包';
                behaviorIcon = 'cloud_others_pockets.png';
                break;
            case TaskSid.redEnvelope: 
                behavior = amount > 0 ? '领红包' : '发红包';
                behaviorIcon = 'cloud_others_pockets.png';
                break;
            case TaskSid.recharge:
                behavior = '充值';
                behaviorIcon = 'cloud_charge_icon.png';
                break;
            case TaskSid.withdraw:
                behavior = '提现';
                behaviorIcon = 'cloud_withdraw_icon.png';
                break;
            case TaskSid.financialManagement:
                behavior = '理财买入';
                behaviorIcon = 'financialManagement_icon_cloud.png';
                break;
            default:
                behavior = isArray(v[2]) ? unicodeArray2Str(v[2]) : v[2];
        }
            
        list.push({
            itype,
            amount,
            behavior,
            behaviorIcon,
            time: timestampFormat(v[3])
        });
    });

    return list.reverse();
};

/**
 * 处理矿山排名列表
 */
export const parseMineRank = (data) => {
    const mineData: any = {
        mineSecond: false,
        mineThird: false,
        minePage: 1,
        mineMore: false,
        mineList: data.value,
        mineRank: [
            {
                index: 1,
                name: '昵称未设置',
                num: '0'
            }
        ],
        myRank: data.me
    };
    if (data.value.length > 10) {
        mineData.mineMore = true;
        mineData.mineSecond = true;
        mineData.mineThird = true;
    } else if (data.value.length > 2) {
        mineData.mineSecond = true;
        mineData.mineThird = true;
    } else if (data.value.length > 1) {
        mineData.mineSecond = true;
    }
    const data1 = [];
    for (let i = 0; i < data.value.length && i < 10; i++) {
        data1.push({
            index: i + 1,
            name: data.value[i][1] === '' ? '昵称未设置' : data.value[i][1],
            num: kpt2kt(data.value[i][2])
        });
    }
    mineData.mineRank = data1;
    
    return mineData;
};

/**
 * 处理挖矿排名列表
 */
export const parseMiningRank = (data) => {
    const miningData: any = {
        miningSecond: false,
        miningThird: false,
        miningFirst: true,
        miningPage: 1,
        miningMore: false,
        miningList: data.value,
        miningRank: [
            {
                index: 1,
                name: '昵称未设置',
                num: '0'
            }
        ]
    };
    if (data.value === '') {
        miningData.miningFirst = false;
        
        return miningData;
    }

    if (data.value.length > 10) {
        miningData.miningMore = true;
        miningData.miningSecond = true;
        miningData.miningThird = true;
    } else if (data.value.length > 2) {
        miningData.miningSecond = true;
        miningData.miningThird = true;
    } else if (data.value.length > 1) {
        miningData.miningSecond = true;
    }
    const data2 = [];
    for (let i = 0; i < data.value.length && i < 10; i++) {
        data2.push({
            index: i + 1,
            name: data.value[i][1] === '' ? '昵称未设置' : data.value[i][1],
            num: kpt2kt(data.value[i][2])
        });
    }
    miningData.miningRank = data2;
    
    return miningData;
};

/**
 * 
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
            if (detail.value[i][0] === TaskSid.createWlt) {// 创建钱包
                list[0].isComplete = true;
                list[0].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.bindPhone) {// 注册手机号
                list[1].isComplete = true;
                list[1].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.chargeEth) {// 存币
                list[2].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.inviteFriends) {// 与好友分享
                list[3].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.buyFinancial) {// 购买理财
                list[4].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.chat) {// 聊天
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
export const parseRechargeWithdrawalLog = (val) => {
    const infoList = [];
    for (let i = 0; i < val.length;i++) {
        const record = {
            time:val[i][0],
            timeShow:timestampFormat(val[i][0]),
            amount:wei2Eth(val[i][1]),
            status:val[i][2],
            statusShow:parseRechargeWithdrawalLogStatus(val[i][2]),
            hash:val[i][3]
        };
        infoList.push(record);
    }
    
    return infoList.reverse();
};

/**
 * 解析购买记录
 */
const getproductById = (id:string) => {
    const productList = find('productList');
    for (let i = 0;i < productList.length;i++) {
        if (productList[i].id === `${id}`) {
            return productList[i];
        }
    }

    return null;
};
export const pasePurchaseRecord = (res:any) => {
    
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
export const paseProductList = (res:any) => {
    const result = [];
    for (let i = 0;i < res.value.length;i++) {
        const item = res.value[i];
        const id = item[0];
        const product = deepCopy(financialProductList[id]);
        product.coninType = CurrencyTypeReverse[`${item[1]}`];
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
// ===================================================== 本地

const parseRechargeWithdrawalLogStatus = (status:number) => {
    let statusShow;
    switch (status) {
        case -2:statusShow = '取消';break;
        case -1:statusShow = '错误';break;
        case 0:statusShow = '发送中';break;
        case 1:statusShow = '完成';break;
        default:
    }

    return statusShow;
};
// ===================================================== 立即执行