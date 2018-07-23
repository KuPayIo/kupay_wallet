/**
 * 地址详情
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { copyToClipboard,shareToQrcode } from '../../../utils/tools';

interface Props {
    currencyName:string;
    currencyBalance: string;
    addr: string;
    title?: string;
}

export class AddressDetail extends Widget {
    public props: Props;

    public ok: () => void;

    constructor() {
        super();
    }
    /**
     * setProps
     */
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        this.state = { title: this.props.title || '收款' };
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    // 复制
    public copyClick() {
        copyToClipboard(this.props.addr);
        popNew('app-components-message-message', { itype: 'success', content: '复制成功', center: true });
    }

    public shareToFriends() {
        shareToQrcode(this.props.addr);
    }
}
