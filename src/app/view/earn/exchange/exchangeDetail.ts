/**
 * ExchangeDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { getUserList, queryDetailLog } from '../../../net/pull';
import { getLanguage } from '../../../utils/tools';

export class ExchangeDetail extends Widget {
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        const cfg = getLanguage(this);
        this.state = {
            message:this.props.message ? this.props.message :cfg.defaultMess,
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' }                    
            ],
            scroll:false,
            showPin:this.props.rtype === 1,  // 0 等额红包  1 拼手气红包
            cfgData:cfg,
            userName:'',
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
        this.state.userName = user.nickName;

        const redBagList = value[0];
        for (let i = 0;i < redBagList.length;i++) {
            const user = await getUserList([redBagList[i].cuid]);
            this.state.redBagList[i].userName = user ? user.nickName :this.state.cfgData.defaultUserName;
            if (this.props.rtype === 1 && redBagList.length === this.state.totalNum && this.state.greatAmount < redBagList[i].amount) {
                this.state.greatAmount = redBagList.amount;
                this.state.greatUser = i;
            }
        }
        this.paint();
    }
}