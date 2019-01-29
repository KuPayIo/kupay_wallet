/**
 * wallet home asset list
 */
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../modulConfig';
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
    public props:any;

    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        const ktShow = getModulConfig('KT_SHOW');
        const stShow = getModulConfig('ST_SHOW');
        this.props = {
            ...this.props,
            ktShow,
            stShow,
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
    }
    public itemClick(e:any,index:number) {
        notify(e.node,'ev-item-click',{ index }); 
    }

}
