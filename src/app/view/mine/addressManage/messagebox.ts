/**
 * 确认提示框
 */
import { QRCode } from '../../../../pi/browser/qrcode';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    mType: string;// prompt,confirm
    text: string;
    title:string;
    input1DefaultValue?:string;
    input2DefaultValue?:string;
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
        let input1Value = '';
        let input2Value = '';
        if (this.props.input1DefaultValue) {
            input1Value = this.props.input1DefaultValue;
        }
        if (this.props.input2DefaultValue) {
            input2Value = this.props.input2DefaultValue;
        }
        this.state = { isShow: false, tags: '',input1Value:input1Value,input2Value:input2Value };
        this.init();
    }

    /**
     * 点击确认
     */
    public doClickSure() {
        this.ok && this.ok({ addresse:this.state.input1Value,tags:this.state.input2Value });
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
        this.state.input2Value = e.value;
    }

    /**
     * 地址输入框数据改变
     */
    public addresseChange(e: any) {
        this.state.input1Value = e.value;
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
                this.state.input1Value = addr;
                this.paint();
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
