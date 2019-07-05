import { HandlerMap } from '../../pi/util/event';
import { ThirdCmd, ThirdPushArgs } from '../publicLib/interface';

/**
 * 三方推送
 */

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

/**
 * 监听vm loaded
 * @param cb 回调
 */
export const addThirdPushListener = (key:any,cb:Function) => {
    handlerMap.add(key,<any>cb);
};

/**
 * 触发server push事件
 * @param args 参数
 */
export const emitThirdPush = (args:ThirdPushArgs) => {
    handlerMap.notify(<any>args.cmd,args.payload);
};