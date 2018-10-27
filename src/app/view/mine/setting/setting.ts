/**
 * setting
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyUnit } from '../../../store/interface';
import { find, register, updateStore } from '../../../store/store';
import { getLanguage, logoutAccount, logoutAccountDel, popPswBox } from '../../../utils/tools';
import { backupMnemonic } from '../../../utils/walletTools';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Setting extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.init();
    }

    public init() {
        const cfg = getLanguage(this);
        const lan = find('languageSet');
        const color = find('changeColor');
        const currencyUnit = find('currencyUnit') || CurrencyUnit.CNY;
        this.state = {
            lockScreenPsw: '',  // 锁屏密码
            openLockScreen: false,  // 是否打开锁屏开关 
            lockScreenTitle: '',  // 锁屏密码页面标题
            numberOfErrors: 0,  // 锁屏密码输入错误次数
            errorTips: cfg.errorTips,
            itemList: [
                { title: cfg.itemTitle[0], list: cfg.languageSet, selected: lan ? lan.selected : 0 },
                { title: cfg.itemTitle[1], list: cfg.currencyUnit, selected: currencyUnit },
                { title: cfg.itemTitle[2], list: cfg.changeColor, selected: color ? color.selected : 0 }
            ],
            wallet: null,
            cfgData: cfg

        };
        this.initData();
    }

    public initData() {
        const wallet = find('curWallet');
        if (wallet) {
            this.state.wallet = wallet;
        }
        const ls = find('lockScreen');
        if (ls) {
            this.state.lockScreenPsw = ls.psw;
            this.state.openLockScreen = ls.psw && ls.open !== false;
        }

        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 判断当前用户是否已经创建钱包
     */
    public judgeWallet() {
        if (this.state.wallet) {
            return true;
        }
        popNew('app-components-modalBox-modalBox', this.state.cfgData.modalBox1, () => {
            popNew('app-view-wallet-create-home');
        });

        return false;
    }
    /**
     * 处理锁屏开关切换
     */
    public onSwitchChange() {
        if (this.state.openLockScreen) {   // 如果锁屏开关打开则直接关闭
            const ls = find('lockScreen');
            ls.open = !ls.open;
            this.state.openLockScreen = false;
            updateStore('lockScreen', ls);
        } else if (this.state.wallet) {
            popNew('app-components1-lockScreenPage-lockScreenPage', { firstFg: true }, (r) => {
                if (!r) {
                    this.closeLockPsw();
                    this.state.openLockScreen = false;
                } else {
                    this.state.openLockScreen = true;
                }
            });
        } else {
            // tslint:disable-next-line:max-line-length
            popNew('app-components-modalBox-modalBox', this.state.cfgData.modalBox1, () => {
                popNew('app-view-wallet-create-home');
            }, () => {
                this.closeLockPsw();
            });
        }

        this.paint(true);
    }

    /**
     * 关闭锁屏开关
     */
    public closeLockPsw() {
        this.state.openLockScreen = false;
        this.state.lockScreenPsw = '';
        this.paint();
    }

    /**
     * 点击切换基础属性
     */
    public itemClick(ind: number) {
        if (!this.judgeWallet()) {
            return;
        }
        const data = this.state.itemList[ind];
        console.log(data);
        popNew('app-view-mine-setting-itemList', data, (index) => {
            this.state.itemList[ind].selected = index;
            if (ind === 0) {
                // tslint:disable-next-line:max-line-length
                updateStore('languageSet', { // 更新语言设置
                    selected: index === 2 ? 0 : index,
                    languageList: ['zh_Hans', 'zh_Hant', 'en']
                });
            } else if (ind === 1) {
                let currencyUnit;
                if (index === 0) {
                    currencyUnit = CurrencyUnit.CNY;
                } else {
                    currencyUnit = CurrencyUnit.USD;
                }
                updateStore('currencyUnit', currencyUnit); // 更新货币单位
            } else if (ind === 2) {
                // tslint:disable-next-line:max-line-length
                updateStore('changeColor', { // 更新涨跌颜色设置
                    selected: index,
                    colorList: ['redUp', 'greenUp']
                });
            }
            this.paint();
        });
    }

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index', { ...ret });
            this.ok && this.ok();
        }
    }

    /**
     * 退出账户不删除信息
     */
    public logOut() {
        if (!this.judgeWallet()) {
            return;
        }
        popNew('app-components-modalBox-modalBox', this.state.cfgData.modalBox2, () => {
            this.backUp();
            console.log('备份');
        }, () => {
            popNew('app-components-modalBox-modalBox', { title: '', content: this.state.cfgData.tips[2], style: 'color:#F7931A;' }, () => {
                logoutAccount();
                this.backPrePage();
            });
        });
    }

    /**
     * 注销账户
     */
    public logOutDel() {
        if (!this.judgeWallet()) {
            return;
        }
        popNew('app-components-modalBox-modalBox', this.state.cfgData.modalBox3, () => {
            this.backUp();
            console.log('备份');
        }, () => {
            popNew('app-components-modalBox-modalBox', { title: '', content: this.state.cfgData.tips[2], style: 'color:#F7931A;' }, () => {
                logoutAccountDel();
                this.backPrePage();
            });
        });
    }
}
// ================================================本地，立即执行
register('languageSet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
register('userInfo', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('curWallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('lockScreen', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});