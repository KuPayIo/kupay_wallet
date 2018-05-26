import { Widget } from "../../../pi/widget/widget";

export class GroupWallet extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage(event: any) {
        this.ok && this.ok()
    }
}