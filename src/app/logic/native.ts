/**
 * 一些底层操作
 */
import { ImagePicker } from '../../pi/browser/imagePicker';
import { QRCode } from '../../pi/browser/qrcode';
import { ShareToPlatforms } from '../../pi/browser/shareToPlatforms';
import { DeviceIdProvider, SystemInfoProvider } from '../../pi/browser/systemInfoProvider';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { setStore } from '../store/memstore';

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
        close = popNew('app-components1-loading-loading', { text: { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' } });
    },100);
    
    return imagePicker;
};

/**
 * 二维码扫描
 */
export const doScanQrCode = (ok?,cancel?) => {
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
};

/**
 * 打开新网页
 */
export const openNewActivity = (url:string,title:string= '') => {
    WebViewManager.open(title, `${url}?${Math.random()}`, title, '');
};

/**
 * 获取设备信息
 */
export const getDeviceId = (okCB?,errCB?) => {
    const systemInfo = new DeviceIdProvider();
    systemInfo.init();
    systemInfo.getDriverId({
        success: (result) => {
            console.log(`获取设备的唯一id成功${JSON.stringify(result)}`);
            okCB && okCB(result);
        }
        , fail: (result) => {
            console.log(`获取设备的唯一id失败${JSON.stringify(result)}`);
            errCB && errCB(result);
        }
    });
};

/**
 * 获取设备信息
 */
export const getDeviceInfo = (okCB?,errCB?) => {
    const systemInfo = new SystemInfoProvider();
    systemInfo.init();
    systemInfo.getDeviceInfo({
        success: (result) => {
            console.log(`获取设备的信息成功${JSON.stringify(result)}`);
            okCB && okCB(result);
        }
        , fail: (result) => {
            console.log(`获取设备的信息失败${JSON.stringify(result)}`);
            errCB && errCB(result);
        }
    });
};

/**
 * 截屏
 */
export const makeScreenShot = (okCB?,errCB?) => {
    const stp = new ShareToPlatforms();
    stp.init();
    stp.makeScreenShot({
        success: (result) => { 
            okCB && okCB(result);
        },
        fail: (result) => { 
            errCB && errCB(result);
        }
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
