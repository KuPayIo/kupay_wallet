/**
 * 图片卡片组件
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    desc:string;
    title:string;
    img:string;
    shadow?:boolean;
}

export class Card extends Widget {
    public props: Props;
    constructor() {
        super();
    }
}