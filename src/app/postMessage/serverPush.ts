import { HandlerMap } from '../../pi/util/event';
import { ServerPushArgs } from '../publicLib/interface';

/**
 * 服务器推送
 */

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

/**
 * 监听vm loaded
 * @param cb 回调
 */
export const addServerPushListener = (key:string,cb:Function) => {
    handlerMap.add(key,<any>cb);
};

/**
 * 触发server push事件
 * @param args 参数
 */
export const emitServerPush = (args:ServerPushArgs) => {
    handlerMap.notify(args.key, args.result);
};