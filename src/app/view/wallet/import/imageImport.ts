/**
 * image import 
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { calcImgArgon2Hash, CreateWalletType } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { getStore, setStore } from '../../../store/memstore';
import { forelet,WIDGET_NAME } from './home';

export class ImageImport extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            chooseImage:false,
            imageBase64:'',
            imageHtml:'',
            imagePsw:'',
            imagePswAvailable:false
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public selectImageClick() {
        selectImage((width, height, base64) => {
            this.state.chooseImage = true;
            // tslint:disable-next-line:max-line-length
            this.state.imageHtml = `<div style="background-image: url(${base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;"></div>`;
            this.state.imageBase64 = base64;
            this.paint();
        });
    }

    public imagePswClick() {
        // 防止事件冒泡  on-tap事件已经处理
    }

    public imagePswChange(e:any) {
        this.state.imagePsw = e.value;
        this.state.imagePswAvailable = this.state.imagePsw.length > 0;
        this.paint();
    }

    public nextClick() {
        if (!this.state.imageBase64) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        if (!this.state.imagePsw) {
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }
        const imgArgon2HashPromise = calcImgArgon2Hash(this.state.imageBase64,this.state.imagePsw);
        const flags = getStore('flags');
        setStore('flags',{ ...flags,imgArgon2HashPromise });
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Image });
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
    }
}