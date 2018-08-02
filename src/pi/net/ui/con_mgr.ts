/**
 * 单连接管理器，提供登录，断点续连，慢请求提示等功能
 */

// ============================== 导入
import { commonjs } from '../../lang/mod';
import { now } from '../../lang/time';
import { Connect } from '../../net/websocket/connect';
import { HandlerMap, HandlerResult } from '../../util/event';

// ============================== 导出
/**
 * @description 枚举连接状态
 */
export enum ConState {
    init = 0,
    opening,
    opened,
    closed
}

/**
 * @description 枚举登录状态
 */
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}

/**
 * 获取通讯地址
 */
export const getUrl = () => {
    return conUrl;
};

/**
 * 设置通讯地址
 */
export const setUrl = (url: string) => {
    conUrl = url;
};

/**
 * 获取连接用户
 */
export const getUser = () => {
    return conUser;
};

/**
 * 设置连接用户
 */
export const setUser = (user: string) => {
    conUser = user;
};

/**
 * 打开连接
 */
let lastRequest = null;
export const open = (callback: Function, errorCallback: Function, timeout?: number) => {
    timeout = timeout || defaultTimeout;
    let lastError;
    // 接收后台推送服务器时间，并设置成服务器时间
    Connect.setNotify((msg) => {
        if (msg.type === 'closed') {
            setConState(ConState.closed);
            // alert(`服务器主动断掉了链接，最后的信息为：${JSON.stringify(lastRequest)}`)
        } else if (msg.msg) {
            if (msg.msg.type === 'echo_time') {
                localTime = con.activeTime;
                serverTime = msg.msg.param.stime;
                pingpong = localTime - msg.msg.param.ctime;
            } else {
                handlerMap.notify(msg.msg.type, [msg.msg.param]);
            }
        }
    });
    ping();
    timeout += now();
    const cfg = { encode: false, isText: (commonjs.flags.os.name === 'Android') && (commonjs.flags.os.version < '4.4.0') };
    const func = (result) => {
        if (result.error) {
            if (now() > timeout) {
                setConState(ConState.closed);

                return errorCallback && errorCallback([lastError ? lastError : result]);
                // return callTime(errorCallback, [lastError ? lastError : result], "open");
            }
            lastError = result;
            setTimeout(() => {
                Connect.open(conUrl, cfg, func, 10000);
            }, 3000);
        } else {
            con = result;
            setConState(ConState.opened);
            con.send({ type: 'app@time', param: { ctime: now() } });
            // callTime(callback, [result], "open");
            callback([result]);
        }
    };
    Connect.open(conUrl, cfg, func, 10000);
    setConState(ConState.opening);
};

/**
 * 通讯请求
 */
export const request = (msg: any, cb: Function, timeout?: number) => {
    // if (conState === ConState.opened && loginState === LoginState.logined) {
    if (conState === ConState.opened) {
        let ref = setTimeout(() => {
            ref = 0;
            slowReq++;
            show();
        }, waitTimeout);
        lastRequest = msg;
        con.request(msg, (r) => {
            console.log(msg.type, JSON.stringify(msg.param), '----------------------', r);
            if (r.error) {
                if (conState === ConState.closed) {
                    reopen();
                }
            }
            if (ref) {
                clearTimeout(ref);
            } else {
                slowReq--;
                show();
            }
            // callTime(cb, [r], "request");
            cb(r);
        }, timeout || defaultTimeout);
    } else {
        waitArray.push({ msg: msg, cb: cb });
    }
};

/**
 * 发送请求
 */
export const send = (msg: any) => {
    con.send(msg);
};

/**
 * 登录
 */
export const login = (userx: string, uType: string, password: string, cb: Function, timeout?: number) => {
    if (con === null) {
        if (conState !== ConState.init) {
            throw new Error(`login, invalid state: ${conState}`);
        }

        return open(() => {
            login(userx, uType, password, cb, timeout);
        }, (result) => {
            // callTime(cb, [result], "login");
            cb([result]);
        }, timeout);
    }
    con.request({ type: 'login', param: { userType: uType, password: password, user: userx } }, (result) => {
        if (result.error) {
            setLoginState(LoginState.logerror);
            result.result = result.error;
            // callTime(cb, [result], "logerror");
            cb([result]);
        } else {
            setLoginState(LoginState.logined);
            requestWaits();
            user = userx;
            userType = uType;
            tempPassword = result.password;
            result.result = 1;
            // callTime(cb, [result], "login");
            cb([result]);
        }
    }, timeout || defaultTimeout);
    setLoginState(LoginState.logining);
};

/**
 * 管理端登录
 */
export const adminLogin = (username: string, password: string, cb: Function, timeout?: number) => {
    if (con === null) {
        if (conState !== ConState.init) {
            throw new Error(`login, invalid state: ${conState}`);
        }

        return open(() => {
            adminLogin(username, password, cb, timeout);
        }, (result) => {
            // callTime(cb, [result], "login");
            cb([result]);
        }, timeout);
    }
    con.request({ type: 'admin_login', param: { username: username, password: password } }, (result) => {
        if (result.error) {
            setLoginState(LoginState.logerror);
            result.result = result.error;
            // callTime(cb, [result], "logerror");
            cb([result]);
        } else {
            setLoginState(LoginState.logined);
            requestWaits();
            username = username;
            tempPassword = result.password;
            result.result = 1;
            // callTime(cb, [result], "login");
            cb([result]);
        }
    }, timeout || defaultTimeout);
    setLoginState(LoginState.logining);
};

/**
 * 代理商登录
 */
