/**
 * 确认提示框
 */
import { QRCode } from '../../../../pi/browser/qrcode';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    mType: string;
    text: string;
    center?: boolean;
    inputType?: string;
}

export class MessageBox extends Widget {
    public props: Props;
    public ok: (r: any) => void;
    public cancel: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: 'top' } }; 
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = { isShow: false, tags: '',addresse:'' };
        this.state.textAreaStyle = {
            border:'none'
        };
        this.state.textInputStyle = {
            border:'none',
            background:'#F8F8F8'
        };
        this.init();
    }

    /**
     * 点击确认
     */
    public doClickSure() {
        this.ok && this.ok({ addresse:this.state.addresse,tags:this.state.tags });
    }

    /**
     * 点击取消
     */
    public doClickCancel() {
        this.cancel && this.cancel();
    }

    /**
     * 标签名输入框数据改变
     */
    public tagsChange(e: any) {
        this.state.tags = e.value;
    }

    /**
     * 地址输入框数据改变
     */
    public addresseChange(e: any) {
        this.state.addresse = e.value;
    }

    /**
     * 点击扫码按钮
     */
    public scanClicked() {
        // TODO 扫描二维码
        const qrcode = new QRCode();
        qrcode.init();
        qrcode.scan({
            success: (addr) => {
                alert(addr);
            },
            fail: (r) => {
                alert(r);
            }
        });
    }
    
    private init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
    }

}
