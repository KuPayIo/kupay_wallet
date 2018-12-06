/**
 * 分红说明
 */
// ================================ 导入
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}
