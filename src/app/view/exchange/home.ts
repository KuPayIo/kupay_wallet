/**
 * 交易所
 */
import { open, request, setUrl } from '../../../pi/net/ui/con_mgr';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { conIp } from '../../net/pull';

export class Home extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const currency1 = 'KT';
        const currency2 = 'KT';
        this.state = {
            currency1: currency1,
            currency2: currency2,
            isSelect: 'buy',
            price: 0,
            priceConversion: '≈0 CNY',
            count: 0,
            all: 0,
            average: '0',
            averagePrice: '≈0 CNY',
            buyList: [
                { price: 919.23, count: 0.010, schedule: 0.2 },
                { price: 919.16, count: 0.550, schedule: 0.8 },
                { price: 919.23, count: 0.010, schedule: 0.5 },
                { price: 919.16, count: 0.550, schedule: 0.6 },
                { price: 919.23, count: 0.010, schedule: 0.1 }
            ],
            saleList: [
                { price: 919.23, count: 0.010, schedule: 0.2 },
                { price: 919.16, count: 0.550, schedule: 0.8 },
                { price: 919.23, count: 0.010, schedule: 0.5 },
                { price: 919.16, count: 0.550, schedule: 0.6 },
                { price: 919.23, count: 0.010, schedule: 0.1 }
            ],
            transferList: [
                { time: '2018/7/30 7:05', price: 0.00000056, count: 25 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 2.4909 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 2.18524 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 19 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 1200 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 19 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 1200 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 1200 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 19 },
                { time: '2018/7/30 7:05', price: 0.00000056, count: 1200 }
            ],
            list: ['买入', '卖出', '当前委托', '历史委托'],
            activeNum: 0,
            usePercent: 0,
            countHolder: `数量(${currency1})`,
            allCountHolder: `总额(${currency2})`,
            entrustList: [
                {
                    id: 1, type: 1, currency1: 'KT', currency2: 'ETH', time: '07-24 12:55:24', price: 0.0012
                    , currencyCount1: 0.00123052, currencyCount2: 0.00002354
                },
                {
                    id: 1, type: 1, currency1: 'KT', currency2: 'ETH', time: '07-24 12:55:24', price: 0.0012
                    , currencyCount1: 0.00123052, currencyCount2: 0.00002354
                },
                {
                    id: 1, type: 1, currency1: 'KT', currency2: 'ETH', time: '07-24 12:55:24', price: 0.0012
                    , currencyCount1: 0.00123052, currencyCount2: 0.00002354
                },
                {
                    id: 1, type: 1, currency1: 'KT', currency2: 'ETH', time: '07-24 12:55:24', price: 0.0012
                    , currencyCount1: 0.00123052, currencyCount2: 0.00002354
                },
                {
                    id: 1, type: 1, currency1: 'KT', currency2: 'ETH', time: '07-24 12:55:24', price: 0.0012
                    , currencyCount1: 0.00123052, currencyCount2: 0.00002354
                }
            ]
        };
    }

    public clkBuy(e: any, index: number) {
        this.state.isSelect = 'buy';
        this.paint();
    }

    public clkSale(event: any) {
        this.state.isSelect = 'sale';
        this.paint();
        // popNew("app-view-messageList-messageList");
    }

    /**
     * 显示K线图
     */
    public showKLine() {
        popNew('app-view-exchange-kline');
    }

    /**
     * 更换货币信息
     */
    public changeCurrency() {
        popNew('app-view-exchange-choose', {}, (r) => {
            if (r) {
                this.state.currency1 = r.currency1;
                this.state.currency2 = r.currency2;
                this.paint();
            }
        });
    }

    /**
     * 滑动改变
     */
    public onSlicerChange(e: any) {
        this.state.usePercent = e.value;
        this.paint();
    }

    /**
     * 目录切换
     */
    public onMenuChange(e: any) {
        console.log(e.value);
        testNet();
        this.state.activeNum = e.value;
        this.paint();
    }
}

const testNet = async () => {
    // setUrl(`ws://${location.hostname}:2081`);
    setUrl(`ws://${conIp}:2081`);
    open(() => {
        // todo 需要在登录后才能发起正式的通信

        // query_all_order：查询所有订单数据
        const msgQueryAllOrder = {
            type: 'query_all_order',
            param: {
                type: 100,
                page: 0,
                count: 20
            }
        };
        // query_user_order:查询我的订单数据
        const msgQueryUserOrder = {
            type: 'query_user_order',
            param: {
                type: 100,
                page: 0,
                count: 20,
                status: 0
            }
        };
        // pending_order：发起订单
        const msgPendingOrder = {
            type: 'pending_order',
            param: {
                type: 100,
                amount: Math.pow(10, 9) * 1000,
                price: 1
            }
        };
        // undo_order：撤销订单
        const msgUndoOrder = {
            type: 'undo_order',
            param: {
                type: 100,
                sid: 1
            }
        };

        // 发红包
        const sendRedEnvelope = {
            type:'emit_red_bag',
            param:{
                type:0,
                priceType:100,
                totalPrice:1000,
                count:10,
                desc:'大吉大利 今晚吃鸡'
            }
        };
        const msg = sendRedEnvelope;
        request(msg, (resp) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
            } else if (resp.result !== undefined) {
                console.log(resp.result);
            }
        });
    }, (result) => {
        console.log(`open错误信息为${result}`);
    });

};