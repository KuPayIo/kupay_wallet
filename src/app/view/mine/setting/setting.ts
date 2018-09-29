/**
 * setting
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { setUserInfo } from '../../../net/pull';
import { LockScreen } from '../../../store/interface';
import { find, register, updateStore } from '../../../store/store';
import { getLanguage, lockScreenHash, lockScreenVerify, popPswBox } from '../../../utils/tools';
import { backupMnemonic, VerifyIdentidy } from '../../../utils/walletTools';
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
        const cfg = getLanguage(this);
        this.state = {
            lockScreenPsw:'',  // 锁屏密码
            openLockScreen: false,  // 是否打开锁屏开关 
            lockScreenTitle: '',  // 锁屏密码页面标题
            numberOfErrors: 0,  // 锁屏密码输入错误次数
            errorTips: cfg.errorTips,
            itemList:[ 
                { title: cfg.itemTitle[3],list: cfg.languageSet,selected:0 },
                { title: cfg.itemTitle[4],list: ['CNY','USD'],selected:0 },
                { title: cfg.itemTitle[5],list: cfg.changeColor,selected:0 }
            ],
            userHead:'../../../res/image/default_avater_big.png',   // 用户头像
            userName:cfg.defaultName,  // 用户名称
            userInput:false,  // 是否显示输入框
            wallet:null,
            cfgData:cfg  
        };
        this.initData();
    }

    public initData() {
        const userInfo = find('userInfo');
        if (userInfo) {
            this.state.userHead = userInfo.avatar ? userInfo.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = userInfo.nickName ? userInfo.nickName :this.state.cfgData.defaultName;
        }
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
        popNew('app-components-modalBox-modalBox',this.state.cfgData.modalBox1,() => {
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
            ls.open = !this.state.openLockScreen;
            updateStore('lockScreen',ls);
        } else if (this.state.wallet) {
            popNew('app-components-keyboard-keyboard',{ title: this.state.cfgData.keyboardTitle[0] },(r) => {
                console.error(r);
                this.state.lockScreenPsw = r;
                this.reSetLockPsw();
                
            },() => {
                this.closeLockPsw();

                return false;
            });
        } else {
            // tslint:disable-next-line:max-line-length
            popNew('app-components-modalBox-modalBox',this.state.cfgData.modalBox1,() => {
                popNew('app-view-wallet-create-home');
            },() => {
                this.closeLockPsw();
            });
        }
        this.state.openLockScreen = !this.state.openLockScreen;
        this.paint();
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
     * 重复锁屏密码
     */
    public reSetLockPsw() {
        popNew('app-components-keyboard-keyboard',{ title: this.state.cfgData.keyboardTitle[1] },(r) => {
            if (this.state.lockScreenPsw !== r) {
                popNew('app-components-message-message',{ content:this.state.cfgData.tips[0] });
                this.reSetLockPsw();
            } else {
                const hash256 = lockScreenHash(r);
                const ls:LockScreen = find('lockScreen'); 
                ls.psw = hash256;
                ls.open = true;
                updateStore('lockScreen',ls);
                popNew('app-components-message-message',{ content:this.state.cfgData.tips[1] });
            }
        },() => {
            this.closeLockPsw();
        });
    }

    /**
     * 输入原锁屏密码
     */
    public oldLockPsw(ind:number) {
        if (ind > 2) {
            // tslint:disable-next-line:max-line-length
            popNew('app-components-modalBoxInput-modalBoxInput',this.state.cfgData.modalBoxInput,(r) => {
                const wallet = find('curWallet');
                const fg = VerifyIdentidy(wallet,r);
                // const fg = true;
                if (fg) {
                    popNew('app-components-keyboard-keyboard',{ title:this.state.cfgData.keyboardTitle[0] },(r) => {
                        this.state.lockScreenPsw = r;
                        this.reSetLockPsw();
                        
                    },() => {
                        this.closeLockPsw();

                        return false;
                    });
                } 
            });
        } else {
            popNew('app-components-keyboard-keyboard',{ title:this.state.errorTips[ind] },(r) => {
                if (lockScreenVerify(r)) {
                    popNew('app-components-keyboard-keyboard',{ title:this.state.cfgData.keyboardTitle[0] },(r) => {
                        this.state.lockScreenPsw = r;
                        this.reSetLockPsw();
                        
                    },() => {
                        this.closeLockPsw();

                        return false;
                    });
                } else {
                    this.oldLockPsw(++ind);
                }
            });
        }
        
    }

    /**
     * 点击切换基础属性
     */
    public itemClick(ind:number) {
        if (!this.judgeWallet()) {
            return;
        }
        if (ind === 0) {
            popNew('app-view-mine-setting-phone');
        } else if (ind === 1) {
            popNew('app-view-mine-setting-changePsw');
        } else {
            const data = this.state.itemList[ind - 2];
            console.log(data);
            popNew('app-view-mine-setting-itemList',data,(index) => {
                this.state.itemList[ind - 2].selected = index;
                // if (ind === 2) {
                //     updateStore('languageSet',{ selected:index,languageList:this.state.cfgData.languageSet });  // 更新语言设置
                // }
                this.paint();
            });
        }
    }

    /**
     * 点击可输入用户名
     */
    public changeInput() {
        if (!this.judgeWallet()) {
            return;
        }
        this.state.userInput = true;
        this.paint();
    }

    /**
     * 监听用户名修改
     */
    public userNameChange(e:any) {
        if (e.value !== this.state.userName) {
            this.state.userName = e.value;
        }
    }

    /**
     * 取消聚焦后更新用户名
     */
    public userNameConfirm() {
        const userInfo = find('userInfo');
        if (userInfo.nickName !== this.state.userName) {
            userInfo.nickName = this.state.userName;
            updateStore('userInfo',userInfo);
            setUserInfo();
        }
    }

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index',{ ...ret });
            this.ok && this.ok();
        }
    }

    /**
     * 注销账户
     */
    public logOut() {
        if (!this.judgeWallet()) {
            return;
        }
        popNew('app-components-modalBox-modalBox',this.state.cfgData.modalBox2,() => {
            this.backUp();
            console.log('备份');
        },() => {
            popNew('app-components-modalBox-modalBox',{ title:'',content:this.state.cfgData.tips[2],style:'color:#F7931A;' },() => {
                updateStore('curWallet',null);
                updateStore('userInfo',null);
                this.backPrePage();
                console.log('注销账户');
            });
        });
    }
}
// ================================================本地，立即执行
register('languageSet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
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