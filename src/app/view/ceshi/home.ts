import { Widget } from "../../../pi/widget/widget";
import { hasWallet } from "../../utils/tools";
import { popNew } from "../../../pi/ui/root";
import { walletPay } from "../../utils/pay";
import { createGroup } from "../../../chat/client/app/net/rpc";

/**
 * play home 
 */
// ================================ 导入


// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Ceshi extends Widget {

    public ok: () => void;
    public language: any;

    constructor() {
        super();
    }


    public backPrePage() {
        this.ok && this.ok();
    }

    public showMine() {
        popNew('app-view-mine-home-home');
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.refresh = true;
        this.paint();
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);

    }

    /**
     * 充值按钮
     */
    public rechargeBtn(e: any) {

    }

    /**
     * payBtn
     */
    public payBtn() {
        if (!hasWallet()) return;
        const order = {
            out_trade_no: Number(document.getElementById('pay_no').value),
            total_fee: Number(document.getElementById('pay_total').value) * 1000000,
            body: document.getElementById('pay_body').value
        };

        this.ajax('POST', 'http://127.0.0.1:8080/unifiedorder', order, (data) => {
            if (data.return_code === 1) {

                walletPay(data.data, (code, res) => {
                    if (code === 1) {
                        popNew('app-components-message-message', { content: '支付成功！' });
                    } else {
                        popNew('app-components-message-message', { content: '支付失败！' });
                    }
                    console.log(code);
                    console.log(res);

                })
                //  openPayment(data.data,(resCode,msg) => {
                //      popNew('app-components-message-message', { content:'支付成功！' });
                //      popNew('app-components-message-message', { content:'支付失败！' });
                //      console.log('GTpay --------fail-------',err);
                //  });
            } else if (data.return_code === 30003) {
                popNew('app-components-message-message', { content: '订单已存在' });
            }

        }, (err) => {
            console.log(err);
        });
    }

    /**
     * 创建游戏群
     */
    public creatGroup(){    
        let GroupName = document.getElementById('GroupName').value;
        let GroupNote = document.getElementById('GroupNote').value;
        createGroup(GroupName,'',GroupNote,false,(res)=>{
            console.log(res);
            
        })
    }
    /**
     * Ajax 请求
     */
    public ajax(ty: string, url: string, data: any, okCb?: Function, failCb?: Function) {
        data = JSON.stringify(data);
        const xhr = new XMLHttpRequest();// 创建请求

        if (ty === 'GET') {
            xhr.open('GET', `${url}?${data}`, true);
            xhr.send(null);
        } else if (ty === 'POST') {
            xhr.open('POST', url, true);
            // 设置表单提交时的内容类型
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.send(data);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const status = xhr.status;
                if (status >= 200 && status < 300) {
                    okCb && okCb(JSON.parse(xhr.responseText), xhr.responseXML)
                } else {
                    failCb && failCb(status);
                }
            }
        };
    }

    /**
     * 格式化参数
     * @param data 数据
     */
    public formatParams(data: any) {
        const arr = [];
        for (const name in data) {
            arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
        }
        arr.push((`v=${Math.random()}`).replace('.', ''));

        return arr.join('&');
    }
}