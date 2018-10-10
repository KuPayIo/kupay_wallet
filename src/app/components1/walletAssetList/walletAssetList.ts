/**
 * wallet home asset list
 */
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    assetList:any[];
    redUp:boolean;
}
export class WalletAssetList extends Widget {
    public props:Props;

    public itemClick(e:any,index:number) {
        notify(e.node,'ev-item-click',{ index }); 
    }
}
