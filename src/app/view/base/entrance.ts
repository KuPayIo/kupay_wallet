import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { CreateWalletType, Option, touristLogin } from '../../logic/localWallet';
import { openConnect } from '../../net/login';
import { defaultPassword } from '../../utils/constants';
import { popNewMessage } from '../../utils/tools';
import { playerName } from '../../utils/walletTools';

/**
 * 登录注册
 */

export class Entrance extends Widget {
    public ok:() => void;
    // 游客登录
    public touristLoginClick() {
        const option:Option = {
            psw: defaultPassword,
            nickName: playerName()
        };
        touristLogin(option).then((secrectHash:string) => {
            if (!secrectHash) {
                popNewMessage('登录失败');

                return;
            }
            
            openConnect(secrectHash);
            this.ok && this.ok();
            popNewMessage('登录成功');
        });
        console.log('游客登录');
    }
    // 注册登录 
    public registerLoginClick() {
        console.log('注册登录');
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Random },() => {
            this.ok && this.ok();
        });
    }
    // 已有账户登录
    public haveAccountClick() {
        console.log('已有账户登录');
        popNew('app-view-wallet-import-standardImport',{},() => {
            this.ok && this.ok();
        });
    }
}