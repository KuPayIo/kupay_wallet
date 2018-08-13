/**
 * 矿山增加记录  
 * 
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find, register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = {};
        this.initData();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 挖矿项目跳转
     * @param ind 挖矿项目参数
     */
    public goDetail(ind:number) {
        if (!this.state.data[ind].isComplete) {
            console.log(this.state.data[ind].itemName);
            // popNew(this.state.data[ind].itemJump);
        }
    }

    /**
     * 获取更新数据
     */
    public async initData() {  
        const detail = find('addMine');
        this.state = {
            data:detail
        };
        this.paint();
        
    }
}

register('addMine', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});