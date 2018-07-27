/**
 * 交易所-选择
 */
import { Widget } from '../../../pi/widget/widget';

export class Home extends Widget {
    public ok: (r: any) => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            menuList: ['ETH', 'BTC'],
            resultList: [],
            initResultList: [
                [
                    { icon: '../../res/image/BTC.png', name: 'BTC/ETH', currency1: 'BTC', currency2: 'ETH' },
                    { icon: '../../res/image/EOS.png', name: 'EOS/ETH', currency1: 'EOS', currency2: 'ETH' }
                ],
                [
                    { icon: '../../res/image/ETH.png', name: 'ETH/BTC', currency1: 'ETH', currency2: 'BTC' },
                    { icon: '../../res/image/EOS.png', name: 'EOS/BTC', currency1: 'EOS', currency2: 'BTC' }
                ],
                [
                    { icon: '../../res/image/ETH.png', name: 'ETH/EOS', currency1: 'ETH', currency2: 'EOS' },
                    { icon: '../../res/image/BTC.png', name: 'BTC/EOS', currency1: 'BTC', currency2: 'EOS' }
                ]
            ],
            select: null
        };

        this.state.resultList = this.state.initResultList[0];
    }

    public choose(e: any, index: number) {
        this.state.select = this.state.resultList[index];
        this.close();
    }

    public close() {
        this.ok && this.ok(this.state.select);
    }

    public onTabsChange(e: any) {
        this.state.resultList = this.state.initResultList[e.value];
        this.paint();
    }

}