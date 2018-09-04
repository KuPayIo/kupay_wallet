/**
 * standard import bu Mnemonic
 */
import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { importWalletByMnemonic } from '../../../logic/localWallet';
import { pswEqualed } from '../../../utils/account';

export class StandardImport extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            mnemonic:'',
            psw:'',
            pswConfirm:''
        };
    }
    public inputChange(r:any) {
        const mnemonic = r.value;
        this.state.mnemonic = mnemonic;
    }
    public nextClick(e:any) {
        if (this.state.mnemonic.length <= 0) {
            popNew('app-components-message-message', { content: '请输入助记词' });

            return;
        }
        popNew('app-components-modalBoxInput-modalBoxInput',{ title:'请输入密码',content:[] },(v1) => {
            this.state.psw = v1;
            popNew('app-components-modalBoxInput-modalBoxInput',{ title:'密码确认',content:[] },async (v2) => {
                this.state.pswConfirm = v2;
                if (!pswEqualed(this.state.psw, this.state.pswConfirm)) {
                    popNew('app-components-message-message', { content: '两次输入密码不一致' });
        
                    return;
                }
                const close = popNew('app-components1-loading-loading', { text: '导入中...' });
                try {
                    await importWalletByMnemonic(this.state.mnemonic, this.state.psw);
                } catch (e) {
                    popNew('app-components-message-message', { content: '无效的助记词' });
                } finally {
                    close.callback(close.widget);
                }
                notify(e.node,'ev-import-success',{});
            });
        });
    }
}