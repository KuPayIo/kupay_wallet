/**
 * export privateKey
 */

// =========================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../middleLayer/memBridge';
import { callExportBTCPrivateKey, callExportERC20TokenPrivateKey, callExportETHPrivateKey } from '../../../middleLayer/walletBridge';
import { ERC20Tokens } from '../../../publicLib/config';
import { calCurrencyLogoUrl } from '../../../utils/tools';

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
        this.props = {
            ...this.props,
            collapseList:[]
        };
        getStoreData('wallet').then(wallet => {
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
                obj.icon = calCurrencyLogoUrl(currencyName);
                const addrs = currencyRecords[i].addrs;
    
                switch (currencyName) {
                    case 'ETH':
                        callExportETHPrivateKey(this.props.mnemonic,addrs).then(ethKeys => {
                            obj.textList.push(...ethKeys);
                            this.paint();
                        });
                        break;
                    case 'BTC':
                        callExportBTCPrivateKey(this.props.mnemonic,addrs).then(btcKeys => {
                            obj.textList.push(...btcKeys);
                            this.paint();
                        });
                        
                        break;
                    default:
                }
                if (ERC20Tokens[currencyName]) {
                    callExportERC20TokenPrivateKey(this.props.mnemonic,addrs,currencyName).then(erc20TokenKeys => {
                        obj.textList.push(...erc20TokenKeys);
                        this.paint();
                    });
                    
                }
                collapseList.push(obj);
            }
            this.props.collapseList = collapseList;
        });
    }
    
    public backPrePage() {
        this.ok && this.ok();
    }

    public collapseChange(e: any) {
        const activeIndexs = e.activeIndexs;
    }

    public collapseItemClick(e: any) {
        const privateKey = this.props.collapseList[e.collapseListIndex].textList[e.textListIndex].privateKey;
        popNew('app-components-allModalBox-modalBox2', {
            title: this.language.modalBox[0],
            content: this.language.modalBox[1],
            extraInfo: privateKey,
            copyBtnText: this.language.modalBox[2],
            contentStyle: 'color:#F17835;'
        });
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