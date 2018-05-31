/**
 * change password step three
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { pswEqualed } from '../../../utils/account';
import { 
    decrypt, 
    encrypt, 
    getAddrsAll ,
    getCurrentWallet, 
    getCurrentWalletIndex, 
    getLocalStorage,
    setLocalStorage 
} from '../../../utils/tools';

export class ChangePasswordStep3 extends Widget {
    public ok:() => void;
    constructor() {
        super();
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
        const walletIndex = getCurrentWalletIndex(wallets);
        const walletPswOld = decrypt(wallet.walletPsw);

        // 最外层gwlt修改
        const gwltNew = this.generateNewGaiaWallet(walletPswOld,this.props.psw,wallet.gwlt);
        wallet.gwlt = gwltNew.toJSON();
        wallet.walletPsw = encrypt(this.state.inputValue);

        const needUpdateAddrs = getAddrsAll(wallet);
        // 货币列表下所有的地址的gwlt修改
        this.addrsGaiaWalletChange(needUpdateAddrs,walletPswOld,this.props.psw);

        setLocalStorage('wallets',wallets);
    }
    /**
     * 使用新密码生成GaiaWallet对象
     * @param oldPsw old password
     * @param newPsw new password
     * @param oldGwlt old GaiaWallet string
     * @return new GaiaWallet
     */
    public generateNewGaiaWallet(oldPsw:string,newPsw:string,oldGwlt:string):GaiaWallet {
        const gwltOld = GaiaWallet.fromJSON(oldGwlt);
        let gwltNew = null;
        try {
            const mnemonic = gwltOld.exportMnemonic(oldPsw);
            gwltNew = GaiaWallet.fromMnemonic(mnemonic,'english',newPsw);
        } catch (e) {
            const privateKey = gwltOld.exportPrivateKey(oldPsw);
            gwltNew = GaiaWallet.fromPrivateKey(newPsw,privateKey);
        }
        gwltNew.nickName = gwltOld.nickName;

        return gwltNew;
    }

    /**
     * 更新addrs里面的GaiaWallet对象
     * @param addrs need to update's addrs
     * @param oldPsw old password
     * @param newPsw new password
     * @return new addrs
     */
    public addrsGaiaWalletChange(needUpdateAddrs:string[],oldPsw:string,newPsw:string) {
        const addrs = getLocalStorage('addrs');
        addrs.forEach((item) => {
            if (needUpdateAddrs.indexOf(item.addr) >= 0) {
                const gwltNew = this.generateNewGaiaWallet(oldPsw,newPsw,item.gwlt);
                item.gwlt = gwltNew.toJSON();
            }
        });
        setLocalStorage('addrs',addrs);
    }

}