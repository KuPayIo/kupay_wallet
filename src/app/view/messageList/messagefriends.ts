/**
 * message friend
 */
import { Widget } from '../../../pi/widget/widget';

export class Messagefriends extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {  
            data1:[
                { type:'1',content:'今天天气真好' },
                { type:'2',content:'对呀对呀！' },
                { type:'1',content:'要不要出门' },
                { type:'2',content:'不要' },
                { type:'1',content:'准备在家里了解了解市场行情' },
                { type:'2',content:'是的' },
                { type:'1',content:'你用的什么软件' },
                { type:'2',content:'还没找到' },
                { type:'1',content:'转给你的两个以太坊收到了嘛？' },
                { type:'2',content:'收到了，好快呀',time:'5-23 10:53' },        
                { type:'1',content:'嗯，推荐大家都来用fairblock吧！' },
                { type:'2',content:'好呀好呀！' }
            ],
            data2:[
                { type:'1',content:'我买的币又涨价了！！！我买的币又涨价了！！！我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'1',content:'我买的币又涨价了！！！' },
                { type:'2',content:'恭喜恭喜呀' },
                { type:'2',content:'最近行情如何？' }
            ]     
        };
    }

    public create() {
        super.create();
        this.props = JSON.parse(window.sessionStorage.item);
    }

    public attach() {
        const talkcontent = document.getElementById('talkcontent');
        talkcontent.scrollTop = talkcontent.scrollHeight;
        talkcontent.style.height = talkcontent.scrollHeight.toString();
        
    }

    public backPrePage() {
        this.ok && this.ok();
    }
   
}