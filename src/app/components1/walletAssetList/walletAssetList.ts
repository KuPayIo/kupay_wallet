/**
 * wallet home asset list
 */
import { Json } from '../../../pi/lang/type';
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { find, register } from '../../store/store';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    assetList:any[];
}
export class WalletAssetList extends Widget {
    public props:Props;

    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.state = {
            redUp:true
        };
        this.init();
    }

    public itemClick(e:any,index:number) {
        notify(e.node,'ev-item-click',{ index }); 
    }

    public init() {
        const color = find('changeColor');
        if (color) {
            this.state.redUp = color.selected === 0;
        }
        this.paint();
    }
}
register('changeColor',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});