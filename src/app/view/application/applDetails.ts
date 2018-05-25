import {Widget} from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

export class aboutus extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }

    public backPrePage(){
        this.ok && this.ok();
    }
}