/**
 * export privateKey
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
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
            obj.title = currencyRecords[0].currencyName;
            obj.icon = `${currencyRecords[0].currencyName}.png`;
            const addrs = currencyRecords[0].addrs;
            for (let j = 0;j < addrs.length; j++) {
                const addr = getAddrById(addrs[j]);
                const gwlt = GaiaWallet.fromJSON(addr.gwlt);
                const privateKey = gwlt.exportPrivateKey(walletPsw);
                obj.textList.push(privateKey);
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
            type: 'extra', 
            title:'导出私钥' , 
            content: '私钥未经加密，导出存在风险，千万不要丢失、泄露或发送给其他人！',
            extraInfo:privateKey ,
            contentStyle:'color:#F17835;' 
        });
    }
}