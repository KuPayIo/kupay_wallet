/**
 * 连接处理
 */
import { PiWebSocket } from './websocket';
const Connect: any = {};
Connect.table = {};
Connect.wait = {};
// Connect.factory = {}; 
// tslint:disable-next-line:no-empty only-arrow-functions no-function-expression
Connect.notify = function (e: any) { };

// let table = {}, wait = {}, factory = {}, notify = function (e) {};
// 调用等待的回调
const callWait = (wait, url, con) => {
    let i;
    const arr = wait[url];
    delete wait[url];
    for (i = arr.length - 1; i >= 0; i--) {
        arr[i](con);
    }
};

// 消息接收及派发
const receive = (e) => {
    let i;
    let con;
    if (e.type === 'closed') {
        if (!Connect.table[e.url]) {
            return;
        }
        delete Connect.table[e.url];
    } else if (e.type === 'open') {
        con = e.con;
        if (con.error) {
            return callWait(Connect.wait, e.url, con);
        }
        Connect.table[e.url] = con;
        callWait(Connect.wait, e.url, con);
    } else {
        con = e.con;
        i = con[e.type];
        if (i) {
            if (i(e) === false) {
                return;
            }
        }
    }
    try {
        Connect.notify(e);
    } catch (ex) {
        console.log(`pi.connect notify, e.type=${e.type}, e.url=${e.url}, ex:${ex}`);
    }
};
/***
 * 获得指定url连接
 * @param   url 连接的地址
 * @return  连接对象
 */
Connect.get = (url: string): object => {
    return Connect.table[url];
};
/***
 * 打开连接
 * @param   url 连接的地址
 * @param   cfg 连接配置信息--json
 * @param   callback 连接回调函数
 * @param   timeout 连接超时时间
 */
Connect.open = (url: string, cfg, callback: Function, timeout: number) => {
    let i;
    let protocol;
    let con = Connect.table[url];
    if (con) {
        callback(con);

        return;
    }
    con = Connect.wait[url];
    if (con) {
        Connect.wait[url].push(callback);

        return;
    }
    i = url.indexOf('://');
    if (i < 1) {
        return callback({
            error: -13,
            reason: `invalid url:${url}`
        });
    }
    protocol = url.slice(0, i);
    if (!con) {
        con = new PiWebSocket();
        con.setReceiveCB(receive);
    }
    Connect.wait[url] = [callback];
    con.open(url, cfg, timeout);
};
/***
 * 用指定url连接发送请求
 * @param   url 连接的地址
 * @param   msg 发送的信息
 * @param   callback 请求回调函数
 * @param   timeout 请求超时时间
 * @return  0 没有连接--object
 */
Connect.request = (url: string, msg: string, callback: Function, timeout: number = 3000) => {
    const con = Connect.table[url];
    /*****
	 * 这里两种不同的处理
	 * flash 需要传过去字符串，及通讯源和参数
	 */
    const tempRequest = () => {
        con.request(msg, callback, timeout);
    };

    return (con) ? tempRequest() : 0;
};
/***
 * 用指定url连接发送消息
 * @param   url 连接的地址
 * @param   msg 发送的信息
 * @return  0 没有连接--object
 */
Connect.send = (url: string, msg: string) => {
    const con = Connect.table[url];

    return (con) ? con.send(msg) : 0;
};
/***
 * 关闭指定url连接
 * @param   url 连接的地址
 * @return  false 没有连接--object
 */
Connect.close = (url: string) => {
    const con = Connect.table[url];

    return (con) ? con.close('local close') : false;
};
/***
 * 设置连接事件通知
 * @param   func 连接事件的通知方法
 */
Connect.setNotify = (func: Function) => {
    Connect.notify = func;
};

export { Connect };