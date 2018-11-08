/**
 * export privateKey
 */

// =========================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { BTCWallet } from '../../../core/btc/wallet';
import { EthWallet } from '../../../core/eth/wallet';
import { AddrInfo } from '../../../store/interface';
import { getStore } from '../../../store/memstore';
import { btcNetwork, lang } from '../../../utils/constants';
import { getAddrInfoByAddr, getLanguage } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';

// ================================================导出
interface Props {
    mnemonic:string;
}
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ExportPrivateKey extends Widget {
    public ok: () => void;
    public language:any;
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.language = this.config.value[getLang()];
        this.init();
    }

    public init() {
        const wallet = getStore('wallet');
        let showCurrency = wallet.showCurrencys;
        if (!wallet || !showCurrency) {
            showCurrency = [];
        }
        let currencyRecords = wallet.currencyRecords;
        if (!wallet || !wallet.currencyRecords) {
            currencyRecords = [];
        }
        currencyRecords = getChoosedCurrencyRecords(showCurrency,currencyRecords);
        const collapseList = [];
        for (let i = 0; i < currencyRecords.length; i++) {
            const obj = {
                title: '',
                icon: '',
                textList: []
            };
            const currencyName = currencyRecords[i].currencyName;
            obj.title = currencyName;
            obj.icon = `../../res/image/currency/${currencyName}.png`;
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
                const erc20TokenKeys = this.exportPrivateKeyERC20Token(addrs,currencyName);
                obj.textList.push(...erc20TokenKeys);
            }
            collapseList.push(obj);
        }
        
        this.state = {
            collapseList,
        };
    }
    
    public backPrePage() {
        this.ok && this.ok();
    }

    public collapseChange(e: any) {
        const activeIndexs = e.activeIndexs;
    }

    public collapseItemClick(e: any) {
        const privateKey = this.state.collapseList[e.collapseListIndex].textList[e.textListIndex].privateKey;
        popNew('app-components-modalBox-modalBox2', {
            title: this.language.modalBox[0],
            content: this.language.modalBox[1],
            extraInfo: privateKey,
            copyBtnText: this.language.modalBox[2],
            contentStyle: 'color:#F17835;'
        });
    }

    // 导出以太坊私钥
    public exportPrivateKeyETH(addrs: AddrInfo[]) {
        const keys = [];
        const firstWlt = EthWallet.fromMnemonic(this.props.mnemonic, lang);
        for (let j = 0; j < addrs.length; j++) {
            const wlt = firstWlt.selectAddressWlt(j);
            const privateKey = wlt.exportPrivateKey();
            const addr = addrs[j];
            const balance = getAddrInfoByAddr(addr.addr,'ETH').balance;
            keys.push({ addr:addr.addr,balance,privateKey });
        }

        return keys;
    }

    // 导出BTC私钥
    public exportPrivateKeyBTC(addrs: AddrInfo[]) {
        const keys = [];
        const wlt = BTCWallet.fromMnemonic(this.props.mnemonic, btcNetwork, lang);
        wlt.unlock();
        for (let j = 0; j < addrs.length; j++) {
            const privateKey = wlt.privateKeyOf(j);
            const addr = addrs[j];
            const balance = getAddrInfoByAddr(addr.addr,'BTC').balance;
            keys.push({ addr:addr.addr,balance,privateKey });
        }
        wlt.lock();

        return keys;
    }

    public exportPrivateKeyERC20Token(addrs: AddrInfo[],currencyName:string) {
        const keys = [];
        const firstWlt = EthWallet.fromMnemonic(this.props.mnemonic, lang);
        for (let j = 0; j < addrs.length; j++) {
            const wlt = firstWlt.selectAddressWlt(j);
            const privateKey = wlt.exportPrivateKey();
            const addr = addrs[j];
            const balance = getAddrInfoByAddr(addr.addr,currencyName).balance;
            keys.push({ addr:addr.addr,balance,privateKey });
        }

        return keys;
    }

    /**
     * 查看私钥解释
     */
    public goDetail() {
        popNew('app-view-mine-account-privateDetail');
    }
}

// ==================================================本地
// 过滤所有私钥，返回用户选择显示币种的私钥
const getChoosedCurrencyRecords = (showCurrency:[any],currencyRecords:[any]) => {
    return currencyRecords.filter((item) => {
        let result = false;
        for (let i = 0;i < showCurrency.length;i++) {
            result = (showCurrency[i] === item.currencyName);
            if (result) break;
        }

        return result;
    });
};