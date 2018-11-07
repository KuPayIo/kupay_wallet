/**
 * mnemonic backup confirm page
 */
import { Widget } from '../../../../pi/widget/widget';
import { deleteMnemonic } from '../../../logic/localWallet';
import { popNewMessage, shuffle } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';

interface Props {
    mnemonic: string;
}

export class BackupMnemonicWordConfirm extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.language = this.config.value[getLang()];
        this.init();
    }
    public init() {
        const mnemonic = this.props.mnemonic.split(' ');
        const shuffledMnemonic = this.initMnemonic(mnemonic);
        this.state = {
            mnemonic,
            nullMnemonic:[0,0,0,0,0,0,0,0,0,0,0,0],
            confirmedMnemonic: [],
            shuffledMnemonic,
        };
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
        if (this.state.confirmedMnemonic.length === 0) {
            popNewMessage(this.language.tips[0]);
        } else if (!this.compareMnemonicEqualed()) {
            popNewMessage(this.language.tips[1]);
        } else {
            deleteMnemonic();
            popNewMessage(this.language.tips[2]);
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
        this.paint();
    }

    public confirmedMnemonicItemClick(e: Event, v: number) {
        if (v >= this.state.confirmedMnemonic.length) return;
        const arr = this.state.confirmedMnemonic.splice(v, 1);
        arr[0].isActive = false;
        this.paint();
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