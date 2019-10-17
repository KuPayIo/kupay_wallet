/**
 * sendRedEnv
 */
import { getConvertRedBag, getRedCode } from '../../../earn/client/app/net/rpc';
import { ShareType } from '../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { sharePerUrl } from '../../public/config';
import { LuckyMoneyType } from '../../public/interface';
import { getStore } from '../../store/memstore';

interface Props {
    rid: string;
    rtype:string;  // '00' 等额红包  '01' 拼手气红包  '99' 邀请码
    message: string;
}
export class SendRedEnv extends Widget {
    public props: any;
    public language:any;
    public ok: () => void;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props);
        this.props.lan = getStore('setting/language','zh_Hans');
        this.props.user = getStore('user');
        // getStore('setting/language','zh_Hans').then(lan => {
        //     this.props.lan = lan;
        // });
        // getStore('user').then(user => {
        //     this.props.user = user;
        // });
    }

    /**
     * 发红包
     */
    public async sendRedEnv() {
        // const lan = this.props.lan;
        // const user = this.props.user;
        // let url = '';
        // let title = '';
        // const accId = user.info.acc_id;
        // const uid = user.conUid;
        // if (this.props.rtype === '00') {
        //     // tslint:disable-next-line:max-line-length
        //     url = `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${this.props.rid}&uid=${uid}&accId=${accId}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
        //     title = this.language.redEnvType[0]; 
        // } else if (this.props.rtype === '01') {
        //     // tslint:disable-next-line:max-line-length
        //     url = `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${this.props.rid}&uid=${uid}&accId=${accId}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
        //     title = this.language.redEnvType[1]; 
        // } else {
        //     url = `${sharePerUrl}?cid=${this.props.rid}&type=${LuckyMoneyType.Invite}&lan=${lan}`;
        //     title = this.language.redEnvType[2];
        // }
        // popNew('app-components-share-share', { 
        //     shareType: ShareType.TYPE_LINK,
        //     url,
        //     title,
        //     content:this.props.message
        // },() => {
        //     this.backPrePage();
        // },() => {
        //     this.backPrePage();
        // });
        // console.error(url);

        // 测试兑换码
        const res: any = await getRedCode(this.props.rid);
        this.props.message = JSON.parse(res.msg).cid;
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}