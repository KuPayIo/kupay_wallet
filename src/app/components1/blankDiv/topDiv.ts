/**
 * 顶部空白div  主要用来空出刘海高度
 */
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStoreData } from '../../middleLayer/wrap';
import { registerStoreData } from '../../viewLogic/common';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class TopDiv extends Widget {
    public create() {
        super.create();
        this.props = {
            height:0
        };
        getStoreData('setting/topHeight').then(topHeight => {
            this.props.height = topHeight;
            this.paint();
        });
    }
}

registerStoreData('setting/topHeight',(topHeight:number) => {
    const w = forelet.getWidget(WIDGET_NAME);
    forelet.paint(topHeight);
    if (w) {
        w.props.height = topHeight;
        w.paint();
    }
});