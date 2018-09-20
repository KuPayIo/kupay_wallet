/**
 * setting
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { LockScreen } from '../../../store/interface';
import { find, updateStore } from '../../../store/store';
import { lockScreenHash, lockScreenVerify } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';
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
        
        this.state = {
            lockScreenPsw:'',  // 锁屏密码
            openLockScreen: false,  // 是否打开锁屏开关 
            lockScreenTitle: '',  // 锁屏密码页面标题
            numberOfErrors: 0,  // 锁屏密码输入错误次数
            errorTips: ['请输入原来的密码', '已错误1次，还有两次机会', '最后1次，否则密码将会重置'],
            itemList:[ 
                { title:'语言',list:['简体中文','繁体中文','English'],selected:0 },
                { title:'货币单位',list:['CNY','USD'],selected:0 },
                { title:'涨跌颜色',list:['红涨绿跌','红跌绿涨'],selected:0 }
            ],
            userHead:'../../../res/image/default_avater_big.png',   // 用户头像
            userName:'还没有钱包',  // 用户名称
            userInput:false,  // 是否显示输入框
            wallet:null  
        };
        this.initData();
        
    }

    public initData() {
        const wallet = find('curWallet');
        if (wallet) {
            // gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            const gwlt = JSON.parse(wallet.gwlt);
            this.state.userHead = wallet.avatar ? wallet.avatar :'../../../res/image/default_avater_big.png';
            this.state.userName = gwlt.nickName;
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
        popNew('app-components-modalBox-modalBox',{ title:'提示',content:'你还没有登录，去登录使用更多功能吧',sureText:'去登录',cancelText:'暂时不' },() => {
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
            popNew('app-components-keyboard-keyboard',{ title:'设置锁屏密码' },(r) => {
                console.error(r);
                this.state.lockScreenPsw = r;
                this.reSetLockPsw();
                
            },() => {
                this.closeLockPsw();

                return false;
            });
        } else {
            popNew('app-components-modalBox-modalBox',{ title:'提示',content:'你还没有登录，去登录使用更多功能吧',sureText:'去登录',cancelText:'暂时不' },() => {
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
        popNew('app-components-keyboard-keyboard',{ title:'重复锁屏密码' },(r) => {
            console.error(r);
            if (this.state.lockScreenPsw !== r) {
                popNew('app-components-message-message',{ content:'密码不一致' });
                this.reSetLockPsw();
            } else {
                const hash256 = lockScreenHash(r);
                const ls:LockScreen = find('lockScreen'); 
                ls.psw = hash256;
                ls.open = true;
                updateStore('lockScreen',ls);
                popNew('app-components-message-message',{ content:'设置成功' });
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
            popNew('app-components-modalBoxInput-modalBoxInput',{ title:'重置锁屏',content:['错误次数过多，已被锁定，请验证当前钱包密码后重置。'],placeholder:'输入密码' },(r) => {
                const wallet = find('curWallet');
                const fg = VerifyIdentidy(wallet,r);
                // const fg = true;
                if (fg) {
                    popNew('app-components-keyboard-keyboard',{ title:'设置锁屏密码' },(r) => {
                        console.error(r);
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
                    popNew('app-components-keyboard-keyboard',{ title:'设置锁屏密码' },(r) => {
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
            popNew('app-view-mine-setting-itemList',data);
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
     * 用户名修改
     */
    public userNameChange(e:any) {
        if (e.value !== this.state.userName) {
            this.state.userName = e.value;
            const walletList = find('walletList');
            const gwlt = this.state.wallet.gwlt;
            gwlt.nickName = e.value;
            this.state.wallet.gwlt = JSON.parse(gwlt);
            updateStore('walletList', walletList);
            updateStore('curWallet', this.state.wallet);
        }
    }

    /**
     * 注销账户
     */
    public logOut() {
        if (!this.judgeWallet()) {
            return;
        }
        popNew('app-components-modalBox-modalBox',{ title:'注销账户',content:'注销前请确认已备份助记词，以便下次用它恢复。',sureText:'备份',cancelText:'继续注销' },() => {
            // popNew('');
            console.log('备份');
        },() => {
            popNew('app-components-modalBox-modalBox',{ title:'',content:'请再次确认您已备份了助记词，否则您的账户资产将永久丢失！',style:'color:#F7931A;' },() => {
                console.log('注销账户');
            });
        });
    }
}
