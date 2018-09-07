import { ImagePicker } from '../../pi/browser/imagePicker';
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