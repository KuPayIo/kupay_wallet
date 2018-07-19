/**
 * Mnemonic backup 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    mnemonic: string;
}

export class BackupMnemonicWord extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        // 初始化数据
    }

    public jumpOver() {
        popNew('app-components-message-messagebox', {
            itype: 'confirm',
            title: '提示',
            content: '为了确保您的资产安全，建议不要跳过验证！',
            okButton: '取消',
            cancelButton: '跳过',
            okButtonStyle: 'color:rgba(26,112,221,1);'
        }, null, () => {
            this.ok && this.ok();
        });
    }
    public next() {
        this.ok && this.ok();
        popNew('app-view-wallet-backupWallet-backupMnemonicWordConfirm', { mnemonic: this.props.mnemonic });
    }
    public back() {
        this.ok && this.ok();
    }
    public shareClick() {
        popNew('app-view-wallet-backupWallet-share'); 
    }
}