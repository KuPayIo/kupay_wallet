/**
 * 购买记录详情
 */
// ===================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { buyBack,getPurchaseRecord } from '../../../net/pull';
import { register } from '../../../store/store';
import { parseDate } from '../../../utils/tools';
// =====================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class RecordDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props,oldProps);
        this.state = this.props.item;
        this.state.purchaseTimeStampFormat = parseDate(new Date(this.state.purchaseTimeStamp))   ;
    }

    public goBackPage() {
        this.ok && this.ok();
    }
    // 阅读理财声明
    public redNotice() {
        popNew('app-view-financialManagement-notice-notice');
    }
    public  returnBack() {
        popNew('app-components-message-messagebox',{ itype: 'confirm', title: '赎回', content: '是否赎回理财产品' },async () => {
            const close = popNew('app-components-loading-loading', { text: '正在赎回...' });
            const result = await buyBack(this.state.purchaseTimeStamp);
            await getPurchaseRecord();
            close.callback(close.widget);
            if (result) {
                popNew('app-components-message-message', { itype: 'success', content: '赎回成功', center: true });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '赎回失败', center: true });
            }
        });
    }

}
// =========================================本地
register('purchaseRecord', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.state = purchaseRecord[w.props.i];
        w.state.purchaseTimeStampFormat = parseDate(new Date(w.state.purchaseTimeStamp));
        w.paint();
    }
    
});