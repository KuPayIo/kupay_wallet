/**
 * backup index
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';

interface Props {
    mnemonic: string;
    fragments: any[];
}
export class BackupIndex extends Widget {
    public ok:() => void;
    public language : any;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.props.walletName = getModulConfig('WALLET_NAME');
        this.language = this.config.value[getLang()];
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