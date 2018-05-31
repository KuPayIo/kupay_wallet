/**
 * 收款
 */
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    currencyBalance: string;
    addr: string;
    title?: string;
}

export class AddAsset extends Widget {
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

    /**
     * 处理复制地址
     */
    public doCopy() {
        // todo 这里处理地址拷贝
    }

}
