/**
 * 接收 第三方 推送消息
 */
import { HandlerMap } from '../../pi/util/event';
import { ThirdPushArgs } from '../public/constant';


/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

/**
 * 监听第三方 push事件
 * @param cb 回调
 */
export const addThirdPushListener = (key:any,cb:Function) => {
    handlerMap.add(key,<any>cb);
};

/**
 * 触发第三方 push事件
 * @param args 参数
 */
export const emitThirdPush = (args:ThirdPushArgs) => {
    handlerMap.notify(<any>args.cmd,args.payload);
};