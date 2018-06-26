
import { arrayBufferToBase64 } from '../util/base64';

// 当前回调对应的索引
let callIDMax = 1;
/**
 * 回调函数对应的id map
 */
const callIDMap: Map<number, NativeListener> = new Map<number, NativeListener>();

/**
 * 底层回调方法的接口
 */
export interface NativeListener {
    // 成功回调
    success?: Function;
    // 失败回调
    fail?: Function;
    // 通用回调
    callback?: Function;
}

/**
 * 底层回调方法的约定
 */
export enum NativeCode {
    Success = 0,
    Fail = 1,
    Callback = 100
}

/**
 * 类型
 */
export enum ParamType {
    Number = 'number',
    String = 'string',
    Bytes = 'ArrayBuffer'
}

export interface ParamSign {
    name: string;
    /* tslint:disable:no-reserved-keywords */
    type: ParamType;
}

/**
 * 对象的初始化状态
 */
export enum NativeState {
    UnInit = 0,   // 尚未初始化
    Init = 1,     // 已经初始化
    Close = 2     // 已经关闭
}

const signMap = new Map<Function, Map<string, ParamSign[]>>();

/**
 * 注册类的方法签名
 * @param constructor 类的构造函数
 * @param sign 
 * {
 *    "getPerson": [{name: "paramName", type: ParamType.Number}...]
 * }
 */
export const registerSign = (constructor: Function, sign: Object) => {
    const map = new Map<string, ParamSign[]>();
    for (const methodName in sign) {
        map.set(methodName, sign[methodName]);
    }
    signMap.set(constructor, map);
};

export const addCallback = (callback: Function) => {
    const id = callIDMax++;
    callIDMap.set(id, {
        callback: callback
    });

    return id;
};

export const removeCallback = id => {
    callIDMap.delete(id);
};

/**
 * 底层对象，供高层扩展
 */
export class NativeObject {

    private id: number = 0;                       // 底层对象对应的id，如果为0代表尚未初始化成功
    private state: NativeState = NativeState.UnInit;   // 当前状态
    private waits: any[] = [];                   // 正在初始化时候，积累的函数；最后一个是方法名，其他是方法的参数

    /**
     * 调用底层静态方法
     */
    public static callStatic(constructor: any, methodName: string, params: any, id: number = 0) {
        const className = constructor.name;

        let cbID = 0;
        if (params.success || params.fail || params.process) {
            cbID = callIDMax++;
            callIDMap.set(cbID, {
                success: params.success,
                fail: params.fail
            });
        }

        const args = [];
        const methodSign = signMap.get(constructor);
        const signs = methodSign.get(methodName);

        for (const p of signs) {
            if (!(p.name in params)) {
                throw new Error(`${className}.${methodName}, value ${p.name} isn't exist`);
            }

            let value = params[p.name];
            switch (p.type) {
                case ParamType.Number:
                    if (typeof value !== 'number') {
                        throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't match`);
                    }
                    break;
                case ParamType.String:
                    if (typeof value !== 'string') {
                        throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't match`);
                    }
                    break;
                case ParamType.Bytes:
                    if (!(value instanceof ArrayBuffer)) {
                        throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't match`);
                    }
                    value = arrayBufferToBase64(value);
                    break;
                default:
                    throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't exist`);
            }
            args.push(value);
        }

        callNative(className, methodName, id, cbID, ...args);
    }

    /**
     * 初始化方法，创建对象
     * @param cb 监听器
     */
    public init(cb?: NativeListener) {
        if (this.state !== NativeState.UnInit) {
            throw new Error('NativeObject already inited');
        }

        this.state = NativeState.Init;

        const func = id => {
            this.id = id;

            // 调用积累函数
            for (let w of this.waits) {
                const name = w.pop();
                w = w ? w[0] : undefined;
                setTimeout(() => {
                    if (name === 'close') {
                        this.close(w);
                    } else {
                        this.call(name, w);
                    }
                }, 0);
            }
            this.waits.length = 0;
            cb && cb.success && cb.success();
        };

        const cbID = callIDMax++;
        callIDMap.set(cbID, {
            success: func
        });
        callNative(this.constructor.name, 'init', 0, cbID);
    }

    /**
     * 删除底层对象
     */
    public close(cb?: NativeListener) {

        if (this.state !== NativeState.Init) {
            alert(`NativeObject.close isn\'t use, state = ${this.state}`);
            throw new Error('NativeObject isn\'t use');
        }

        if (this.id === 0) {
            this.waits.push([cb, 'close']);

            return;
        }

        this.state = NativeState.Close;

        let cbID = 0;

        if (cb.success) {
            cbID = callIDMax++;
            callIDMap.set(cbID, {
                success: cb.success
            });
        }

        const id = this.id;
        this.id = 0;
        callNative(this.constructor.name, 'close', id, cbID);
    }

    /**
     * 调用底层方法
     */
    public call(methodName: string, params: any) {
        if (this.state !== NativeState.Init) {
            throw new Error(`${methodName} NativeObject isn\'t use`);
        }

        if (this.id === 0) {
            this.waits.push([params, methodName]);

            return;
        }

        NativeObject.callStatic(this.constructor, methodName, params, this.id);
    }
}

/**
 * 调用底层函数
 * 
 */
export const callNative = (className: string,
    methodName: string, nativeID: number, listenerID: number, ...args) => {

    const str = navigator.userAgent;
    if (str.indexOf('YINENG_ANDROID') >= 0) {
        // alert(`callNative(${className}, ${methodName}, ${nativeID}, ${listenerID}, ${JSON.stringify(args)})`)
        (<any>window).JSBridge.postMessage(className, methodName, nativeID, listenerID, JSON.stringify(args));

    } else if (str.indexOf('YINENG_IOS') >= 0) {

        // JS通知WKWebView
        (<any>window).webkit.messageHandlers.Native.postMessage([className, methodName, nativeID, listenerID, ...args]);
    }
};

/**
 * 底层的回调
 */
(<any>window).handle_Native_Message = (cbID: number, code: number, ...args: any[]) => {

    // alert(`handle_Native_Message(${cbID}, ${code}, ${args.join(",")})`);

    if (cbID === 0) return;

    const cb = callIDMap.get(cbID);
    if (!cb) {
        return;
    }

    switch (code) {
        case NativeCode.Success:
            cb.success && cb.success(...args);
            callIDMap.delete(cbID);   // 成功回调只调用一次
            break;
        case NativeCode.Fail:
            cb.fail && cb.fail(...args);
            callIDMap.delete(cbID);   // 失败回调只调用一次
            break;
        case NativeCode.Callback:
            // 通用型回调由应用逻辑负责移除
            cb.callback && cb.callback(...args);
            break;
        default:
            alert(`NativeObject Callback error, code = ${code} don't match`);
            throw new Error(`NativeObject Callback error, code = ${code} don't match`);
    }
};

(<any>window).handle_Native_ThrowError = (className: string, methodName: string, msg: string) => {

    alert(`handle_Native_ThrowError, ${className}.${methodName} failed: ${msg}`);

    throw new Error(`handle_Native_ThrowError, ${className}.${methodName} failed: ${msg}`);
};