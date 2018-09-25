/**
 * ExchangeDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog } from '../../../net/pull';
import { find } from '../../../store/store';

export class ExchangeDetail extends Widget {
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            message:this.props.message ? this.props.message :this.config.value.simpleChinese.defaultMess,
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' }                    
            ],
            scroll:false,
            showPin:this.props.rtype === 1,  // 0 等额红包  1 拼手气红包
            cfgData:this.config.value.simpleChinese
        };
        const lan = find('languageSet');
        if (lan) {
            this.state.cfgData = this.config.value[lan.languageList[lan.selected]];
            this.state.message = this.props.message ? this.props.message :this.state.cfgData.defaultMess;
        }
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
            if (this.state.scroll) {
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }

    public async initData() {
        const value = await queryDetailLog(this.props.rid);
        if (!value) return;
        this.state.redBagList = value[0];        
        this.state.message = value[1];
        this.paint();
    }
}