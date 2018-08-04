/**
 * red-envelope details
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
interface Props {
    rid:string;// 红包id
    uid:string;// 用户id
    rtype:number;// 红包类型
    ctype:number;// 币种
    code:string;// 兑换码
    amount:number;// 兑换金额
    leaveMsg:string;// 留言
}
// 枚举货币类型
const CurrencyType  = {
    100:'KT',
    101:'ETH'
};
export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            currencyName:CurrencyType[props.ctype],
            rules:['1.安装Fairblock，创建钱包',
                '2.在钱包里点击发现-发红包',
                '3.输入收到的红包码，红包金额将自动到账',
                '4.同一个红包，每人只能领取一次']
        };
    }

    public receiveClick() {
        popNew('app-shareView-redEnvelope-downloadApp');
        this.ok && this.ok();
    }

    public copyBtnClick() {
        copyToClipboard(this.props.code);
        popNew('app-shareView-components-message',{ itype:'success',center:true,content:'复制成功' });
    }
}

// 复制到剪切板
const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};