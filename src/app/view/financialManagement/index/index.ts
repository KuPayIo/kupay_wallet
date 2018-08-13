/**
 * 理财产品首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class Index extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            record: [{
                title: 'ETH资管第1期',
                amount: '1',
                bonus: '0.002',
                days: '2'
            }],
            productList: [{
                title: '优选理财-随存随取',
                surplus: '20%',
                profit: '5%',
                productName: 'ETH资管第1期',
                productDescribe: ' 赎回T+0到账 | 0.1 ETH/份',
                isSoldOut: false
            }, {
                title: '优选理财-随存随取',
                surplus: '50%',
                profit: '5%',
                productName: 'ETH资管第1期',
                productDescribe: ' 赎回T+0到账 | 0.1 ETH/份',
                isSoldOut: true
            }]
        };
        
    }
    public toDetail(i: any) {
        console.log('---------i-----------');
        console.log(i);
        const item = this.state.productList[i];
        popNew('app-view-financialManagement-productDetail-productDetail', { i, item });
    }
    public toRecord() {
        popNew('app-view-financialManagement-purchaseRecord-purchaseRecord');
    }
    public drawCircle() {
        const t = 99;
        const oC = document.getElementById('canvas1');
        const oGC = oC.getContext('2d');
        const oB = Math.PI * (-90) / 180;
        const oR = (t - 25) * 3.6 * Math.PI / 180;
        
        const x = 200;
        const y = 200;
        const r = 150;

        oGC.strokeStyle = '#abcdef';
        oGC.lineWidth = '10';
        oGC.beginPath();
        oGC.arc(x, y, r, oB, oR, false);
        oGC.stroke();
        oGC.font = 'Bold 50px Arial';
        oGC.fillStyle = '#ccc';
        oGC.textAlign = 'center';
        oGC.fillText(`${t}%`, x, y + 10);
        
    }
}