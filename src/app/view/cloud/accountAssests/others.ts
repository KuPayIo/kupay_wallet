/**
 * 其他操作记录
 */
// ===================================================== 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail } from '../../../net/pull';
import { CurrencyType, TaskSid } from '../../../store/interface';
import { find, register } from '../../../store/store';
import { timestampFormat } from '../../../utils/tools';

// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Others extends Widget {
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        this.state = { infoList: [] };
        this.initData();
        this.initEvent();
    }

    private initData() {
        const list = find('accountDetail', CurrencyType[this.props.coinType]) || [];
        this.state.infoList = list;
        this.paint();
    }

    private initEvent() {
        getAccountDetail(<any>CurrencyType[this.props.coinType]);
    }
}

// ===================================================== 本地

register('accountDetail', (info) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

interface Props {
    coinType: string;
}