import { Widget } from '../../../pi/widget/widget';
import { CreateWalletType, Option, touristLogin } from '../../logic/localWallet';
import { setStore } from '../../store/memstore';
import { getLoginMod } from '../../utils/commonjsTools';
import { defaultPassword } from '../../utils/constants';
import { playerName, popNew3, popNewMessage } from '../../utils/tools';

/**
 * 登录注册
 */

export class Entrance extends Widget {
    public ok:() => void;
    // 游客登录
    public async touristLoginClick() {
        const option:Option = {
            psw: defaultPassword,
            nickName: await playerName()
        };
        touristLogin(option).then((secrectHash:string) => {
            if (!secrectHash) {
                popNewMessage('登录失败');

                return;
            }
            getLoginMod().then(mod => {
                setStore('flags/createWallet',true);   // 创建钱包成功
                mod.openConnect(secrectHash);
            });
            
            this.ok && this.ok();
            popNewMessage('登录成功');
        });
        console.log('游客登录');
    }
    // 注册登录 
    public registerLoginClick() {
        console.log('注册登录');
        popNew3('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Random },() => {
            this.ok && this.ok();
        });
    }
    // 已有账户登录
    public haveAccountClick() {
        console.log('已有账户登录');
        popNew3('app-view-wallet-import-standardImport',{},() => {
            this.ok && this.ok();
        });
    }

    // 手机登录
    public phoneLoginClick() {
        // popNew3('app-view-wallet-import-phoneImport',{},() => {
        //     this.ok && this.ok();
        // });
        popNew3('app-view-wallet-import-rowPhoneLogin',{},() => {
            this.ok && this.ok();
        });
    }

    // 微信登陆
    public wechatLoginClick() {
        this.touristLoginClick();
    }

}