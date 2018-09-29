/**
 * Withdraw
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { withdrawMinerFee } from '../../../config';
import { withdraw } from '../../../net/pullWallet';
import { CurrencyType } from '../../../store/interface';
import { find, getBorn } from '../../../store/store';
import { withdrawLimit } from '../../../utils/constants';
import { getAddrsInfoByCurrencyName, getCurrentAddrInfo, getLanguage, parseAccount, popNewMessage, popPswBox } from '../../../utils/tools';
interface Props {
    currencyName:string;
}
export class Withdraw extends Widget {
    public props:Props;
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const minerFee = withdrawMinerFee[currencyName];
        const balance = getBorn('cloudBalance').get(CurrencyType[currencyName]);
        this.state = {
            balance,
            amount:0,
            minerFee,
            withdrawAddr:getCurrentAddrInfo(currencyName).addr,
            withdrawAddrInfo:this.parseAddrsInfo(),
            cfgData:getLanguage(this)
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    public minerFeeDescClick() {
        popNew('app-components-modalBox-modalBox1',this.state.cfgData.modalBox);
    }

     // 提币金额变化
    public amountChange(e:any) {
        this.state.amount = Number(e.value);
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
        popNew('app-view-wallet-components-choosetWithdrawAddr',{ addrsInfo:this.state.withdrawAddrInfo },(index) => {
            const addrsInfo = this.state.withdrawAddrInfo;
            for (let i = 0;i < addrsInfo.length;i++) {
                if (i === index) {
                    addrsInfo[i].isChoosed = true;
                    this.state.withdrawAddr = addrsInfo[i].addr;
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
        if (Number(this.state.amount) < limit) {
            popNewMessage(this.state.cfgData.tips[0] + limit + currencyName);

            return;
        }
        if (Number(this.state.amount) + this.state.minerFee > this.state.balance) {
            popNewMessage(this.state.cfgData.tips[1]);

            return;
        }
        const realUser = getBorn('realUserMap').get(find('conUser'));
        if (!realUser) {
            popNewMessage(this.state.cfgData.tips[2]);

            return;
        }
        const passwd = await popPswBox();
        if (!passwd) return;
        const success = await withdraw(passwd,this.state.withdrawAddr,this.props.currencyName,this.state.amount);
        if (success) {
            this.ok && this.ok();
        }
    }

}