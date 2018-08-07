/**
 * 其他操作记录
 */
import { isArray } from '../../../../pi/net/websocket/util';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyType, getAccountDetail, TaskSid } from '../../../store/conMgr';
import { smallUnit2LargeUnit, timestampFormat } from '../../../utils/tools';

interface Props {
    coinType: string;
}
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
    }

    private async initData() {
        const r = await getAccountDetail(CurrencyType[this.props.coinType]);
        if (r.value.length > 0) {
            const list = [];
            r.value.forEach(v => {
                list.push({
                    type: v[0],
                    amount: smallUnit2LargeUnit(this.props.coinType, v[1]),
                    behavior: isArray(v[2]) ? v[2].map(v1 => String.fromCharCode(v1)).join('') : v[2],
                    time: timestampFormat(v[3]),
                    behaviorIcon: getIconByType(v[0])

                });
            });
            this.state.infoList = list;
            this.paint();
        }

    }
}

/**
 * 通过类型获取图标
 */
const getIconByType = (iType) => {
    if (iType === TaskSid.mines) return 'cloud_others_drag.png';
    // '发红包'---cloud_others_pockets.png
    // '分红'---cloud_others_bonus.png
};
