/**
 * setting
 */
// =============================================导入
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStoreData, setStoreData } from '../../middleLayer/wrap';
import { rippleShow } from '../../utils/tools';
import { registerStoreData } from '../../viewLogic/common';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Setting extends Widget {
    public ok: () => void;
    public language: any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            openLockScreen: false,  // 是否打开锁屏开关 
            lockScreenTitle: '',  // 锁屏密码页面标题
            numberOfErrors: 0,  // 锁屏密码输入错误次数
            itemList: []
        };
        this.initData();
    }

    public initData() {
        getStoreData('setting').then(setting => {
            const ls = setting.lockScreen;
            if (ls) {
                this.props.openLockScreen = ls.open !== false;
            }
            const lan = setting.language || 'zh_Hans';
            const unit = setting.currencyUnit || 'CNY';
            const color = setting.changeColor || 'redUp';

            const itemList = [
                { title: this.language.itemTitle[0], list: this.language.languageSet, selected: lan, flag: 0 },
                { title: this.language.itemTitle[1], list: this.language.currencyUnit, selected: unit, flag: 1 },
                { title: this.language.itemTitle[2], list: this.language.changeColor, selected: color, flag: 2 }
            ];
            this.props.itemList = itemList;
            this.paint();
        });
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 处理锁屏开关切换
     */
    public async onSwitchChange() {
        if (this.props.openLockScreen) {   // 如果锁屏开关打开则直接关闭
            const ls = await getStoreData('setting/lockScreen');
            ls.open = !ls.open;
            this.props.openLockScreen = false;
            setStoreData('setting/lockScreen', ls);
        } else {
            popNew('app-components1-lockScreenPage-lockScreenPage', { setting: true }, (r) => {
                if (!r) {
                    this.props.openLockScreen = false;
                } else {
                    this.props.openLockScreen = true;
                }
            });
        }

        this.paint(true);
    }

    /**
     * 点击切换基础属性 
     */
    public itemClick(ind: number) {
        const data = this.props.itemList[ind];
        popNew('app-view-mine-setting-itemList', data);
    }

}

// ================================================本地，立即执行
registerStoreData('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.initData();
    }
});
registerStoreData('setting/currencyUnit', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
registerStoreData('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
registerStoreData('setting/lockScreen', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

registerStoreData('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
