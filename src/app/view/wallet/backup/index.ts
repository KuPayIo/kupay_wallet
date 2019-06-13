/**
 * backup index
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../publicLib/modulConfig';

interface Props {
    mnemonic: string;
    fragments: any[];
}
// tslint:disable-next-line:completed-docs
export class BackupIndex extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.props.walletName = getModulConfig('WALLET_NAME');
    }
    
    public standardBackupClick() {
        popNew('app-view-wallet-backup-backupMnemonicWordConfirm',{ mnemonic:this.props.mnemonic },() => {
            this.ok && this.ok();
        });
    }
    public fragmentsBackupClick() {
        popNew('app-view-wallet-backup-shareMnemonic',{ fragments:this.props.fragments });
    }
}