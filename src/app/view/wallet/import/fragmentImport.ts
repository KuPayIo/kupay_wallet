/**
 * image import 
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { mnemonicFragmentDecrypt, popNewMessage } from '../../../utils/tools';
import { doScanQrCode } from '../../../viewLogic/native';
import { forelet,WIDGET_NAME } from './home';

export class FragmentImport extends Widget {
    public cancel: () => void;
    public ok: () => void;
    public language:any;
    public setProps(props:any,oldProps:any) {
        this.language = this.config.value[getLang()];
        this.props = {
            ...props,
            fragment1:'',
            fragment2:''
        };
        super.setProps(props,oldProps);
    }
    public backPrePage() {
        this.cancel && this.cancel();
    }
    public fragment1Change(e:any) {
        this.props.fragment1 = e.value;
        this.paint();
    }
    public fragment2Change(e:any) {
        this.props.fragment2 = e.value;
        this.paint();
    }
    public doScanQRCode(e:any,num:number) {
        doScanQrCode((fragment) => {
            this.props[`fragment${num}`] = fragment;
            this.paint();
        });
        console.log(num);
    }
    public nextClick() {
        if (!this.props.fragment1) {
            popNewMessage(this.language.tips[0]);

            return;
        }
        if (!this.props.fragment2) {
            popNewMessage(this.language.tips[1]);

            return;
        }
        if (this.props.fragment1 === this.props.fragment2) {
            popNewMessage(this.language.tips[2]);

            return;
        }
        const obj1 = mnemonicFragmentDecrypt(this.props.fragment1);
        const decryptFragement1 = obj1.fragment;
        const random1 = obj1.randomStr;
        const obj2 = mnemonicFragmentDecrypt(this.props.fragment2);
        const decryptFragement2 = obj2.fragment;
        const random2 = obj2.randomStr;
        if (random1 !== random2) {
            popNewMessage(this.language.tips[3]);

            return;
        }
        // tslint:disable-next-line:max-line-length
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.FragmentImport,fragment1:decryptFragement1,fragment2:decryptFragement2 },() => {
            this.ok && this.ok();
        });
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
    }
}