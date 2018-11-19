
// ========================= import 

import { NativeObject, registerSign, ParamType } from './native';

// ========================= export

export class WebViewManager extends NativeObject {

    /**
     * 创建新的WebView窗口并弹出来
     * 注：webViewName不能和已有的WebView重复，如果相同，抛异常
     * 注：主WebView的名字是"default"
     */
    static open(webViewName: string, url: string, title: string, injectContent: string) {
        webViewMgr.call("openWebView", { webViewName, url, title, injectContent });
    }

    /**
     * 释放指定名字的WebView
     * 注：不能使用这个释放主WebView
     */
    static close(webViewName: string) {
        webViewMgr.call("closeWebView", { webViewName });
    }

    /**
     * 往指定名字的WebView发信息
     */
    static postMessage(webViewName: string, message: string) {
        webViewMgr.call("postWebViewMessage", { webViewName, message });
    }

    /**
     * 注册收到别的webView发过来的postmessage信息后的回调函数
     */
    static addPostMessageListener(listener: PostMessageListener) {
        if (postMessageListeners.indexOf(listener) < 0) {
            postMessageListeners.push(listener);
        }
    }

    /**
     * 取消注册当收到别的WebView发过来的postmessage消息后的回调函数
     */
    static removePostMessageListener(listener: PostMessageListener) {
        let position = postMessageListeners.indexOf(listener);
        if (position >= 0) {
            postMessageListeners.splice(position, 1);
        }
    }

    /**
     * 往指定名字的WebView调用指定模块的导出方法
     * data: 指定对方WebView执行的模块和导出方法
     * callback：返回结果的回调函数
     * 注：RPC都是一来一回的结构，没有注册一次可以调用多次的结构！
     */
    static rpc(webViewName: string, data: RpcData, callback?: Function) {
        let funcs = [];
        data.params = data.params || [];
        data.params = data.params.map(v => {
            if (v === undefined) {
                v = null;
            } else if (v instanceof Function) {
                let id = funcs.length;
                funcs.push(v);
                v = RPC_CALLBACK_PARAM + id;
            }
            return v;
        });

        let sign = <RpcCallSign>data;
        if (callback) {
            sign.resultCallbackID = funcs.length;
            funcs.push(callback);
        }

        if (funcs.length > 0) {
            sign.rpcID = ++rpcCurrentID;
            rpcMap.set(sign.rpcID, funcs);
        }

        WebViewManager.postMessage(webViewName, RPC_CALL_START + JSON.stringify(sign));
    }
}

// ========================= implmentation

registerSign(WebViewManager, {
    openWebView: [{
        name: "webViewName",
        type: ParamType.String
    }, {
        name: "url",
        type: ParamType.String
    }, {
        name: "title",
        type: ParamType.String
    }, {
        name: "injectContent",
        type: ParamType.String
    }],    
    closeWebView: [{
        name: "webViewName",
        type: ParamType.String
    }],
    postWebViewMessage: [{
        name: "webViewName",
        type: ParamType.String
    }, {
        name: "message",
        type: ParamType.String
    }]
});

let webViewMgr = new WebViewManager();
webViewMgr.init();

/**
 * PostMessage的监听器
 */
type PostMessageListener = (fromWebViewName: string, message: string) => void;

/**
 * Rpc的调用数据
 */
interface RpcData {
    moduleName: string,  // 模块名
    methodName: string,  // 方法名
    params: any[]        // 参数组成的数组，参数可以有回调函数
}

/**
 * Rpc调用的规范
 */
interface RpcCallSign {
    moduleName: string,         // 模块名
    methodName: string,         // 模块的导出方法名
    params: any[],              // 参数组成的数组，这里参数的回调函数全部转成Callback ID
    rpcID?: number,             // 可选：调用rpc前注册到Map的RPC ID
    resultCallbackID?: number,  // 可选：回调函数ID
}

/**
 * Rpc回应的规范
 */
