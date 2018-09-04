/**
 * standard import bu Mnemonic
 */
import { Widget } from '../../../../pi/widget/widget';

export class StandardImport extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            mnemonic:''
        };
    }
    public inputChange(r:any) {
        const mnemonic = r.value;
        this.state.mnemonic = mnemonic;
    }
}