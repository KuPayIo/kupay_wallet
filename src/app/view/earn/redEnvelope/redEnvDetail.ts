/**
 * RedEnvDetail
 */
import { ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { sharePerUrl } from '../../../config';
import { getStoreData } from '../../../middleLayer/memBridge';
import { callQueryDetailLog } from '../../../middleLayer/netBridge';
import { getInviteCode, getOneUserInfo } from '../../../net/pull';
import { uploadFileUrlPrefix } from '../../../publicLib/config';
import { LuckyMoneyType } from '../../../publicLib/interface';
import { getUserInfo } from '../../../utils/tools';

// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    rtype:number;  // 0 等额红包  1 拼手气红包
    rid:string;  // 红包ID
    curNum:number;  // 已领取个数
    totalNum:number;  // 总红包个数
    amount:number;  // 红包总金额
    ctypeShow:string;  // 货币类型名称
    outDate?:boolean;  // 红包是否已过期
}
export class RedEnvDetail extends Widget {
    public props:any;
    public language:any;
    public ok: () => void;

    public setProps(props: Props, oldProps?: Props)  {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            message:this.language.message,
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' } 
            ],
            scroll:false,
            showPin:this.props.rtype === 1,  // 0 等额红包  1 拼手气红包
            userName:this.language.defaultUserName,
            userHead:'',
            greatAmount:0,
            greatUser:-1
        };
        this.initData();
    }

    public async initData() {
        const uid = await getStoreData('user/conUid');
        const value = await callQueryDetailLog(uid,this.props.rid);
        if (!value) return;
        this.props.redBagList = value[0];        
        this.props.message = value[1];

        const user = await getUserInfo();
        if (!user) return;
        this.props.userName = user.nickName ? user.nickName :this.language.defaultUserName;
        this.props.userHead = user.avatar ? user.avatar :'../../../res/image/default_avater_big.png';

        const redBagList = value[0];
        for (const i in redBagList) {
            const user = await getOneUserInfo([redBagList[i].cuid]);
            this.props.redBagList[i].userName = user.nickName ? user.nickName :this.language.defaultUserName;
            // tslint:disable-next-line:max-line-length
            this.props.redBagList[i].avatar = user.avatar ? `${uploadFileUrlPrefix}${user.avatar}` :'../../res/image/default_avater_big.png'; 
            if (this.props.rtype === 1 && redBagList.length === this.props.totalNum && this.props.greatAmount < redBagList[i].amount) {
                this.props.greatAmount = redBagList.amount;
                this.props.greatUser = i;
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
            this.props.scroll = true;
        } else {
            this.props.scroll = false;
        }
        this.paint();
        
    }

    /**
     * 继续发送红包
     */
    public async againSend() {
        let url = '';
        let title = '';
        const lanSet = await getStoreData('setting/language');
        let lan:any;
        if (lanSet) {
            lan = lanSet;
        } else {
            lan = 'zh_Hans';
        }
        
        if (this.props.rtype === 0) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.language.redEnvType[0]; 
        } else if (this.props.rtype === 1) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.language.redEnvType[1]; 
        } else if (this.props.rid === '-1') {
            const inviteCodeInfo = await getInviteCode();
            if (inviteCodeInfo.result !== 1) return;
                
            url = `${sharePerUrl}?cid=${inviteCodeInfo.cid}&type=${LuckyMoneyType.Invite}&lan=${lan}`;
            title = this.language.redEnvType[2];
        }
        popNew('app-components-share-share', { 
            shareType: ShareType.TYPE_LINK,
            url,
            title,
            content:this.props.message
        });
        console.error(url);
    }
}
