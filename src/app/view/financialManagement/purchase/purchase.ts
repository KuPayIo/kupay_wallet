/**
 * 确认购买
 */
// ===============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { openBasePage } from '../../../utils/tools';
// ==================================================导出
export class ProductDetail extends Widget {
    public ok: (r:any) => void;
    constructor() {
        super();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props,oldProps);
        console.log(props);
        this.init();
    }
    public init() {
        this.state = {}; 
    }
    public close() {
        this.ok && this.ok('');
    }
    public async purchaseClicked() {
        const passwd = await openBasePage('app-components-message-messageboxPrompt', {
            title: '输入密码', content: '您的云账户余额不够，将从本地钱包中扣除差款。', inputType: 'password'
        }).then((r) => {
            this.ok && this.ok(r);
        });
    }
}