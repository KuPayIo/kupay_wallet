/**
 * change password step three
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BTCWallet } from '../../../core/btc/wallet';
import { ERC20TokensTestnet } from '../../../core/eth/tokens';
import { GaiaWallet } from '../../../core/eth/wallet';
import { GlobalWallet } from '../../../core/globalWallet';
import { pswEqualed } from '../../../utils/account';
import { btcNetwork,lang } from '../../../utils/constants';
import { 
    decrypt, 
    encrypt, 
    getAddrsAll ,
    getCurrentWallet, 
    getLocalStorage,
    setLocalStorage 
} from '../../../utils/tools';

export class ChangePasswordStep3 extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            style:{
                backgroundColor:'#f8f8f8',
                fontSize: '24px',
                color: '#8E96AB',
                lineHeight:'33px'
            },
            inputValue:''
        };
        
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public btnClick() {
        if (!pswEqualed(this.props.psw,this.state.inputValue)) {
            popNew('app-components-message-message', { itype: 'error', content: '两次密码输入不一致',center:true });

            return;
        }
        this.changeAllPassword();
        popNew('app-components-message-message', { itype: 'success', content: '密码修改成功', center: true });
        this.ok && this.ok();
    }

    public inputChange(e:any) {
        this.state.inputValue = e.value;
    }

    /**
     * 修改所有与当前钱包相关联的GaiaWallet的密码
     */
    public changeAllPassword() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const walletPswOld = decrypt(wallet.walletPsw);

        // 货币列表下所有的地址的wlt修改
        const needUpdateAddrs = getAddrsAll(wallet);
        this.addrsGaiaWalletChange(needUpdateAddrs,walletPswOld,this.props.psw);

        // 最外层gwlt修改
        const gwlt =  GlobalWallet.fromJSON(wallet.gwlt);
        gwlt.passwordChange(walletPswOld,this.props.psw);
        wallet.gwlt = gwlt.toJSON();
        wallet.walletPsw = encrypt(this.state.inputValue);
        setLocalStorage('wallets',wallets);

    }

    /**
     * 更新addrs里面的GaiaWallet对象
     * @param addrs need to update's addrs
     * @param oldPsw old password
     * @param newPsw new password
     * @return new addrs
     */
    public addrsGaiaWalletChange(needUpdateAddrs:string[],oldPsw:string,newPsw:string) {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        const seed = gwlt.exportSeed(oldPsw);
        const addrs = getLocalStorage('addrs');
        addrs.forEach((item) => {
            if (needUpdateAddrs.indexOf(item.addr) >= 0) {
                if (ERC20TokensTestnet[item.currencyName]) {
                    const gaiaWallet = GaiaWallet.fromSeed(newPsw,seed,lang);
                    item.wlt = gaiaWallet.toJSON();
                    
                    return;
                }
                switch (item.currencyName) {
                    case 'ETH':
                        const gaiaWallet = GaiaWallet.fromSeed(newPsw,seed,lang);
                        item.wlt = gaiaWallet.toJSON();
                        break;
                    case 'BTC':
                        const btcWallet = BTCWallet.fromSeed(newPsw,seed,btcNetwork,lang);
                        item.wlt = btcWallet.toJSON();
                        break;
                    default:
                }
            }
        });
        setLocalStorage('addrs',addrs);
    }

}