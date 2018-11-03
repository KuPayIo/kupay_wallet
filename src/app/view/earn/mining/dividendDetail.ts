/**
 * 分红说明
 */
// ================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget} from '../../../../pi/widget/widget';
import { register } from '../../../store/memstore';
import { getLang } from '../../../../pi/util/lang';

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
        this.state = {
            cfgData:this.language
        };
        
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}


register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});
