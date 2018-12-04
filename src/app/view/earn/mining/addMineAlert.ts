/**
 * 矿上增加提醒
 */
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    addNum:number|string;
}
export class AddMineAlert extends Widget {

    public ok : () => void;
    constructor() {
        super();
    }
      
    /**
     * 返回上一页
     */
    public close() {
        this.ok && this.ok();
    }

}