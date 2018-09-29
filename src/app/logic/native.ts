import { ImagePicker } from '../../pi/browser/imagePicker';
import { QRCode } from '../../pi/browser/qrcode';
import { SystemInfoProvider } from '../../pi/browser/systemInfoProvider';
import { WebViewHelper } from '../../pi/browser/webViewHelper';
import { popNew } from '../../pi/ui/root';

/**
 * 一些底层操作
 */

export const selectImage = (ok?,cancel?) => {
    console.log('选择图片');
    const close = popNew('app-components1-loading-loading', { text: '导入中...' });
    const image = new ImagePicker();
    image.init();
    image.selectFromLocal({
        success: (width, height, result) => {
            ok && ok(width, height, result);
            close.callback(close.widget);
        },
        fail: (result) => {
            cancel && cancel(result);
            close.callback(close.widget);
            popNew('app-components-message-message', { content: '导入失败' });
        },
        useCamera: 1,
        single: 1,
        max: 1
    });
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
export const openNewActivity = (url:string,title:string= '测试') => {
    const newWebView = new WebViewHelper();
    newWebView.init();
    newWebView.open({
        success: (result) => {}, 
        fail: (result) => {}, 
        loadUrl: url,
        title
    });
};

/**
 * 获取设备信息
 */
export const getDeviceInfo = () => {
    const systemInfo = new SystemInfoProvider();
    systemInfo.init();
    systemInfo.getDeviceInfo({
        success: (result) => {
            console.log('获取设备的系统信息成功\t' + result);
        }
        , fail: (result) => {
            console.log('获取设备的系统信息失败\t' + result);
        }
    });
};