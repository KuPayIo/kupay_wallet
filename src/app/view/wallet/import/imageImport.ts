/**
 * image import 
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { ahashToArgon2Hash, CreateWalletType } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { getStore, setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/tools';

export class ImageImport extends Widget {
    public cancel: () => void;
    public ok: () => void;
    public language:any;
    public setProps(props:any,oldProps:any) {
        this.language = this.config.value[getLang()];
        this.props = {
            ...props,
            chooseImage:false,
            imageHtml:'',
            imagePsw:'',
            imagePswAvailable:false,
            imagePicker:null
        };
        super.setProps(props,oldProps);
    }
    public backPrePage() {
        this.cancel && this.cancel();
    }
    public selectImageClick() {
        this.props.imagePicker = selectImage((width, height, url) => {
            console.log('selectImage url = ',url);
            // tslint:disable-next-line:max-line-length
            this.props.imageHtml = `<div style="background-image: url(${url});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;"></div>`;
            this.props.chooseImage = true;
            this.paint();
        });
    }

    public imagePswClick() {
        // 防止事件冒泡  on-tap事件已经处理
    }

    public imagePswChange(e:any) {
        this.props.imagePsw = e.value;
        this.props.imagePswAvailable = this.props.imagePsw.length > 0;
        this.paint();
    }

    public nextClick() {
        if (!this.props.chooseImage) {
            popNewMessage(this.language.tips[0]);

            return;
        }
        if (!this.props.imagePsw) {
            popNewMessage(this.language.tips[1]);

            return;
        }
        const imagePsw = this.props.imagePsw;
        const imgArgon2HashPromise = new Promise((resolve) => {
            this.props.imagePicker.getAHash({
                success(ahash:string) {
                    console.log('image ahash = ',ahash);
                    resolve(ahashToArgon2Hash(ahash,imagePsw));
                }
            });
        });
        setStore('flags/imgArgon2HashPromise',imgArgon2HashPromise);
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Image },() => {
            this.ok && this.ok();
        });
        // const w:any = forelet.getWidget(WIDGET_NAME);
        // if (w) {
        //     w.ok && w.ok();
        // }
    }
}