/**
 * 理财产品配置
 */
export const Config = {
    productList:{
        60001:{
            id:'60001',// 产品id
            title: '优选理财-随存随取',// 产品标题
            profit: '8%',// 预期年化收益
            productName: 'ETH资管第1期',// 产品名称
            productDescribe: '赎回T+0到账 | 0.1 ETH/份',// 首页显示的产品描述
            unitPrice: null,// 单价
            coninType:'',// 购买币种
            days: 'T+0',// 锁定日期
            total:0,// 产品总量
            surplus: 0,// 剩余量
            purchaseDate: '无',// 起购日
            interestDate: '无',// 起息日
            endDate: '无',// 结束日
            productIntroduction: 'ETH资管第1期是KuPay退出的一种固定收益类，回报稳定、无风险定期产品。',// 产品介绍
            limit: '5',// 购买上限
            lockday:'无',// 锁定期
            isSoldOut:true// 是否售完
        }
    }
};
