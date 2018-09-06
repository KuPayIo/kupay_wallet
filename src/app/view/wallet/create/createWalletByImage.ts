/**
 * create a wallet by image
 */
import { Widget } from '../../../../pi/widget/widget';
import { selectImage } from '../../../logic/native';

export class CreateWalletByImage extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            chooseImage:false,
            avatar:'',
            avatarHtml:''
        };
    }
    public selectImageClick() {
        selectImage((width, height, base64) => {
            this.state.chooseImage = true;
            // tslint:disable-next-line:max-line-length
            this.state.avatarHtml = `<div style="background-image: url(${base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;"></div>`;
            this.state.avatar = base64;
            this.paint();
        });
    }
}