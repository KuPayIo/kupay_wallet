/**
 * open red-envelope
 */
import { request } from '../../../pi/net/ui/con_mgr';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { setLocalStorage } from '../../utils/tools';

interface RedEnvelope {
    rid:string;// 红包id
    uid:string;// 用户id
    rtype:number;// 红包类型
    ctype:number;// 币种
    code:string;// 兑换码
    amount:number;// 兑换金额
    leaveMsg:string;// 留言
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.state = {
            rid:parseUrlParams(window.location.search,'rid'),
            openClick:false
        };
    }
    public async openRedEnvelopeClick() {
        this.state.openClick = true;
        this.paint();
         // 发红包
        const msgTakeRedEnvelope = {
            type:'take_red_bag',
            param:{
                rid:this.state.rid
            }
        };
        setTimeout(async () => {
            const res = await requestAsync(msgTakeRedEnvelope);
            switch (res.result) {
                case 1:
                    
                    const v = res.value;
                    const redEnvelope:RedEnvelope = {
                        rid:this.state.rid,
                        uid:v[0],
                        rtype:v[1],
                        ctype:v[2],
                        code:v[3],
                        amount:v[4],
                        leaveMsg:unicodeArray2Str(v[5])
                    };
                    setLocalStorage('takeRedBag',redEnvelope);
                    popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ ...redEnvelope });
                    break;
                case 701:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包不存在' });
                    break;
                case 702:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包已领完' });
                    break;
                case 703:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包已过期' });
                    break;
                case 704:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包已领取过' });
                    break;
                default:
            }
            this.ok && this.ok();
        },2000);
        
    }
}

const parseUrlParams = (search: string, key: string) => {
    const ret = search.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};

const requestAsync = async (msg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== undefined) {
                resolve(resp);
            }
        });
    });
};

// unicode数组转字符串
const unicodeArray2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length;i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};