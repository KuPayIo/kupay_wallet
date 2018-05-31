/**
 * @file store
 * @author donghr
 */
declare const window;
// ============================================ 导入
import { HandlerMap } from '../../pi/util/event';

// ============================================ 导出
/**
 * 根据keyName返回相应的数据，map数据会被转换为数组
 * 若传入id参数,则会取相应map的值
 */
// tslint:disable-next-line:no-any
export const find = (keyname: string, id?: number): any => {
    const value = JSON.parse(localStorage.getItem(keyname));
    if (!id) {
        if (!(value instanceof Map)) {
            return value instanceof Object ? copy(value) : value;
        }
        const arr = [];
        for (const [, v] of value) {
            arr.push(v);
        }

        return copy(arr);
    }
    if (id && value instanceof Map) {
        const result = value.get(id);

        return result && copy(result);
    }
};

/**
 * 更新store并通知
 */
// tslint:disable-next-line:no-any
export const updateStore = (keyName: string, data: any,notified?:boolean): void => {
    localStorage.setItem(keyName,JSON.stringify(data));
    if (notified) {
        handlerMap.notify(keyName, [find(keyName)]);
    }
};

/**
 * 消息处理器
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

type KeyName = MapName | 'wallet'|'addrs';

type MapName = '';

// ============================================ 本地
// tslint:disable-next-line:no-any
const copy = (v: any): any => {
    return JSON.parse(JSON.stringify(v));
};

// ============================================ 立即执行
/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();
