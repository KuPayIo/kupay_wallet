/**
 * mnemonic backup confirm page
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { Wallet } from '../../../store/interface';
import { find, updateStore } from '../../../store/store';
import { shuffle } from '../../../utils/tools';

interface Props {
    mnemonic: string;
}

export class BackupMnemonicWordConfirm extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        const mnemonic = this.props.mnemonic.split(' ');
        const shuffledMnemonic = this.initMnemonic(mnemonic);
        this.state = {
            mnemonic,
            confirmedMnemonic: [],
            shuffledMnemonic
        };
    }
    public jumpOver() {
        popNew('app-components-message-messagebox', {
            itype: 'confirm',
            title: '提示',
            content: '为了确保您的资产安全，建议不要跳过验证！',
            okButton: '取消',
            cancelButton: '跳过',
            okButtonStyle: 'color:rgba(26,112,221,1);',
            cancelButtonStyle: 'color:#8E96AB'
        }, null, () => {
            this.ok && this.ok();
        });
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    // 对助记词乱序和标识处理
    public initMnemonic(arr: any[]) {
        return this.initActive(shuffle(arr));
    }

    // 初始化每个助记词标识是否被点击
    public initActive(arr: any[]): any[] {
        const res = [];
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            const obj = {
                word: '',
                isActive: false
            };
            obj.word = arr[i];
            res.push(obj);
        }

        return res;
    }

    public nextStepClick() {
        if (!this.compareMnemonicEqualed()) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '提示', content: '请检查助记词' });
        } else {
            this.deleteMnemonic();
            popNew('app-components-message-messagebox', { itype: 'alert', title: '提示', content: '备份完成' });
            this.ok && this.ok();
        }
    }

    public shuffledMnemonicItemClick(e: Event, v: number) {
        const mnemonic = this.state.shuffledMnemonic[v];
        if (mnemonic.isActive) {
            mnemonic.isActive = false;
            arryRemove(this.state.confirmedMnemonic, mnemonic);

        } else {
            mnemonic.isActive = true;
            this.state.confirmedMnemonic.push(mnemonic);
        }
        console.log(this.state.confirmedMnemonic);
        console.log(this.state.confirmedMnemonic);
        this.paint();
    }

    public confirmedMnemonicItemClick(e: Event, v: number) {
        const arr = this.state.confirmedMnemonic.splice(v, 1);
        arr[0].isActive = false;
        this.paint();
    }

    private deleteMnemonic() {
        let isUpdate = false;
        const walletList: Wallet[] = find('walletList').map(v => {
            if (v.walletId === this.props.walletId) {
                isUpdate = true;
                const gwlt = GlobalWallet.fromJSON(v.gwlt);
                gwlt.mnemonicBackup = true;
                v.gwlt = gwlt.toJSON();
            }
            if (isUpdate) updateStore('curWallet', v);

            return v;
        });
        if (isUpdate) updateStore('walletList', walletList);
    }

    private compareMnemonicEqualed(): boolean {
        let isEqualed = true;
        const len = this.state.mnemonic.length;
        if (this.state.confirmedMnemonic.length !== len) return false;
        for (let i = 0; i < len; i++) {
            if (this.state.confirmedMnemonic[i].word !== this.state.mnemonic[i]) {
                isEqualed = false;
            }
        }

        return isEqualed;
    }
}

const arryRemove = (ary: any[], target: Object) => {
    //
    for (let i = 0; i < ary.length; i++) {
        const one = ary[i];
        if (one === target) {
            ary.splice(i, 1);

            return;
        }

    }

    return;
};