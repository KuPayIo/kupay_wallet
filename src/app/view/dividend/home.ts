import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getStoreData } from '../../api/walletApi';
import { rippleShow } from '../../utils/pureUtils';

interface Props {
    title:string;// 分红标题
    dividendAmount:any;// 分红金额
    hold:any;// 持有的
    time:string;// 下次分红时间
    dividendInterest:any;// 分红权益
}

/**
 * 分红
 */
export class DividendHome extends Widget {
    public ok:() => void;
    public props:Props = {
        title:'本次可领mBTC  1BTC≈1000mBTC≈￥5179.28',
        dividendAmount:{
            num:0.00,
            about:'约0.00银两'
        },
        hold:{
            kt:0,
            addUp:100
        },
        time:'2019年09月27日14时 还有 6 天',
        dividendInterest:['我的收益','分红说明','什么是BTC']
    };

    public create() {
        super.create();
        getStoreData('cloud').then(r => {
            this.props.hold = {
                kt:r.KT,
                addUp:0
            };
            this.paint();
        });
    }
    /**
     * 点击权益
     */
    public click(index:number) {
        popNew('app-view-dividend-description',{ state:index });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}