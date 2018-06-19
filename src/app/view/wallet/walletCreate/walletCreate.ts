/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BTCWallet } from '../../../core/btc/wallet';
import { GaiaWallet } from '../../../core/eth/wallet';
import { generate } from '../../../core/genmnemonic';
import { GlobalWallet } from '../../../core/globalWallet';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletNameAvailable, walletNumLimit, walletPswAvailable } from '../../../utils/account';
import { encrypt, getDefaultAddr, getLocalStorage, setLocalStorage } from '../../../utils/tools';
import { Addr, CurrencyRecord, Wallet } from '../../interface';

export class WalletCreate extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            walletName: '',
            walletPsw: '',
            walletPswConfirm: '',
            walletPswTips: '',
            userProtocolReaded: false,
            curWalletPswStrength: getWalletPswStrength()
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public walletNameChange(e: any) {
        this.state.walletName = e.value;
    }
    public walletPswChange(e: any) {
        this.state.walletPsw = e.value;
        this.state.curWalletPswStrength = getWalletPswStrength(this.state.walletPsw);
        this.paint();
    }
    public walletPswConfirmChange(e: any) {
        this.state.walletPswConfirm = e.value;
    }
    public walletPswTipsChange(e: any) {
        this.state.walletPswTips = e.value;
    }
    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    public agreementClick() {
        popNew('app-view-wallet-agreementInterpretation-agreementInterpretation');
    }
    public createWalletClick() {
        if (!this.state.userProtocolReaded) {
            // popNew("app-components-message-message", { itype: "notice", content: "请阅读用户协议" })
            return;
        }
        if (!walletNameAvailable(this.state.walletName)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '钱包名称错误', content: '请输入1-24位钱包名', center: true });

            return;
        }
        if (!walletPswAvailable(this.state.walletPsw)) {
            popNew('app-components-message-message', { itype: 'error', content: '密码格式不正确,请重新输入', center: true });

            return;
        }
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {
            popNew('app-components-message-message', { itype: 'error', content: '密码不一致，请重新输入', center: true });

            return;
        }
        if (!this.createWallet()) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包数量已达上限', center: true });
            this.ok && this.ok();

            return;
        }

        const close = popNew('pi-components-loading-loading', { text: '创建中...' });
        setTimeout(() => {
            close.callback(close.widget);
            this.ok && this.ok();
            popNew('app-view-wallet-backupWallet-backupWallet');
        }, 500);
    }

    public createWallet() {
        const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '' };
        const addrs: Addr[] = getLocalStorage('addrs') || [];
        const len = wallets.walletList.length;
        if (len >= walletNumLimit) return false;
        // 创建钱包基础数据
        const wallet: Wallet = {
            walletId: '',
            avatar: getAvatarRandom(),
            walletPsw: encrypt(this.state.walletPsw),
            gwlt: '',
            showCurrencys: ['ETH', 'BTC', 'EOS'],
            currencyRecords: []
        };
        // 生成助记词
        const mm = generate('english', 128);
        // 给钱包的默认货币创建首地址
        // 创建eth钱包首地址，并在钱包对象上存放
        const gwlt = createEthGwlt(wallet, addrs, mm, this.state.walletPsw, this.state.walletName);
        // 创建btc钱包首地址
        createBtcGwlt(wallet, addrs, mm, this.state.walletPsw);
        // 存储
        wallet.walletId = gwlt.address;
        wallet.gwlt = gwlt.toJSON();

        if (this.state.walletPswTips.trim().length > 0) {
            wallet.walletPswTips = encrypt(this.state.walletPswTips.trim());
        }
        wallets.curWalletId = gwlt.address;
        wallets.walletList.push(wallet);
        setLocalStorage('addrs', addrs, false);
        setLocalStorage('wallets', wallets, true);
        console.log(GlobalWallet.generate(this.state.walletPsw,this.state.walletName));
        
        return true;
    }

    public importWalletClick() {
        popNew('app-view-wallet-walletImport-walletImport');
    }
}

const createEthGwlt = (wallet, addrs, mm, walletPsw, walletName) => {
    const gwlt = GaiaWallet.fromMnemonic(mm, 'english', walletPsw);
    gwlt.nickName = walletName;
    const currencyRecord: CurrencyRecord = {
        currencyName: 'ETH',
        currentAddr: gwlt.address,
        addrs: [gwlt.address]
    };
    wallet.currencyRecords.push(currencyRecord);
    addrs.push({
        addr: gwlt.address,
        addrName: getDefaultAddr(gwlt.address),
        gwlt: gwlt.toJSON(),
        record: [],
        balance: 0,
        currencyName: 'ETH'
    });

    return gwlt;
};

const createBtcGwlt = (wallet, addrs, mm, walletPsw) => {
    // todo 测试阶段，使用测试链，后续改为主链
    const gwlt = BTCWallet.fromMnemonic(walletPsw, mm, 'testnet', 'english');
    // gwlt.nickName = walletName;
    gwlt.unlock(walletPsw);
    const address = gwlt.derive(0);
    gwlt.lock(walletPsw);
    const currencyRecord: CurrencyRecord = {
        currencyName: 'BTC',
        currentAddr: address,
        addrs: [address]
    };
    wallet.currencyRecords.push(currencyRecord);

    addrs.push({
        addr: address,
        addrName: getDefaultAddr(address),
        gwlt: gwlt.toJSON(),
        record: [],
        balance: 0,
        currencyName: 'BTC'
    });

    return gwlt;
};