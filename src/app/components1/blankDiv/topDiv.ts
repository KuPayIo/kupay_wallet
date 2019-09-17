/**
 * 顶部空白div  主要用来空出刘海高度
 */
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStore, register } from '../../store/memstore';
import { topHeight } from '../../utils/constants';

export const forelet = new Forelet();
export class TopDiv extends Widget {
    public create() {
        super.create();
        this.state = getStore('setting/topHeight',topHeight);
    }
}

register('setting/topHeight',(topHeight:number) => {
    forelet.paint(topHeight);
});