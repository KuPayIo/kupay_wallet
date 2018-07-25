/**
 * export privateKey
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BTCWallet } from '../../../core/btc/wallet';
import { ERC20Tokens } from '../../../core/eth/tokens';
import { GaiaWallet } from '../../../core/eth/wallet';
import { btcNetwork, lang } from '../../../utils/constants';
import { decrypt, getAddrById, getCurrentWallet, getLocalStorage,getWalletByWalletId } from '../../../utils/tools';

interface Props {
    mnemonic: string;
}
export class ExportPrivateKey extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public init() {
        const wallets = getLocalStorage('wallets');
        const wallet = getWalletByWalletId(wallets,this.props.walletId);
        const currencyRecords = wallet.currencyRecords;
        const collapseList = [];
        for (let i = 0; i < currencyRecords.length; i++) {
            const obj = {
                title: '',
                icon: '',
                textList: []
            };
            const currencyName = currencyRecords[i].currencyName;
            obj.title = currencyName;
            obj.icon = `${currencyName}.png`;
            const addrs = currencyRecords[i].addrs;

            switch (currencyName) {
                case 'ETH':
                    const ethKeys = this.exportPrivateKeyETH(addrs);
                    obj.textList.push(...ethKeys);
                    break;
                case 'BTC':
                    const btcKeys = this.exportPrivateKeyBTC(addrs);
                    obj.textList.push(...btcKeys);
                    break;
                default:
            }
            if (ERC20Tokens[currencyName]) {
                const erc20TokenKeys = this.exportPrivateKeyERC20Token(addrs);
                obj.textList.push(...erc20TokenKeys);
            }
            collapseList.push(obj);
        }
        this.state = {
            collapseList
        };

    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public collapseChange(e: any) {
        const activeIndexs = e.activeIndexs;
    }

    public collapseItemClick(e: any) {
        const privateKey = this.state.collapseList[e.collapseListIndex].textList[e.textListIndex];
        popNew('app-components-message-messagebox', {
            itype: 'extra',
            title: '导出私钥',
            content: '私钥未经加密，导出存在风险，千万不要丢失、泄露或发送给其他人！',
            extraInfo: privateKey,
            copyBtnText: '复制',
            contentStyle: 'color:#F17835;'
        });
    }

    // 导出以太坊私钥
    public exportPrivateKeyETH(addrs: string[]) {
        const keys = [];
        const firstWlt = GaiaWallet.fromMnemonic(this.props.mnemonic, lang);
        for (let j = 0; j < addrs.length; j++) {
            const wlt = firstWlt.selectAddressWlt(j);
            const privateKey = wlt.exportPrivateKey();
            keys.push(privateKey);
        }

        return keys;
    }

    // 导出BTC私钥
    public exportPrivateKeyBTC(addrs: string[]) {
        const keys = [];
        const wlt = BTCWallet.fromMnemonic(this.props.mnemonic, btcNetwork, lang);
        wlt.unlock();
        for (let j = 0; j < addrs.length; j++) {
            const privateKey = wlt.privateKeyOf(j);
            keys.push(privateKey);
        }
        wlt.lock();

        return keys;
    }

    public exportPrivateKeyERC20Token(addrs: string[]) {
        const keys = [];
        const firstWlt = GaiaWallet.fromMnemonic(this.props.mnemonic, lang);
        for (let j = 0; j < addrs.length; j++) {
            const wlt = firstWlt.selectAddressWlt(j);
            const privateKey = wlt.exportPrivateKey();
            keys.push(privateKey);
        }

        return keys;
    }
}