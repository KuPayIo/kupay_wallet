import { init as binanceRestApiInit } from './binance/restApi';
import { init as fcoinRestApiInit } from './fcoin/restApi';
import { init as gateRestApiInit } from './gate/restApi';
import { init as huobiCrawlerRestInit } from './huobi/crawlerRest';
import { init as huobiCrawlerWsInit } from './huobi/crawlerWs';
import { init as okexSpotRestInit } from './okex/spotRest';

/**
 * 交易所管理
 * @example
 */
export class ExchangeManage {
    /**
     * 初始化
     */
    public init() {
        // 启动http获取火币行情
        // huobiCrawlerRestInit();
        // 启动ws获取火币行情
        // todo 暂时数据解析有问题，暂不开启
        // huobiCrawlerWsInit();

        // 启动http获取okex行情
        // todo 接口存在跨域问题  暂时跳过
        // okexSpotRestInit();

        // 启动http获取币安行情
        // todo 接口存在跨域问题  暂时跳过
        // binanceRestApiInit();

        // 启动http获取比特儿行情
        // todo 接口存在跨域问题  暂时跳过
        // gateRestApiInit();

        // 启动http获取fcoin行情
        // fcoinRestApiInit();
    }

}

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const exchangeManage: ExchangeManage = new ExchangeManage();