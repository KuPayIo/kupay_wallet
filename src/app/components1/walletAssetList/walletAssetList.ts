/**
 * wallet home asset list
 */
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { register } from '../../store/memstore';
import { getCurrencyUnitSymbol } from '../../utils/tools';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    assetList:any[];
    redUp:boolean;
    currencyUnitSymbol:string;
}
export class WalletAssetList extends Widget {
    public props:Props;

    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
    }
    public itemClick(e:any,index:number) {
        notify(e.node,'ev-item-click',{ index }); 
    }

    public currencyUnitChange() {
        this.state.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }
}

// 货币单位变化
register('currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});
