/**
 * 交易所
 */
import { open, request,setUrl } from '../../../pi/net/ui/con_mgr';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

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
        this.state = {
            currency1: 'BTC',
            currency2: 'ETH',
            isSelect: 'buy',
            price: 7835.59,
            priceConversion: '≈51283.93 CNY',
            count: 1,
            all: 7835.59,
            allConversion: '￥51283.93',
            change: '-2.63%',
            buyList: [
                { price: 919.23, count: 0.010, schedule: 0.2 },
                { price: 919.16, count: 0.550, schedule: 0.8 },
                { price: 919.23, count: 0.010, schedule: 0.5 },
                { price: 919.16, count: 0.550, schedule: 0.6 },
                { price: 919.23, count: 0.010, schedule: 0.1 },
                { price: 919.16, count: 0.550, schedule: 0.4 },
                { price: 919.23, count: 0.010, schedule: 0.9 }
            ],
            saleList: [
                { price: 919.23, count: 0.010, schedule: 0.2 },
                { price: 919.16, count: 0.550, schedule: 0.8 },
                { price: 919.23, count: 0.010, schedule: 0.5 },
                { price: 919.16, count: 0.550, schedule: 0.6 },
                { price: 919.23, count: 0.010, schedule: 0.1 },
                { price: 919.16, count: 0.550, schedule: 0.4 },
                { price: 919.23, count: 0.010, schedule: 0.9 }
            ],
            list: ['买入', '卖出', '当前委托', '历史委托'],
            activeNum: 0
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
        this.ok();

        return;
        popNew('app-view-exchange-choose', {}, (r) => {
            if (r) {
                this.state.currency1 = r.currency1;
                this.state.currency2 = r.currency2;
                this.paint();
            }
        });
    }
}

const testNet = async () => {
    // setUrl(`ws://${location.hostname}:2081`);
    setUrl(`ws://192.168.33.65:2081`);
    open(() => {
        // todo 需要在登录后才能发起正式的通信

        // query_all_order：查询所有订单数据
        // args:
        // 	type: 100MPT, 101ETH
        // 	page: 页数，从0开始
        // 	count: 每页的记录数，>0
        // return:
        // 	result: 1成功, 600数据库错误
        // 	value: [[单号, 已卖出数量, 卖出数量, 已买入数量, 买入数量, 挂单时间(ms), 成交时间(ms), 撤消时间(ms)], ...]
        const msgQueryAllOrder = {
            type: 'query_all_order',
            param: {
                type: 100,
                page: 0,
                count: 20
            }
        };
        // query_user_order:查询我的订单数据
        // args:
        // 	type: 100MPT, 101ETH
        //  status: 0未成交(包括部分成交)，1已成交，2已撤消
        // 	page: 页数，从0开始
        // 	count: 每页的记录数，>0
        // return:
        // 	result: 1成功, 600数据库错误
        // 	value: [[单号, 已卖出数量, 卖出数量, 已买入数量, 买入数量, 挂单时间(ms), 成交时间(ms), 撤消时间(ms)], ...]
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
        // args:
        // 	type: 100MPT, 101ETH 卖出类型
        // 	sell: 卖出数量，MPT最小卖单为1000MPT，可配置，ETH最小卖单为0.01ETH，可配置
        // 	buy: 买入数量, ==0市价交易，>0限价交易
        // return:
        // 	result: 1成功, 600数据库错误
        // 	value: [单号, 挂单时间(ms)]
        const msgPendingOrder = {
            type: 'pending_order',
            param: {
                type: 100,
                sell: Math.pow(10, 9) * 1000,
                buy: 1
            }
        };
        // undo_order：撤销订单
        // args:
        // 	type: 100MPT, 101ETH
        // 	sid: 单号
        // return:
        // 	result: 1成功, 600数据库错误
        const msgUndoOrder = {
            type: 'undo_order',
            param: {
                type: 100,
                sid: 1
            }
        };

        const msg = msgQueryUserOrder;
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