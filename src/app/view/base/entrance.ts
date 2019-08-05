import { Widget } from '../../../pi/widget/widget';
import { defaultPassword } from '../../config';
import { openWSConnect } from '../../middleLayer/wrap';
import { CreateWalletOption } from '../../publicLib/interface';
import { playerName, popNew3, popNewMessage } from '../../utils/tools';
import { CreateWalletType, touristLogin } from '../../viewLogic/localWallet';

/**
 * 登录注册
 */

export class Entrance extends Widget {
    public ok:() => void;
    // 游客登录
    public async touristLoginClick() {
        const option:CreateWalletOption = {
            psw: defaultPassword,
            nickName: await playerName()
        };
        touristLogin(option).then((secrectHash:string) => {
            if (!secrectHash) {
                popNewMessage('登录失败');

                return;
            }
            openWSConnect(secrectHash);
            
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
        popNew3('app-view-wallet-import-phoneImport',{},() => {
            this.ok && this.ok();
        });
    }

}