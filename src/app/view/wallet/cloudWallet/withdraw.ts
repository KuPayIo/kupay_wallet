/**
 * Withdraw
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { withdrawMinerFee } from '../../../config';
import { withdraw } from '../../../net/pullWallet';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, getStore } from '../../../store/memstore';
import { withdrawLimit } from '../../../utils/constants';
import { getAddrsInfoByCurrencyName, getCurrentAddrInfo, parseAccount, popNewMessage, popPswBox } from '../../../utils/tools';
interface Props {
    currencyName:string;
}
export class Withdraw extends Widget {
    public props:any;
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        const currencyName = this.props.currencyName;
        const minerFee = withdrawMinerFee[currencyName];
        const balance = getCloudBalances().get(CloudCurrencyType[currencyName]);
        this.props = {
            ...this.props,
            balance,
            amount:0,
            minerFee,
            withdrawAddr:getCurrentAddrInfo(currencyName).addr,
            withdrawAddrInfo:this.parseAddrsInfo()
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    public minerFeeDescClick() {
        popNew('app-components-allModalBox-modalBox1',this.language.modalBox);
    }

     // 提币金额变化
    public amountChange(e:any) {
        this.props.amount = e.value;
        this.paint();
    }

    public parseAddrsInfo() {
        const addrsInfo = getAddrsInfoByCurrencyName(this.props.currencyName);
        const curAddr = getCurrentAddrInfo(this.props.currencyName).addr;
        addrsInfo.forEach(item => {
            item.addrShow = parseAccount(item.addr);
            item.isChoosed = item.addr === curAddr;
        });

        return addrsInfo;
    }

    public chooseWithdrawAddr() {
        popNew('app-view-wallet-components-choosetWithdrawAddr',{ addrsInfo:this.props.withdrawAddrInfo },(index) => {
            const addrsInfo = this.props.withdrawAddrInfo;
            for (let i = 0;i < addrsInfo.length;i++) {
                if (i === index) {
                    addrsInfo[i].isChoosed = true;
                    this.props.withdrawAddr = addrsInfo[i].addr;
                } else {
                    addrsInfo[i].isChoosed = false;
                }
            }
            this.paint();
        });
    }

    public async withdrawClick() {
        const currencyName = this.props.currencyName;
        const limit = withdrawLimit[currencyName];
        if (Number(this.props.amount) < limit) {
            popNewMessage(this.language.tips[0] + limit + currencyName);

            return;
        }
        if (Number(this.props.amount) + this.props.minerFee > this.props.balance) {
            popNewMessage(this.language.tips[1]);

            return;
        }
        const realUser = getStore('user/info/isRealUser');
        if (!realUser) {
            popNewMessage(this.language.tips[2]);

            return;
        }
        const passwd = await popPswBox();
        if (!passwd) return;
        const success = await withdraw(passwd,this.props.withdrawAddr,this.props.currencyName,this.props.amount);
        if (success) {
            this.ok && this.ok();
        }
    }

}