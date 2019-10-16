import { Widget } from '../../../pi/widget/widget';

interface Props {
    state:number;// 状态
    tabBar:any;// 导航栏
    showDataList:any;// 收益列表
    dividendDescription:any;// 分红说明
    legend:any;// 什么是BTC？
}
/**
 * 我的收益
 */
export class MyIncome extends Widget {
    public ok:() => void;
    public props:Props = {
        state:2,
        tabBar:[
            { zh_Hans:'我的收益',zh_Hant:'我的收益',en:'' },
            { zh_Hans:'分红说明',zh_Hant:'分紅說明',en:'' },
            { zh_Hans:'什么是BTC',zh_Hant:'什麼是BTC',en:'' }
        ],
        showDataList:[
            // { num:'+0.0205 mBTC',name:'分红',time:'2019-09-06 14:00' }
        ],
        dividendDescription:[
            {
                name:'怎么领取分红？',
                answer:[
                    '1、点击领分红即可领取本次分红；',
                    '2、如没有领取，该次分红一直存在直到玩家领取，分红不累计领取。'
                ]
            },
            {
                name:'分红怎么计算？',
                answer:[
                    '1、根据玩家手中持有嗨豆进行分红，分红单位最小为份，1份=3000嗨豆；',
                    '2、截止分红日期前，只核算用户持有的嗨豆，未挖取的矿储量不算； ',
                    '3、分红开始之前可增加持有嗨豆获取更多分红；'
                ]
            }
        ],
        legend:[
            {
                name:'什么是BTC？',
                answer:[
                    '1、BTC是比特币（BitCoin）的一种数字代币，比特币和其他数字货币一样，可以在指定交易平台上进行买卖；',
                    '2、本平台中可以使用BTC进行发红包，玩区块链游戏，购买道具等；'
                ]
            },
            {
                name:'什么是mBTC？',
                answer:[
                    'mbtc是比特币单位的代称，和人民币分毫厘比较类似。',
                    '常用的单位还有这些：',
                    '1比特币（Bitcoins，BTC）= 1BTC',
                    '1比特分（Bitcent，cBTC）= 0.01BTC',
                    '1毫比特（Milli-Bitcoins，mBTC）= 0.001BTC',
                    '1微比特（Micro-Bitcoins，μBTC或uBTC）=0.000001BTC',
                    '1聪（satoshi）= 0.00000001BTC',
                    '1bitcoin(BTC)=1000millibitcoins(mBTC)=1millionmicrobitcoins(uBTC)=100millionSatoshi'
                ]
            }
        ]

    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}