/**
 * export privateKey
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BTCWallet } from '../../../core/btc/wallet';
import { GaiaWallet } from '../../../core/eth/wallet';
import { decrypt, getAddrById,getCurrentWallet,getLocalStorage } from '../../../utils/tools';

export class ExportPrivateKey extends Widget {
    public ok:() => void;
    constructor() {
        super();
        this.init();
    }
    public init() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const walletPsw = decrypt(wallet.walletPsw);
        const currencyRecords = wallet.currencyRecords;
        const collapseList = [];
        for (let i = 0;i < currencyRecords.length; i++) {
            const obj = {
                title:'',
                icon:'',
                textList:[]
            };
            const currencyName = currencyRecords[i].currencyName;
            obj.title = currencyName;
            obj.icon = `${currencyName}.png`;
            const addrs = currencyRecords[i].addrs;
            switch (currencyName) {
                case 'ETH':
                    const ethKeys = this.exportPrivateKeyETH(addrs,walletPsw);
                    obj.textList.push(...ethKeys);
                    break;
                case 'BTC':
                    const btcKeys = this.exportPrivateKeyBTC(addrs,walletPsw);
                    obj.textList.push(...btcKeys);
                    break;
                default:
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

    public collapseChange(e:any) {
        const activeIndexs = e.activeIndexs;
    }

    public collapseItemClick(e:any) {
        const privateKey = this.state.collapseList[e.collapseListIndex].textList[e.textListIndex];
        popNew('app-components-message-messagebox', { 
            itype: 'extra', 
            title:'导出私钥' , 
            content: '私钥未经加密，导出存在风险，千万不要丢失、泄露或发送给其他人！',
            extraInfo:privateKey ,
            contentStyle:'color:#F17835;' 
        });
    }

    // 导出以太坊私钥
    public exportPrivateKeyETH(addrs:string[],walletPsw:string) {
        const keys = [];
        for (let j = 0;j < addrs.length; j++) {
            const addr = getAddrById(addrs[j]);
            const wlt = GaiaWallet.fromJSON(addr.wlt);
            const privateKey = wlt.exportPrivateKey(walletPsw);
            keys.push(privateKey);
        }

        return keys;   
    }

    // 导出BTC私钥
    public exportPrivateKeyBTC(addrs:string[],walletPsw:string) {
        const keys = [];
        for (let j = 0;j < addrs.length; j++) {
            const addr = getAddrById(addrs[j]);
            const wlt = BTCWallet.fromJSON(addr.wlt,walletPsw);
            wlt.unlock(walletPsw);
            const privateKey = wlt.privateKeyOf(j);
            wlt.lock(walletPsw);
            keys.push(privateKey);
        }

        return keys;   
    }
}