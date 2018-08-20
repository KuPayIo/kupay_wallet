/**
 * 理财产品首页
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getProductList,getPurchaseRecord } from '../../../net/pull';
import { Product } from '../../../store/interface';
import { find, register } from '../../../store/store';
// ====================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    isActive:boolean;
}
export class Index extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public updateProductList(productList:Product[]) {
        this.state.productList = productList;
        this.paint();
    }
    /* public afterUpdate() {
        super.afterUpdate();
        if (!this.props.isActive) return;
        for (let i = 0;i < this.state.productList.length;i++) {
            const canvasId = `canvas${i}`;
            // const sur = this.state.productList[i].surplus;
            const sur = 98888;
            const total = this.state.productList[i].total;
            this.drawCircle(canvasId,sur,total);
        }
        
    } */
    public init() {
        this.state = {
            record: [],
            productList: []
        };
        if (!this.props.isActive) return;
        getProductList();
        getPurchaseRecord();
    }
 
    public toDetail(i: any) {
        const item = this.state.productList[i];
        const wallet = find('curWallet');
        if (!wallet) {
            popNew('app-components-linkMessage-linkMessage', {
                tip: '还没有钱包',
                linkTxt: '去创建',
                linkCom: 'app-view-wallet-walletCreate-createWalletEnter'
            });

            return;
        }
        
        popNew('app-view-financialManagement-productDetail-productDetail', { i, item });
        
    }

    public toRecord() {
        popNew('app-view-financialManagement-purchaseRecord-purchaseRecord',{ record:this.state.record });
    }
    public toRecordDetail(i:any) {
        popNew('app-view-financialManagement-purchaseRecord-recordDetail',{ item:this.state.record[i],i });
    }
    public drawCircle(canvasId:string,t:number,total:number) {
        const oC = document.getElementById(canvasId);
        const oGC = (<any>oC).getContext('2d');
        oGC.clearRect(0,0,150,150);  
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
            oGC.fillText(`${(percent * 100).toFixed(0)}%`, x, y + 10);
        }
        
    }
}
// ===============================================本地

/* register('conRandom', async (conRandom) => {
    if (!conRandom) return;
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const data = await getProductList();
        const recordData = getPurchaseRecord();
        w.paint();
    }
    
}); */
register('productList', async (productList) => {
    console.log('productList------home-------',productList);
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateProductList(productList);
        w.paint();
    }
    
});
register('purchaseRecord', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.state.record = purchaseRecord;
        w.paint();
    }
    
});
/* register('curWallet', async (curWallet) => {
    if (!curWallet) return;
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const data = await getProductList();
        const recordData = getPurchaseRecord();
        w.paint();
    }
    
}); */
