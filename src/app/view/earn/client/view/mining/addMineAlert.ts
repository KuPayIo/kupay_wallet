/**
 * 矿上增加提醒
 */
import { Widget } from '../../../../../../pi/widget/widget';

interface Props {
    addNum:number|string;
    iconType:string;
}
export class AddMineAlert extends Widget {
    public ok : () => void;
    public props:Props = {
        addNum:'0',
        iconType:'KT'
    };
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