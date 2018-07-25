/**
 * Mnemonic backup 
 */
import { popNew } from '../../../../pi/ui/root';
import { arrayBufferToBase64 } from '../../../../pi/util/base64';
import { Widget } from '../../../../pi/widget/widget';
import { DataCenter } from '../../../store/dataCenter';
import { shareSecret } from '../../../utils/secretsBase';
import { getCurrentWallet, getLocalStorage, getMnemonicHexstr, hexstrToU8Array } from '../../../utils/tools';

interface Props {
    mnemonic: string;
    passwd: string;
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
            okButtonStyle: 'color:rgba(26,112,221,1);',
            cancelButtonStyle:'color:#8E96AB'
        }, null, () => {
            this.ok && this.ok();
        });
    }
    public next() {
        this.ok && this.ok();
        popNew('app-view-wallet-backupWallet-backupMnemonicWordConfirm', { mnemonic: this.props.mnemonic ,walletId:this.props.walletId });
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public async shareClick() {
        const close = popNew('pi-components-loading-loading', { text: '处理中...' });
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const mnemonicHexstr = await getMnemonicHexstr(wallet, this.props.passwd);
        const shares = shareSecret(mnemonicHexstr, DataCenter.MAX_SHARE_LEN, DataCenter.MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));
        this.ok && this.ok();
        popNew('app-view-wallet-backupWallet-share', { shares });
        close.callback(close.widget);
    }
}