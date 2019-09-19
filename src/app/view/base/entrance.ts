import { Widget } from '../../../pi/widget/widget';
import { CreateWalletType, Option, touristLogin, phoneImport } from '../../logic/localWallet';
import { setStore } from '../../store/memstore';
import { getLoginMod, getDataCenter } from '../../utils/commonjsTools';
import { defaultPassword } from '../../utils/constants';
import { playerName, popNew3, popNewMessage, popNewLoading } from '../../utils/tools';
import { getWXCode } from '../../logic/native';
import { sourceIp } from '../../ipConfig';
import { getRandom, logoutAccountDel } from '../../net/login';
import { popNew } from '../../../pi/ui/root';

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
            
            this.importSuccess()
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
        popNew('app-view-wallet-import-rowPhoneLogin',{},() => {
            this.ok && this.ok();
        });
    }

    // 微信登陆
    public wechatLoginClick() {
        getWXCode(code => {
            this.wechatLogin(code)
        },()=>{
            popNewMessage('微信授权失败');
        });
    }

    public async wechatLogin (code:string) {
        const close = popNewLoading({ zh_Hans:'微信登录中',zh_Hant:'微信登錄中',en:'' });
        const option:Option = {
            psw: defaultPassword,
            nickName: await playerName()
        };
        const secretHash = await phoneImport(option);
        if (!secretHash) {
            close && close.callback(close.widget);
            popNewMessage('导入失败');

            return;
        }

        const url = `http://${sourceIp}:8099/wx/app/oauth2?code=${code}&state=_${encodeURIComponent(`http://${sourceIp}/chairMan/app/boot/index.html?from=0`)}`;
        fetch(url).then(res=>{
            res.json().then(async r=>{
                const user = r.openid;
                const password = r.rid;
                if(!user || !password){
                    this.importError('微信授权失败');
                    close && close.callback(close.widget);                
                    
                    return;
                }
                const itype = await getRandom(secretHash,2,undefined,undefined,undefined,undefined,user,password);
                console.log('getRandom itype = ',itype);
                close && close.callback(close.widget);  
                if (itype === -301) {
                    this.importError('验证码错误');
                } else if (itype === 1014) {
                    this.importSuccess();
                } else if (itype === 1) {
                    this.importSuccess();
                } else {
                    this.importError('出错啦');
                }
            });
            
        })
        
    }

    // 导入失败
    public importError(tips:string) {
        popNewMessage(tips);
        logoutAccountDel(true);
    }
    
    // 导入成功
    public importSuccess() {
        popNewMessage('登录成功');
        this.ok && this.ok();
        popNew3('app-view-base-app');
        // 刷新本地钱包
        getDataCenter().then(dataCenter => {
            dataCenter.refreshAllTx();
            dataCenter.initErc20GasLimit();
        });
    }
}