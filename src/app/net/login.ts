import { DeviceIdProvider } from '../../pi/browser/device';
import { open, reopen,request, setUrl } from '../../pi/net/ui/con_mgr';
import { cryptoRandomInt } from '../../pi/util/math';
import { inAndroidApp, inIOSApp, wsUrl } from '../public/config';
import { getStore, setStore } from '../store/memstore';
import { playerName } from '../utils/tools';

/**
 * 登录
 */

declare var pi_modules;

/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== 1) {
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};

/**
 * 钱包手动重连
 */
export const walletManualReconnect = () => {
    console.log('walletManualReconnect called');
    reopen(conReOpen);
};

/**
 * 开启连接
 */
export const openConnect = () => {
    setUrl(wsUrl);
    open(conSuccess,conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = () => {
    const token = getStore('user/token');
    setStore('user/offline',false);
    if (token) {
        autoLogin();
    } 
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    console.log('con error');
    setStore('user/isLogin',false);
    setStore('user/offline',true);
};

/**
 * 连接关闭回调
 */
const conClose = () => {
    console.log('con close');
    setStore('user/isLogin',false);
    setStore('user/offline',true);
};

/**
 * 重新连接回调
 */
const conReOpen = () => {
    console.log('con reopen');
    setStore('user/offline',false);
    // console.log();
};

/**
 * 自动登录
 */
export const autoLogin = async () => {
    const deviceDetail = await getDeviceAllDetail();
    const token = getStore('user/token');
    const userId = getStore('user/id');
    const param:any = {
        userType:3,
        user:userId,
        device_id: deviceDetail.uuid,
        token
    };
    if (inAndroidApp || inIOSApp) {
        param.operator = deviceDetail.operator;
        param.network = deviceDetail.netWorkStatus;
        param.app_version = pi_modules.appVersion;
    }
    const msg = { 
        type: 'wallet/user@auto_login', 
        param
    };
    console.log('autoLogin = ',msg);
    requestAsync(msg).then(res => {
        setStore('flags/doLoginSuccess',true);
        setStore('user/isLogin', true);
        setStore('flags/hasLogined',true,false);  // 在当前生命周期内登录成功过 重登录的时候以此判断是否有登录权限
        console.log('自动登录成功-----------',res);
        loginWalletSuccess();
    }).catch((res) => {
        setStore('user/isLogin', false);
        if (res.error !== -69) {
            setStore('user/token','');
            setStore('flags/doLoginFailed',true);
        }
    });
};

/**
 * 申请自动登录token
 */
export const applyAutoLogin = async () => {
    const deviceDetail =  await getDeviceAllDetail();
    const deviceId = deviceDetail.uuid.toString();
    const msg = { 
        type: 'wallet/user@set_auto_login', 
        param: { 
            device_id:deviceId
        }
    };
    requestAsync(msg).then(async (res) => {
        setStore('user/token',res.token);
    });
};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const getOpenId = (appId:string) => {
    const msg = { type: 'get_openid', param: { appid:appId } };

    return requestAsync(msg);
};

// 游客登录
export const touristLogin = async () => {
    const uuid = getStore('setting/deviceId') || cryptoRandomInt().toString();
    setStore('setting/deviceId',uuid);
    const user = getStore('user');
    let userId = user.id;
    if (!userId) {
        userId = new Date().getTime();
        user.id = userId;
        setStore('user',user);
    }

    // tslint:disable-next-line:variable-name
    const device_id = uuid;
    const param = {
        userType:3,
        user:userId,
        pwd:'',
        device_id
    };
    const msg = {
        type:'login',
        param
    };
    
    return requestAsync(msg).then(async res => {
        setStore('flags/isLogin',true);
        setStore('user/acc_id',res.acc_id);
        const info = {
            nickName: await playerName(),           // 昵称
            avatar: '',             // 头像
            phoneNumber: '',        // 手机号
            areaCode: '86',          // 区域码
            isRealUser: false,       // 是否是真实用户
            acc_id: res.acc_id,                // 好嗨号
            sex: 2,                    // 性别  0男 1女 2中性
            note: ''                   // 个性签名
        };
        const user = getStore('user');
        user.info = info;
        setStore('user',user);
        console.log('游客登录成功 =',res);
        loginWalletSuccess();
        applyAutoLogin();
    }).catch(res => {
        setStore('flags/isLogin',false);
    });
};

interface LoginType {
    appId:string;
    success:Function;
}

// 登录成功之后的回调列表
const loginedCallbackList:LoginType[] = [];
let walletLogin;  // 钱包是否登录
/**
 * 登录钱包
 */
export const loginWallet = (appId:string,success:Function) => {
    const loginType:LoginType = {
        appId,
        success
    };
    loginedCallbackList.push(loginType);
    if (walletLogin) {
        loginWalletSuccess1(loginType);
    }
    
};

/**
 * 登录钱包并获取openId成功
 */
const loginWalletSuccess = () => {
    walletLogin = true;
    for (const loginType of loginedCallbackList) {
        loginWalletSuccess1(loginType);
    }
};

const loginWalletSuccess1 = (loginType:LoginType) => {
    getOpenId(loginType.appId).then(res => {
        loginType.success(res.openid);
    }).catch(err => {
        console.log(`appId ${loginType.appId} get openId failed`,err);
        // popNewMessage('openid 获取失败');
        loginWalletSuccess1(loginType);  // openid获取失败  尝试再次获取直到成功
    });
};

// 用户登出回调
const logoutCallbackList:Function[] = [];

/**
 * 登出钱包
 */
export const logoutWallet = (success:Function) => {
    logoutCallbackList.push(success);
};

/**
 * 钱包登出成功
 */
const logoutWalletSuccess =  () => {
    for (const logout of logoutCallbackList) {
        logout();
    }
};

/**
 * 获取设备唯一id
 * 
 */
export const getDeviceId = (deviceIdProvider:DeviceIdProvider) => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.uuid);
    }

    return new Promise(resolve => {
        deviceIdProvider = deviceIdProvider || new DeviceIdProvider();
        deviceIdProvider.getUUId((uuid:string) => {
            console.log(`获取设备的唯一id = ${uuid}`);
            if (!uuid) {
                uuid = getStore('setting/deviceId') || cryptoRandomInt().toString();
                setStore('setting/deviceId',uuid);
            }
            resolve(uuid);
        });
    });
};

