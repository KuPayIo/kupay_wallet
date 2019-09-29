/**
 * 分红说明
 */
// ================================ 导入
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../publicLib/modulConfig';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class DividendDetail extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.props = {
            walletName: getModulConfig('WALLET_NAME'),
            ktShow:getModulConfig('KT_SHOW')
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}
