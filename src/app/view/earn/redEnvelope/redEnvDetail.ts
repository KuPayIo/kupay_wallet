/**
 * RedEnvDetail
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getInviteCode, getUserList, queryDetailLog, sharePerUrl } from '../../../net/pull';
import { RedEnvelopeType } from '../../../store/interface';
import { find } from '../../../store/store';
import { getLanguage } from '../../../utils/tools';

interface Props {
    rtype:number;  // 0 等额红包  1 拼手气红包
    rid:string;  // 红包ID
    curNum:number;  // 已领取个数
    totalNum:number;  // 总红包个数
    amount:number;  // 红包总金额
    ctypeShow:string;  // 货币类型名称
}
export class RedEnvDetail extends Widget {
    public props:Props;
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        const cfg = getLanguage(this);
        this.state = {
            message:cfg.message,
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' } 
            ],
            scroll:false,
            showPin:this.props.rtype === 1,  // 0 等额红包  1 拼手气红包
            cfgData:cfg,
            userName:cfg.defaultUserName,
            userHead:'../../res/image/default_avater_big.png',
            greatAmount:0,
            greatUser:-1
        };
        this.initData();
    }

    public async initData() {
        const value = await queryDetailLog(find('conUid'),this.props.rid);
        if (!value) return;
        this.state.redBagList = value[0];        
        this.state.message = value[1];

        const user = find('userInfo');
        if (!user) return;
        this.state.userName = user.nickName ? user.nickName :this.state.cfgData.defaultUserName;
        this.state.userHead = user.avatar ? user.avatar :'../../res/image/default_avater_big.png';

        const redBagList = value[0];
        for (const i in redBagList) {
            const user = await getUserList([redBagList[i].cuid]);
            this.state.redBagList[i].userName = user.nickName ? user.nickName :this.state.cfgData.defaultUserName;
            this.state.redBagList[i].avatar = user.avatar ? user.avatar :'../../res/image/default_avater_big.png'; 
            if (this.props.rtype === 1 && redBagList.length === this.props.totalNum && this.state.greatAmount < redBagList[i].amount) {
                this.state.greatAmount = redBagList.amount;
                this.state.greatUser = i;
            }
        }
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 页面滑动
     */
    public pageScroll() {
        if (document.getElementById('redEnvDetail').scrollTop > 0) {
            this.state.scroll = true;
        } else {
            this.state.scroll = false;
        }
        this.paint();
        
    }

    /**
     * 继续发送红包
     */
    public async againSend() {
        let url = '';
        let title = '';
        if (this.props.rtype === 0) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.state.message)}`;
            title = this.state.cfgData.redEnvType[0]; 
        } else if (this.props.rtype === 1) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.state.message)}`;
            title = this.state.cfgData.redEnvType[1]; 
        } else if (this.props.rid === '-1') {
            const inviteCodeInfo = await getInviteCode();
            if (inviteCodeInfo.result !== 1) return;
                
            url = `${sharePerUrl}?cid=${inviteCodeInfo.cid}&type=${RedEnvelopeType.Invite}`;
            title = this.state.cfgData.redEnvType[2];
        }
        popNew('app-components-share-share', { 
            shareType: ShareToPlatforms.TYPE_LINK,
            url,
            title,
            content:this.state.message
        });
        console.error(url);
    }
}