/**
 * 获取设备信息
 */
export const getDeviceSystem = (deviceIdProvider:DeviceIdProvider) => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve({ 
            manufacturer:oldDeviceAllDetail.manufacturer ,
            model:oldDeviceAllDetail.model,
            version:oldDeviceAllDetail.version 
        });
    }

    return new Promise(resolve => {
        deviceIdProvider = deviceIdProvider || new DeviceIdProvider();
        deviceIdProvider.getSystem((manufacturer:string,model:string,version:string) => {
            console.log(`获取设备信息 设备制造商 = ${manufacturer},设备名称 = ${model},系统版本号 = ${version}`);
            resolve({ 
                manufacturer:manufacturer || 'default',
                model:model || 'default',
                version:version || 'default' 
            });
        });
    });
};

/**
 * 获取设备总内存和当前可用内存
 */
export const getDeviceMemSize = (deviceIdProvider:DeviceIdProvider) => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve({ 
            total:oldDeviceAllDetail.total ,
            avail: oldDeviceAllDetail.avail 
        });
    }

    return new Promise(resolve => {
        deviceIdProvider = deviceIdProvider || new DeviceIdProvider();
        deviceIdProvider.getMemSize((total:string,avail:string) => {
            console.log(`获取设备内存 系统总内存 = ${total},当前可用内存 = ${avail}`);
            resolve({ 
                total:total || 'default',
                avail: avail || 'default'
            });
        });
    });
};

/**
 * 获取当前网络状态
 */
export const getDeviceNetWorkStatus = (deviceIdProvider:DeviceIdProvider) => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.netWorkStatus);
    }

    return new Promise(resolve => {
        deviceIdProvider = deviceIdProvider || new DeviceIdProvider();
        deviceIdProvider.getNetWorkStatus((netWorkStatus) => {
            console.log(`获取当前网络状态 = ${netWorkStatus}`);
            resolve(netWorkStatus || 'default');
        });
    });
};

/**
 * 获取网络供应商
 */
export const getOperatorName = (deviceIdProvider:DeviceIdProvider) => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.operator);
    }

    return new Promise(resolve => {
        deviceIdProvider = deviceIdProvider || new DeviceIdProvider();
        deviceIdProvider.getOperatorName((operator:string) => {
            console.log(`获取网络供应商 = ${operator}`);
            resolve(operator || 'default');
        });
    });
};

/**
 * 获取设备所有详情
 */
export const getDeviceAllDetail = ():Promise<any> => {
    if (!inAndroidApp && !inIOSApp) {
        return new Promise((resolve) => {
            const uuid = getStore('setting/deviceId') || cryptoRandomInt().toString();
            setStore('setting/deviceId',uuid);
            resolve({ uuid });
        });
    } else {
        const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
        if (oldDeviceAllDetail) {
            return Promise.resolve(oldDeviceAllDetail);
        }

        const deviceIdProvider = new DeviceIdProvider();
        // tslint:disable-next-line:max-line-length
        const allPromise = [getDeviceId(deviceIdProvider),getDeviceSystem(deviceIdProvider),getDeviceMemSize(deviceIdProvider),getDeviceNetWorkStatus(deviceIdProvider),getOperatorName(deviceIdProvider)];

        return Promise.all(allPromise).then(([uuid,system,mem,netWorkStatus,operator]) => {
            const deviceAllDetail = {
                uuid,
                netWorkStatus,
                operator,
                ...system,
                ...mem
            };
            console.log('获取设备所有信息 ==',deviceAllDetail);
            setStore('flags/deviceAllDetail',deviceAllDetail);

            return deviceAllDetail;
        });
    }
    
};
