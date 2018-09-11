/**
 * RedEnvDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog } from '../../../net/pull';
import { RedBag } from '../../../store/interface';
import { timestampFormat, unicodeArray2Str } from '../../../utils/tools';
import { smallUnit2LargeUnit } from '../../../utils/unitTools';

export class RedEnvDetail extends Widget {
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            message:'恭喜发财 万事如意',
            redBagList:[
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' } 
            ],
            scroll:false,
            showPin:this.props.rtype === 1  // 0 等额红包  1 拼手气红包
        };
        this.initData();
    }

    public async initData() {
        const value = await queryDetailLog(this.props.rid);
        if (!value) return;
        const data = value[1];
        const redBagList:RedBag[] = [];
        for (let i = 0;i < data.length;i++) {
            const amount = smallUnit2LargeUnit(this.props.ctypeShow,data[i][4]);
            if (data[i][1] !== 0 && data[i][5] !== 0) {
                const redBag:RedBag = {
                    suid:data[i][0],
                    cuid:data[i][1],
                    rtype:data[i][2],
                    ctype:data[i][3],
                    amount,
                    time:data[i][5],
                    timeShow:timestampFormat(data[i][5])
                };
                redBagList.push(redBag);
            }
        }
        this.state.message = unicodeArray2Str(value[0]);
        this.state.redBagList = redBagList;
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 页面滑动
     */
    public pageScroll() {
        if (document.getElementById('content').scrollTop > 0) {
            this.state.scroll = true;
            if (this.state.scroll) {
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }
}