/**
 * mnemonic backup confirm page
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { decrypt, getAddrById, getCurrentWallet, getLocalStorage,resetAddrById,setLocalStorage,shuffle } from '../../../utils/tools';

export class BackupMnemonicConfirm extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public init() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        const walletPsw = decrypt(wallet.walletPsw);
        const mnemonic = gwlt.exportMnemonic(walletPsw).split(' ');
        const shuffledMnemonic = this.initMnemonic(mnemonic);
        this.state = {
            mnemonic,
            confirmedMnemonic: [],
            shuffledMnemonic
        };
    }

    // 对助记词乱序和标识处理
    public initMnemonic(arr: any[]) {
        return this.initActive(shuffle(arr));
    }

    // 初始化每个助记词标识是否被点击
    public initActive(arr: any[]): any[] {
        const res = [];
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            const obj = {
                word: '',
                isActive: false
            };
            obj.word = arr[i];
            res.push(obj);
        }

        return res;
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public nextStepClick() {
        if (!this.compareMnemonicEqualed()) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '请检查助记词', content: '' });
        } else {
            popNew('app-components-message-messagebox',
             { itype: 'confirm', title: '助记词即将移除', content: 'Start navigation to Restaurant Mos Eisley?' }, 
             () => {
                 this.deleteMnemonic();
                 this.ok && this.ok();
             }, () => {
                 this.ok && this.ok();
             });
        }
    }

    public deleteMnemonic() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const psw = decrypt(wallet.walletPsw);
        const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        // 删除主线助记词
        gwlt.deleteMnemonic(psw);
        wallet.gwlt = gwlt.toJSON();
        // 删除第一个地址下的助记词
        const addr0 = wallet.currencyRecords[0].addrs[0];
        const addr = getAddrById(addr0);
        addr.gwlt = gwlt.toJSON();
        resetAddrById(addr0,addr);
        setLocalStorage('wallets', wallets);
    }

    public shuffledMnemonicItemClick(e:Event, v:number) {
        const mnemonic = this.state.shuffledMnemonic[v];
        if (mnemonic.isActive) return;
        mnemonic.isActive = true;
        this.state.confirmedMnemonic.push(mnemonic);
        this.paint();
    }

    public confirmedMnemonicItemClick(e:Event, v:number) {
        const arr = this.state.confirmedMnemonic.splice(v, 1);
        arr[0].isActive = false;
        this.paint();
    }

    public compareMnemonicEqualed(): boolean {
        let isEqualed = true;
        const len = this.state.mnemonic.length;
        if (this.state.confirmedMnemonic.length !== len) return false;
        for (let i = 0; i < len; i++) {
            if (this.state.confirmedMnemonic[i].word !== this.state.mnemonic[i]) {
                isEqualed = false;
                break;
            }
        }
        
        return isEqualed;
    }
}