interface RpcReplySign {
    rpcID: number,      // 调用rpc前注册到Map的RPC ID
    callbackID: number, // 回调函数ID
    args: any[],        // 参数组成的数组
}

/**
 * 特殊的消息开头，代表这是一个RPC调用
 */
const RPC_CALL_START = "$WEBVIEW_RPC_CALL: ";

/**
 * 特殊的消息开头，代表这是一个RPC回应
 */
const RPC_REPLY_START = "$WEBVIEW_RPC_REPLY: ";

/**
 * 特殊的消息格式，代表参数是一个函数
 */
const RPC_CALLBACK_PARAM = "$WEBVIEW_RPC_FUNCTION_PARAM: ";

/**
 * 监听postmessage的列表
 */
let postMessageListeners = <PostMessageListener[]>[];

/**
 * rpc的当前可用的id 和 RPC映射表
 */
let rpcCurrentID = 0;
let rpcMap = new Map<number, Function[]>();

/**
 * 注册到window上的全局函数，用于接收别的webView发送过来的消息
 */
window["onWebViewPostMessage"] = function (fromWebView: string, message: string) {

    // 收到对方的rpc调用请求，处理
    if (message.startsWith(RPC_CALL_START)) {
        message = message.slice(RPC_CALL_START.length);
        let data = <RpcCallSign>JSON.parse(message);
        return handleRpcCall(fromWebView, data);
    }

    // 收到对方的rpc回应，处理
    if (message.startsWith(RPC_REPLY_START)) {
        message = message.slice(RPC_REPLY_START.length);
        let data = <RpcReplySign>JSON.parse(message);
        return handleRpcReply(data);
    }

    // 其他消息，看高层，谁关心谁处理
    for (let listener of postMessageListeners) {
        listener(fromWebView, message);
    }
}

/**
 * 收到对方RPC之后的处理
 * @param fromWebViewName 
 * @param message 
 */
const handleRpcCall = (fromWebViewName: string, { moduleName, methodName, params, rpcID, resultCallbackID }: RpcCallSign) => {
    let func, result;
    let mod = window["pi_modules"][moduleName];
    if (!mod) {
        result = {
            error: "throw error, can't find module " + moduleName,
        }
    } else {
        func = mod.exports[methodName];
        if (!func) {
            result = {
                error: "throw error, can't find module " + moduleName + ", function = " + methodName,
            }
        }
    }

    if (func) {
        /**
         * 将参数的回调函数恢复回来
         */
        params = params.map(v => {
            if (typeof v === "string" && v.startsWith(RPC_CALLBACK_PARAM)) {
                let id = JSON.parse(v.slice(RPC_CALLBACK_PARAM.length));
                return (...args) => {
                    let sign = <RpcReplySign>{
                        args: args,
                        rpcID: rpcID,
                        callbackID: id,
                    }

                    let message = RPC_REPLY_START + JSON.stringify(sign);
                    WebViewManager.postMessage(fromWebViewName, message);
                }
            }
            return v;
        });

        try {
            result = func(...params);
        } catch (e) {
            func = undefined;
            result = {
                error: "call throw error",
            }
        }
    }

    // 异常情况时，func为undefined，这时必须让对方的rpc释放掉
    if ((!func) || resultCallbackID !== undefined) {
        let sign = <RpcReplySign>{
            args: [result]
        };

        if (rpcID !== undefined) {
            sign.rpcID = rpcID;
        }

        if (resultCallbackID !== undefined) {
            sign.callbackID = resultCallbackID;
        }

        let message = RPC_REPLY_START + JSON.stringify(sign);
        WebViewManager.postMessage(fromWebViewName, message);
    }
}

/**
 * 收到对方RPC回应之后的处理
 */
const handleRpcReply = ({ rpcID, callbackID, args }: RpcReplySign) => {
    let funcs = rpcMap.get(rpcID);
    let f = funcs && funcs[callbackID];
    if (f) {
        f(...args);
    }
    rpcMap.delete(rpcID);
}