/**
 * group wallet
 */
import { Widget } from '../../../pi/widget/widget';

export class GroupWallet extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}