/**
 * ExchangeDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { getUserList, queryDetailLog } from '../../../net/pull';
import { getLang } from '../../../../pi/util/lang';
import { register } from '../../../store/memstore';
import { Forelet } from '../../../../pi/widget/forelet';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ExchangeDetail extends Widget {
    public ok: () => void;
    public language:any;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        this.state = {
            message:this.props.message ? this.props.message :this.language.defaultMess,
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' }                    
            ],
            scroll:false,
            showPin:this.props.rtype === 1,  // 0 等额红包  1 拼手气红包
            userName:'',
            userHead:'../../../res/image/default_avater_big.png',
            curNum:0,
            totalNum:0,
            totalAmount:0,
            greatUser:-1,
            greatAmount:0
        };
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
            this.state.scroll = true;
        } else {
            this.state.scroll = false;
        }
        this.paint();
        
    }

    public async initData() {
        const value = await queryDetailLog(this.props.suid,this.props.rid);
        if (!value) return;
        this.state.redBagList = value[0];        
        this.state.message = value[1];
        this.state.curNum = value[2];
        this.state.totalNum = value[3];
        this.state.totalAmount = value[4];

        const user = await getUserList([this.props.suid]);
        if (!user) return;
        this.state.userName = user.nickName ? user.nickName :this.language.defaultUserName;
        this.state.userHead = user.avatar ? user.avatar :'../../../res/image/default_avater_big.png';

        const redBagList = value[0];
        for (let i = 0;i < redBagList.length;i++) {
            const user = await getUserList([redBagList[i].cuid]);
            this.state.redBagList[i].userName = user.nickName ? user.nickName :this.language.defaultUserName;
            this.state.redBagList[i].avatar = user.avatar ? user.avatar :'../../res/image/default_avater_big.png';
            if (this.props.rtype === 1 && redBagList.length === this.state.totalNum && this.state.greatAmount < redBagList[i].amount) {
                this.state.greatAmount = redBagList.amount;
                this.state.greatUser = i;
            }
        }
        this.paint();
    }
}

register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});