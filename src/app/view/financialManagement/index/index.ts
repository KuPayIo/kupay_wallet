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
    public attach() {
        super.attach();
        for (let i = 0;i < this.state.productList.length;i++) {
            const canvasId = `canvas${i}`;
            this.drawCircle(canvasId,0);
        }
        
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
                surplus: '0%',
                profit: '5%',
                productName: 'ETH资管第1期',
                productDescribe: ' 赎回T+0到账 | 0.1 ETH/份',
                isSoldOut: true
            }, {
                title: '优选理财-随存随取',
                surplus: '0%',
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
    public drawCircle(canvasId:string,t:number) {
        const oC = document.getElementById(canvasId);
        const oGC = oC.getContext('2d');

        const pi = Math.PI;
        const percent = t / 100;
        const oB = pi * 1.5 - percent * 2 * pi;
        const oR = Math.PI * 1.5;
        
        const x = 60;
        const y = 60;
        const r = 50;
        oGC.strokeStyle = '#E5E5EE';
        oGC.lineWidth = '15';
        oGC.beginPath();
        oGC.arc(x, y, r, 0, pi * 2, true);
        oGC.stroke();
        oGC.closePath();

        oGC.beginPath();
        oGC.strokeStyle = '#A0ACC0';
        oGC.lineWidth = '15';
        oGC.beginPath();
        oGC.arc(x, y, r, oB, oR, false);
        oGC.stroke();
        oGC.font = '28px Arial';
        oGC.fillStyle = '#111';
        oGC.textAlign = 'center';
        if (t <= 0) {
            oGC.fillText(`售罄`, x, y + 10);
        } else {
            oGC.fillText(`${t}%`, x, y + 10);
        }
        
    }
}