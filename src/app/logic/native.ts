import { ImagePicker } from '../../pi/browser/imagePicker';
import { QRCode } from '../../pi/browser/qrcode';
import { SystemInfoProvider } from '../../pi/browser/systemInfoProvider';
import { WebViewHelper } from '../../pi/browser/webViewHelper';
import { popNew } from '../../pi/ui/root';
import { HttpHelper } from '../../pi/browser/httpHelper';

/**
 * 一些底层操作
 */

export const selectImage = (ok?,cancel?) => {
    console.log('选择图片');
    const image = new ImagePicker();
    image.init();
    image.selectFromLocal({
        success: (width, height, result) => {
            ok && ok(width, height, result);
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
    setTimeout(()=>{
        close = popNew('app-components1-loading-loading', { text: '导入中...' });
    },100);
};

/**
 * 从相机选择图片
 * @param ok 成功回调
 * @param cancel 失败回调
 */
// export const selectImage = (ok?,cancel?) => {
//     console.log('选择图片');
//     const image = new ImagePicker();
//     image.init();
//     image.selectFromLocal({
//         success: (path) => {
//             console.log('selectFromLocal-----',path);
//             ok && ok(path);
//             close && close.callback(close.widget);
//         },
//         fail: (result) => {
//             cancel && cancel(result);
//             close && close.callback(close.widget);
//         },
//         useCamera: 1,
//         single: 1,
//         max: 1
//     });
//     let close;
//     setTimeout(()=>{
//         close = popNew('app-components1-loading-loading', { text: '导入中...' });
//     },100);
// };

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

/**
 * get 请求
 */
export const getRequest = (url:string) => {
    return new Promise((resolve,reject)=>{
        let httpHelper = new HttpHelper();
        httpHelper.init();
        httpHelper.getConnection({
                url,
                success: (result) => {
                    resolve(result);
                }
                , fail: (result) => {
                    reject(result);
                }
            }
        );
    });
    
}

/**
 * post 请求
 */
export const postRequest = (url:string,param:any) =>{
    let httpHelper = new HttpHelper();
    httpHelper.init();
    httpHelper.postConnection({
            url,
            json:JSON.stringify(param),
            success: (result) => {
                alert("请求结果\t" + result)
            }
            , fail: (result) => {
                alert("请求失败 错误信息\t" + result)
            }
        }
    );
}