/**
 * backup index
 */
import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

interface Props {
    mnemonic: string;
    fragments: [];
}
export class BackupIndex extends Widget{
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init(){
    }
    public standardBackupClick(){
        popNew('app-view-wallet-backup-backupMnemonicWordConfirm',{mnemonic:this.props.mnemonic});
    }
    public fragmentsBackupClick(){
        popNew('app-view-wallet-backup-shareMnemonic',{fragments:this.props.fragments});
    }
}