export const agentLogin = (agentId: number, cb: Function, timeout?: number) => {
    if (con === null) {
        if (conState !== ConState.init) {
            throw new Error(`login, invalid state: ${conState}`);
        }

        return open(() => {
            agentLogin(agentId, cb, timeout);
        }, (result) => {
            // callTime(cb, [result], "login");
            cb([result]);
        }, timeout);
    }
    con.request({ type: 'agent_login', param: { agent_id: agentId } }, (result) => {
        if (result.error) {
            setLoginState(LoginState.logerror);
            result.result = result.error;
            // callTime(cb, [result], "logerror");
            cb([result]);
        } else {
            setLoginState(LoginState.logined);
            requestWaits();
            tempPassword = result.password;
            result.result = 1;
            // callTime(cb, [result], "login");
            cb([result]);
        }
    }, timeout || defaultTimeout);
    setLoginState(LoginState.logining);
};
/**
 * 登出
 */
export const logout = () => {
    setLoginState(LoginState.logouting);
    request({ type: 'logout' }, (result) => {
        setLoginState(LoginState.logouted);
    }, defaultTimeout);
};

/**
 * 重登录成功或失败的回调
 */
export const setReloginCallback = (cb: Function) => {
    reloginCallback = cb;
};

/**
 * 消息处理器
 */
export const setMsgHandler = (iType: string, cb: Function) => {
    handlerMap.add(iType, (r) => {
        // callTime(cb, [r], "recv");
        cb(r);

        return HandlerResult.OK;
    });
};

/**
 * 获取服务器时间
 */
export const getSeverTime = () => {
    return now() - localTime + serverTime;
};
/**
 * 获取ping的来回时间
 */
export const getPingPongTime = () => {
    return pingpong;
};

/**
 * 获取连接状态
 */
export const getConState = () => {
    return conState;
};

/**
 * 获取登录状态
 */
export const getLoginState = () => {
    return loginState;
};

export const stateChangeRegister = (cb) => {
    stateChangeArr.push(cb);

    return stateChangeArr.length - 1;
};

export const stateChangeUnregister = (index) => {
    stateChangeArr[index] = null;
};
// ============================== 本地
// 默认的超时时间
const defaultTimeout: number = 10 * 1000;

/**
 * 重登录回调
 */
let reloginCallback: Function = null;

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

/**
 * con表示连接
 */
let con: any = null;

/**
 * 连接状态
 */
let conState: ConState = ConState.init;

/**
 * 登录状态
 */
let loginState: LoginState = LoginState.init;

/**
 * 登录用户信息
 */
let user: string = '0';

/**
 * 登录用户类型，为多平台相同用户名做准备
 */
let userType: string | number = 0;

/**
 * 登录成功后，生成临时密码，在重登陆需要配合使用
 */
let tempPassword: string = '';

// 连接中断时，需要等待连接并登录成功后的请求
const waitArray: any[] = [];

/**
 * 慢请求总数量
 */
let slowReq: number = 0;

// 通讯地址
let conUrl: string = '';

// 连接用户
let conUser: string = '';

// 通讯等待时间
const waitTimeout = 20 * 1000;

// 超时关闭链接
const closeTimeout = 20 * 10 * 1000;

// 心跳时间
const pingTime = 10 * 1000;

// 用户长时间未发起通信，关闭链接
const noneReqTimeout = 10 * 60 * 1000;

let noneReqTimeoutID = null;

// 服务器时间
let serverTime = 0;
// 本地时间
let localTime = 0;
// 通讯时间，ping的来回时间
let pingpong = 0;

// 状态改变的CB
const stateChangeArr = [];
// 设置连接状态
const setConState = (s: number) => {
    if (conState === s) {
        return;
    }
    conState = s;
    show();
};
// 设置登录状态
const setLoginState = (s: number) => {
    if (loginState === s) {
        return;
    }
    loginState = s;
    show();
};

/**
 * 重新打开连接
 */
const reopen = () => {
    open(() => {
        if (loginState === LoginState.logined || loginState === LoginState.relogining) {
            relogin();
        }
    }, null);
};
/**
 * 重登录
 */
const relogin = () => {
    request({ type: 'relogin', param: { user: user, userType: userType, password: tempPassword } }, (result) => {
        if (result.error) {
            setLoginState(LoginState.logerror);
            reloginCallback && reloginCallback({ type: 'logerror', result: result });
        } else {
            setLoginState(LoginState.logined);
            requestWaits();
            reloginCallback && reloginCallback({ type: 'relogin', result: result });
        }
    }, defaultTimeout);
    setLoginState(LoginState.relogining);
};

/**
 * 将所有等待申请列表全部请求
 */
const requestWaits = () => {
    waitArray.map(elem => request(elem.msg, elem.cb, defaultTimeout));
};

/**
 * 定时器：每隔10s调用一次，发送本地时间
 */
const ping = () => {
    const func = () => {
        if (conState === ConState.closed) {
            reopen();
        } else if (conState === ConState.opened) {
            if (now() > con.activeTime + closeTimeout) {
                con.close();
                setConState(ConState.closed);
                reopen();
            } else {
                con.send({ type: 'app@time', param: { ctime: now() } });
            }
        }
        setTimeout(func, pingTime);
    };
    setTimeout(func, pingTime);
};

/**
 * 两分钟内用户未向后端发起请求则关闭链接
 */
const closeWsIfNoneReq = () => {
    if (noneReqTimeoutID) {
        clearTimeout(noneReqTimeoutID);
    }
    noneReqTimeoutID = setTimeout(() => {
        con.close();
    }, noneReqTimeout);
};

/**
 * 绘制
 */
const show = () => {
    stateChangeArr.forEach((cb) => {
        cb && cb({ ping: pingpong, slowReq: slowReq, con: conState, login: loginState });
    });
};
