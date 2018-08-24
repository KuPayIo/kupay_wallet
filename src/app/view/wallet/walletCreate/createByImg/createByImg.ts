/**
 * creation complete
 */
import { ImagePicker } from '../../../../../pi/browser/imagePicker';
import { popNew } from '../../../../../pi/ui/root';
import { drawImg } from '../../../../../pi/util/canvas';
import { Widget } from '../../../../../pi/widget/widget';
import { ahash } from '../../../../utils/ahash';

export class CreateComplete extends Widget {
    public ok: () => void;
    public reader: FileReader = new FileReader();
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            choosedImg: false,// 是否选择图片
            // tslint:disable-next-line:max-line-length
            imgBase64Data: '',// 图片base64
            inputWords: '',// 输入字符串
            imgStr: '',
            imgWidth: 0,
            imgHeight: 0
        };

    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public chooseImg() {
        console.log('选择图片');
        const close = popNew('app-components-loading-loading', { text: '导入中...' });

        // tslint:disable-next-line:no-this-assignment
        const thisObj = this;
        const image = new ImagePicker();
        image.init();
        image.selectFromLocal({
            success: (width, height, result) => {
                // alert('成功');
                thisObj.state.imgWidth = width;
                thisObj.state.imgHeight = height;
                thisObj.state.imgBase64Data = result;
                thisObj.state.choosedImg = true;
                // tslint:disable-next-line:max-line-length
                this.state.imgStr = `<div style="background-image: url(${this.state.imgBase64Data});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;"></div>`;
                thisObj.paint();
                close.callback(close.widget);
            },
            fail: (result) => {
                close.callback(close.widget);
                popNew('app-components-message-message', { itype: 'notice', content: '导入失败', center: true });
            },
            useCamera: 1,
            single: 1,
            max: 1
        });
    }

    public inputIng(event: any) {
        const currentValue = event.currentTarget.value;
        this.state.inputWords = currentValue;
    }
    public nextStep() {
        if (this.state.choosedImg === false) {
            popNew('app-components-message-messagebox', { itype: 'message', title: '提示', content: '请选择图片' });

            return;
        }
        if (this.state.inputWords === '') {
            popNew('app-components-message-messagebox', { itype: 'message', title: '提示', content: '请输入字符' });

            return;
        }

        const img = new Image();
        img.onload = () => {
            const ab = drawImg(img);
            const r = ahash(new Uint8Array(ab), img.width, img.height, 4);
            popNew('app-view-wallet-walletCreate-createByImg-walletCreate', {
                choosedImg: r, inputWords: this.state.inputWords
            });
            this.ok && this.ok();

        };
        img.src = this.state.imgBase64Data;

    }
    public removeImg() {
        this.state.choosedImg = false;
        this.paint();
    }

}
