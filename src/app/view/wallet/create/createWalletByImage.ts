/**
 * create a wallet by image
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { calcImgArgon2Hash, CreateWalletType } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { getModulConfig } from '../../../modulConfig';
import { getStore, setStore } from '../../../store/memstore';
import { pswEqualed } from '../../../utils/account';

export class CreateWalletByImage extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            chooseImage:false,
            imageBase64:'',
            imageHtml:'',
            imagePsw:'',
            imagePswAvailable:false,
            imgagePswConfirm:'',
            pswEqualed:false,
            walletName:getModulConfig('WALLET_NAME')
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public selectImageClick() {
        selectImage((width, height, base64) => {
            this.props.chooseImage = true;
            // tslint:disable-next-line:max-line-length
            this.props.imageHtml = `<div style="background-image: url(${base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;"></div>`;
            this.props.imageBase64 = base64;
            // console.log(base64);
            this.paint();
        });
    }

    public imagePswClick() {
        // 防止事件冒泡  on-tap事件已经处理
    }

    public imagePswChange(e:any) {
        this.props.imagePsw = e.value;
        this.props.imagePswAvailable = this.props.imagePsw.length > 0;
        this.props.pswEqualed = pswEqualed(this.props.imagePsw, this.props.imgagePswConfirm);
        this.paint();
    }

    public imagePswConfirmChange(e:any) {
        this.props.imgagePswConfirm = e.value;
        this.props.pswEqualed = pswEqualed(this.props.imagePsw, this.props.imgagePswConfirm);
        this.paint();
    }

    public nextClick() {
        if (!this.props.chooseImage) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        if (!this.props.pswEqualed) {
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }

        const imgArgon2HashPromise = calcImgArgon2Hash(this.props.imageBase64,this.props.imagePsw);
        const flags = getStore('flags');
        setStore('flags',{ ...flags,imgArgon2HashPromise });
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Image });
        this.ok && this.ok();
    }
}
