/**
 * FAQ
 */
import { Widget } from '../../../../pi/widget/widget';

export class FAQ extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {        
            htmlStrList:[
                {
                    title:'什么是助记词？',
                    // tslint:disable-next-line:max-line-length
                    htmlStr:`<div>助记词是私钥的另一种表现形式，具有和私钥同样的功能，在导入钱包时，输入助记词并设置一个密码（不用输入原密码），就能进入钱包并拥有这个钱包的掌控权，就可以把钱包中的代币转移走，因此助记词的保密非常重要。</div>`
                },
                {
                    title:'fairblock现在有哪些币种？',
                    htmlStr:`<div>fairblock现在仅支持以太坊货币，稍后会加入更多币种</div>`
                }
            ]
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}