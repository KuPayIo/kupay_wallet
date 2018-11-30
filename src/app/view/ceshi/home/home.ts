/**
 * play home 
 */
 // ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { debug } from '../../../../pi/util/log';
import { Widget } from '../../../../pi/widget/widget';
import { openPayment } from '../../../api/JSAPI';
import { getGlodPrice, requestAsync } from '../../../net/pull';
import { confirmPay,OrderDetail } from '../../../utils/pay';
import { getUserInfo, hasWallet, popNewMessage } from '../../../utils/tools';
// import { closePayment, confirmOrder, getOpenId, openPayment, openPswInput } from '../../../api/JSAPI';
// import { confirmPay } from '../../../utils/pay';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Ceshi extends Widget {
    
    public ok: () => void;
    public language:any;

    constructor() {
        super();
    }
    
    public setProps(props:Json) {
        super.setProps(props);
        this.language = this.config.value[getLang()];
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
            this.props.refresh = false;
        }
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
    public rechargeBtn() {
        getGlodPrice();
        const order:OrderDetail = {
            total:Number(document.getElementById('total').value),
            gt:Number(document.getElementById('gt').value),
            body:document.getElementById('body').value,
            payTypeId:Number(document.getElementById('payType').value)
        };
        confirmPay(order,() => {
            popNew('app-components1-message-message', { content:'充值成功' });
            
        },(err) => {
            console.log(err);
            
            popNew('app-components1-message-message', { content:'充值失败，请重试' });
        });

    }

    /**
     * payBtn
     */
    public payBtn() {
        if (!hasWallet()) return;
        const order = {
            out_trade_no:Number(document.getElementById('pay_no').value),
            total_fee:Number(document.getElementById('pay_total').value),
            body:document.getElementById('pay_body').value
        };

        this.ajax('POST','http://127.0.0.1:8080/unifiedorder',order,(data) => {
            if (data.return_code === 1) {
                openPayment(data.data,() => {
                    popNew('app-components1-message-message', { content:'支付成功！' });
                },(err) => {
                    popNew('app-components1-message-message', { content:'支付失败！' });
                    console.log('GTpay --------fail-------',err);
                    
                });
            } else if (data.return_code === 30003) {
                popNew('app-components1-message-message', { content:'订单已存在' });
            }
            
        },(err) => {
            console.log(err);
        });
    }
    /**
     * Ajax 请求
     */
    public ajax(ty:string,url:string,data:any,okCb ? :Function,failCb ? :Function) {
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
                    okCb && okCb(JSON.parse(xhr.responseText), xhr.responseXML;)
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
    public formatParams(data:any) {
        const arr = [];
        for (const name in data) {
            arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
        }
        arr.push((`v=${Math.random()}`).replace('.',''));

        return arr.join('&');
    }
}
