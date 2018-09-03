/**
 * wallet home asset list
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    assetList:[];
}
export class WalletAssetList extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public init() {
        console.log('props--------------',this.props.assetList);
    }

}