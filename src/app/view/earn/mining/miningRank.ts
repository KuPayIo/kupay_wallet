/**
 * 挖矿及矿山排名
 */
// ============================== 导入
import { Json } from '../../../../pi/lang/type';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getUserInfo } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class DividendItem extends Widget {
    public ok: () => void;
    public language: any;

    public backPrePage() {
        this.ok && this.ok();
    }

    public setProps(props: Json, oldProps?: Json) {
        super.setProps(props, oldProps);
        this.language = this.config.value[getLang()];
        const userInfo = getUserInfo();
        this.props = {
            ...this.props,
            data: this.props.data,
            userImg: userInfo.avatar || '../res/image/default_avater_big.png',
            totalNum: this.props.totalNum,
            more: false
        };

    }
}
