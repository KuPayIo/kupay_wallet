/**
 * 理财产品首页
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { fromWei } from '../../../core/eth/helper';
import { getProductList } from '../../../net/pull';
import { CurrencyTypeReverse } from '../../../store/interface';
import { register } from '../../../store/store';
import { Config } from '../config/config';
// ====================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Index extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public afterUpdate() {
        super.afterUpdate();
        for (let i = 0;i < this.state.productList.length;i++) {
            const canvasId = `canvas${i}`;
            const sur = this.state.productList[i].surplus;
            const total = this.state.productList[i].total;
            this.drawCircle(canvasId,sur,total);
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
            productList: []
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
    public drawCircle(canvasId:string,t:number,total:number) {
        const oC = document.getElementById(canvasId);
        const oGC = oC.getContext('2d');

        const pi = Math.PI;
        const percent = t / total;
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
            oGC.fillText(`${percent * 100}%`, x, y + 10);
        }
        
    }
}
// ===============================================本地
const productListAdapter = (data:any,w:any) => {

    const result = [];
    for (let i = 0;i < data.value.length;i++) {
        const item = data.value[i];
        const id = item[0];
        const product = Config.productList[id];
        product.coninType = CurrencyTypeReverse[`${item[2]}`];
        product.unitPrice = fromWei(item[3],'ether');
        product.total = item[4];
        product.surplus = item[4] - item[5];
        if (product.surplus <= 0) {
            product.isSoldOut = true;
        } else {
            product.isSoldOut = false;
        }
        result.push(product);
    }
    w.state.productList = result;
    console.log('-------result-------');
    console.log(result);
};

register('conRandom', async (conRandom) => {
    if (!conRandom) return;
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const data = await getProductList();
        console.log('-----productList-');
        productListAdapter(data,w);
        w.paint();
    }
    
});