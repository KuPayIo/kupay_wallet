
/**
 * 图片显示组件
 */

import { Widget } from '../../../pi/widget/widget';

interface Props {
    width : number;
    heigth?: number;
    imgURL: string;
    inline?: boolean;
    isRound?:boolean;
}

export class WalletImg extends Widget {
    public props:Props;
    public ok:() => void;
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:JSON) {
        super.setProps(props);
    }
}