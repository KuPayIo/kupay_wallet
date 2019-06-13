/**
 * create a wallet by image
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/tools';
import { selectImage } from '../../../viewLogic/native';

export class CreateWalletByImage extends Widget {
    public cancel: () => void;
    public ok: () => void;
    public setProps(props:any,oldProps:any) {
        this.props = {
            ...props,
            chooseImage:false,
            imageHtml:'',
            imagePsw:'',
            imagePswAvailable:false,
            walletName:getModulConfig('WALLET_NAME'),
            imagePicker:null
        };
        super.setProps(this.props,oldProps);
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
        this.props.imagePswAvailable = this.props.imagePsw.length > 0 && this.props.imagePsw.match(/([\u4e00-\u9fa5]{4,})|([A-Za-z]{8,})/);
        this.paint();
    }

    public nextClick() {
        if (!this.props.chooseImage) {
            const tips = { zh_Hans:'请选择照片',zh_Hant:'請選擇照片',en:'' };
            popNewMessage(tips[getLang()]);

            return;
        }
        const imagePsw = this.props.imagePsw;
        if (this.props.imagePswAvailable) {
            const imgArgon2HashPromise = new Promise((resolve) => {
                this.props.imagePicker.getAHash({
                    success(ahash:string) {
                        console.log('image ahash = ',ahash);
                        resolve(ahashToArgon2Hash(ahash,imagePsw));
                    }
                });
            });
            setStore('flags/imgArgon2HashPromise',imgArgon2HashPromise);
            popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Image });
            this.ok && this.ok();
        }
    }
}
