/**
 * wallet home asset list
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    assetList:[];
}
export class WalletAssetList extends Widget {
    public props:Props;

    public itemClick(e:any,index:number) {
        notify(e.node,'ev-item-click',{ index }); 
    }
}