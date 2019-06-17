/**
 * Withdraw
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { withdrawMinerFee } from '../../../config';
import { callGetCloudBalances, getStoreData } from '../../../middleLayer/memBridge';
import { callGetAddrsInfoByCurrencyName, callGetCurrentAddrInfo } from '../../../middleLayer/walletBridge';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { withdrawLimit } from '../../../utils/constants';
import { parseAccount, popNewMessage, popPswBox } from '../../../utils/tools';
import { withdraw } from '../../../viewLogic/localWallet';
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
        this.props = {
            ...this.props,
            balance:0,
            amount:0,
            minerFee,
            withdrawAddr:'',
            withdrawAddrInfo:[]
        };
        Promise.all([callGetCloudBalances(),callGetCurrentAddrInfo(currencyName)]).then(([cloudBalances,addrInfo]) => {
            const balance = cloudBalances.get(CloudCurrencyType[currencyName]);
            this.props.balance = balance;
            this.props.withdrawAddr = addrInfo.addr;
            this.paint();
        });
        this.parseAddrsInfo();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    public minerFeeDescClick() {
        const ktShow = getModulConfig('KT_SHOW');
        const tips = {
            zh_Hans:{ 
                title:'提币收费标准',
                content:'无论单笔提币数量多少，每笔提币均会消耗固定费用，提币手续费将从提币数量中扣除，对应各币种，提现手续费不一致。BTC手续费固定0.001ETH/笔。ETH手续费固定收取0.01ETH/笔。提币到账时间以接收时间为准。',
                tips:`曾经拥有1000${ktShow}才具有提现权限` 
            },
            zh_Hant:{ 
                title:'提幣收費標準',
                content:'無論單筆提幣數量多少，每筆提幣均會消耗固定費用，提幣手續費將從提幣數量中扣除，對應各幣種，提現手續費不一致。BTC手續費固定0.001 ETH/筆。ETH手續費固定收取0.01ETH/筆。提幣到賬時間以接收時間為準。',
                tips:`曾經擁有1000${ktShow}才具有提現權限`
            },
            en:{}
        };
        popNew('app-components-allModalBox-modalBox1',this.language.modalBox);
    }

     // 提币金额变化
    public amountChange(e:any) {
        this.props.amount = e.value;
        this.paint();
    }

    public parseAddrsInfo() {
        Promise.all([callGetAddrsInfoByCurrencyName(this.props.currencyName),
            callGetCurrentAddrInfo(this.props.currencyName)]).then(([addrsInfo,addrInfo]) => {
                const curAddr = addrInfo.addr;
                addrsInfo.forEach(item => {
                    item.addrShow = parseAccount(item.addr);
                    item.isChoosed = item.addr === curAddr;
                });
                this.props.withdrawAddrInfo = addrsInfo;
                this.paint();
            });
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
        const realUser = await getStoreData('user/info/isRealUser');
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