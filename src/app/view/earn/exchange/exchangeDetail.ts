/**
 * ExchangeDetail
 */
import { Json } from '../../../../pi/lang/type';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetOneUserInfo, callQueryDetailLog } from '../../../middleLayer/wrap';
import { uploadFileUrlPrefix } from '../../../publicLib/config';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { currencyType } from '../../../publicLib/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ExchangeDetail extends Widget {
    public ok: () => void;
    public language:any;

    public setProps(props: Json, oldProps?: Json)  {
        this.language = this.config.value[getLang()];
        this.props = {
            ...props,
            userHead:props.userHead ? props.userHead : '',
            userName:props.userName ? props.userName : '',
            message:props.message ? props.message :this.language.defaultMess,
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' }                    
            ],
            scroll:false,
            showPin:props.rtype === 1,  // 0 等额红包  1 拼手气红包
            curNum:0,
            totalNum:0,
            totalAmount:0,
            greatUser:-1,
            greatAmount:0
            
        };
        super.setProps(this.props,oldProps);
        this.initData();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 页面滑动
     */
    public pageScroll() {
        if (document.getElementById('exchangeDetail').scrollTop > 0) {
            this.props.scroll = true;
        } else {
            this.props.scroll = false;
        }
        this.paint();
        
    }

    public async initData() {
        if (this.props.suid) {
            callGetOneUserInfo([this.props.suid]).then(user => {
                console.log('exchange detail user',user);
                if (!user) return;
                this.props.userName = user.nickName ? user.nickName :this.language.defaultUserName;
                this.props.userHead = user.avatar ? `${uploadFileUrlPrefix}${user.avatar}` :'../../../res/image/default_avater_big.png';
                this.paint();
            });
        }
        
        const value = await callQueryDetailLog(this.props.suid,this.props.rid,this.props.acc_id);
        if (!value) return;
        this.props.redBagList = value[0];        
        this.props.message = value[1];
        this.props.curNum = value[2];
        this.props.totalNum = value[3];
        this.props.totalAmount = value[4];
        const redBagList = value[0];
        if (!this.props.ctypeShow) {
            this.props.ctypeShow = currencyType(CloudCurrencyType[redBagList[0].ctype]);
        }
        
        for (let i = 0;i < redBagList.length;i++) {
            const person = await callGetOneUserInfo([redBagList[i].cuid]);
            if (!person) break;
            this.props.redBagList[i].userName = person.nickName ? person.nickName :this.language.defaultUserName;
            // tslint:disable-next-line:max-line-length
            this.props.redBagList[i].avatar = person.avatar ? `${uploadFileUrlPrefix}${person.avatar}` :'../../res/image/default_avater_big.png';
            if (this.props.rtype === 1 && redBagList.length === this.props.totalNum && this.props.greatAmount < redBagList[i].amount) {
                this.props.greatAmount = redBagList.amount;
                this.props.greatUser = i;
            }
        }
        this.paint();
    }
}
