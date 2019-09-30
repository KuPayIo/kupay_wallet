/**
 * 顶部空白div  主要用来空出刘海高度
 */
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { register } from '../../store/memstore';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class TopDiv extends Widget {
}

register('setting/topHeight',(topHeight:number) => {
    forelet.paint(topHeight);
});