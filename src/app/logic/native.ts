/**
 * 一些底层操作
 */
import { AdPlatform, ADUnion, PlayEvent } from '../../pi/browser/ad_unoin';
import { DeviceIdProvider } from '../../pi/browser/device';
import { ImagePicker } from '../../pi/browser/imagePicker';
import { WebViewManager } from '../../pi/browser/webview';
import { cryptoRandomInt } from '../../pi/util/math';
import { getStore, setStore } from '../store/memstore';
import { piRequire } from '../utils/commonjsTools';
import { popNewLoading } from '../utils/tools';

export const selectImage = (ok?,cancel?) => {
    console.log('选择图片');
    const imagePicker = new ImagePicker();
    imagePicker.init();
    imagePicker.selectFromLocal({
        success: (width, height, url) => {
            ok && ok(width, height, url);
            close && close.callback(close.widget);
        },
        fail: (result) => {
            cancel && cancel(result);
            close && close.callback(close.widget);
        },
        useCamera: 1,
        single: 1,
        max: 1
    });
    let close;
    setTimeout(() => {
        close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
    },100);
    
    return imagePicker;
};

/**
 * 二维码扫描
 */
export const doScanQrCode = (ok?,cancel?) => {
    piRequire(['pi/browser/qrcode']).then(mods => {
        const QRCode = mods[0].QRCode;
        const qrcode = new QRCode();
        qrcode.init();
        qrcode.scan({
            success: (res) => {
                ok && ok(res);
                console.log('scan-------------',res);
            },
            fail: (r) => {
                cancel && cancel();
                console.log(`scan fail:${r}`);
            }
        });
        qrcode.close({
            success: (r) => {
                console.log(`close result:${r}`);
            }
        });
    });
};

/**
 * 打开新网页
 */
export const openNewActivity = (url:string,title:string= '') => {
    WebViewManager.open(title, `${url}?${Math.random()}`, title, '');
};

/**
 * 获取设备唯一id
 */
export const getDeviceId = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.uuid);
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
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
export const getDeviceSystem = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve({ 
            manufacturer:oldDeviceAllDetail.manufacturer ,
            model:oldDeviceAllDetail.model,
            version:oldDeviceAllDetail.version 
        });
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
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
export const getDeviceMemSize = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve({ 
            total:oldDeviceAllDetail.total ,
            avail: oldDeviceAllDetail.avail 
        });
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
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
export const getDeviceNetWorkStatus = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.netWorkStatus);
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getNetWorkStatus((netWorkStatus) => {
            console.log(`获取当前网络状态 = ${netWorkStatus}`);
            resolve(netWorkStatus || 'default');
        });
    });
};

/**
 * 获取网络供应商
 */
export const getOperatorName = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.operator);
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getOperatorName((operator:string) => {
            console.log(`获取网络供应商 = ${operator}`);
            resolve(operator || 'default');
        });
    });
};

declare var pi_update;
/**
 * 获取设备所有详情
 */
export const getDeviceAllDetail = ():Promise<any> => {
    if (!pi_update.inAndroidApp && !pi_update.inIOSApp) {
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
        const allPromise = [getDeviceId(),getDeviceSystem(),getDeviceMemSize(),getDeviceNetWorkStatus(),getOperatorName()];

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

/**
 * 截屏
 */
export const makeScreenShot = (okCB?,errCB?) => {
    piRequire(['pi/browser/shareToPlatforms']).then(mods => {
        const ShareToPlatforms = mods[0].ShareToPlatforms;
        ShareToPlatforms.makeScreenShot({
            success: (result) => { 
                okCB && okCB(result);
            },
            fail: (result) => { 
                errCB && errCB(result);
            }
        });
    });
    
};

/**
 * 获取屏幕刘海与下部分高度
 */
export const getScreenModify = () => {
    WebViewManager.getScreenModify((high,low) => {
        const calHigh = high / window.devicePixelRatio * 2;
        const calLow = low / window.devicePixelRatio * 2;
        setStore('setting/topHeight',calHigh);
        setStore('setting/bottomHeight',calLow);
    });
};

/**
 * 预先下载广告
 */
export const preLoadAd = (adType?: AdPlatform,cb?:(str1:string,str2:string) => void) => {
    adType = adType ? adType : Math.random() > 0.5 ? AdPlatform.GDT : AdPlatform.CSJ;
    ADUnion.loadRewardVideoAD(adType,(str1,str2) => {
        cb && cb(str1,str2);
    });
};
/**
 * 观看广告
 * adtype:1.广点通  2.字节跳动
 */
// tslint:disable-next-line:no-reserved-keywords
export const watchAd = (adType: AdPlatform,cb?:(isSuccess: number, event: PlayEvent, info: string) => void) => {
    // tslint:disable-next-line:no-reserved-keywords
    ADUnion.showRewardVideoAD(adType,(isSuccess,event,info) => {
        cb && cb(isSuccess,event,info);
        preLoadAd();
    });
};

/**
 * 选择播放的广告类型
 */
export const chooseAdType = (cb:Function) => {
    const ads = [];
    ADUnion.getADNumber((gdtAdNumber,csjAdNumber) => {
        for (let i = 0;i < gdtAdNumber;i ++) {
            ads.push(AdPlatform.GDT);
        }
        for (let i = 0;i < csjAdNumber;i ++) {
            ads.push(AdPlatform.CSJ);
        }
        const len = ads.length;
        const index = Math.floor(Math.random() * 100) % len;
        const adType = ads[index] || (Math.random() > 0.5 ? AdPlatform.GDT : AdPlatform.CSJ);
        cb && cb(adType);
    });
};
