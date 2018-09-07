/**
 * image import 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { doScanQrCode } from '../../../logic/native';
import { CreateWalletType } from '../../../store/interface';
import { forelet,WIDGET_NAME } from './home';

export class FragmentImport extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            fragment1:'',
            fragment2:''
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public fragment1Change(e:any) {
        this.state.fragment1 = e.value;
        this.paint();
    }
    public fragment2Change(e:any) {
        this.state.fragment2 = e.value;
        this.paint();
    }
    public doScanQRCode(e:any,num:number) {
        doScanQrCode((fragment) => {
            this.state[`fragment${num}`] = fragment;
            this.paint();
        });
        console.log(num);
    }
    public nextClick() {
        if (!this.state.fragment1) {
            popNew('app-components-message-message', { content: '请输入片段1' });

            return;
        }
        if (!this.state.fragment2) {
            popNew('app-components-message-message', { content: '请输入片段2' });

            return;
        }
        // tslint:disable-next-line:max-line-length
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.FragmentImport,fragment1:this.state.fragment1,fragment2:this.state.fragment2 });
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
    }
}