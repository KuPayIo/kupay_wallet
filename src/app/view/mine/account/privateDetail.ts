/**
 * 分红说明
 */
// ================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = {
            cfgData:getLanguage(this)
        };
        
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}
