/**
 * mnemonic backup confirm page
 */
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { deleteMnemonic, helpWord, popNewMessage, shuffle } from '../../../utils/tools';

interface Props {
    mnemonic: string;
}

export class BackupMnemonicWordConfirm extends Widget {
    public ok: () => void;
    public cancel: () => void;
    public language:any;
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.language = this.config.value[getLang()];
        this.init();
    }
    public init() {
        const mnemonic = this.props.mnemonic.split(' ');
        const shuffledMnemonic = this.initMnemonic(mnemonic);
        this.props = {
            ...this.props,
            mnemonic,
            nullMnemonic:[0,0,0,0,0,0,0,0,0,0,0,0],
            confirmedMnemonic: [],
            shuffledMnemonic
        };
    }
    
    public backPrePage() {
        this.cancel && this.cancel();
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
        if (this.props.confirmedMnemonic.length === 0) {
            popNewMessage(this.language.tips[0]);
        } else if (!this.compareMnemonicEqualed()) {
            popNewMessage(this.language.tips[1]);
        } else {
            deleteMnemonic();
            helpWord();
            popNewMessage(this.language.tips[2]);
            this.ok && this.ok();
        }
    }

    public shuffledMnemonicItemClick(e: Event, v: number) {
        const mnemonic = this.props.shuffledMnemonic[v];
        if (mnemonic.isActive) {
            mnemonic.isActive = false;
            arryRemove(this.props.confirmedMnemonic, mnemonic);

        } else {
            mnemonic.isActive = true;
            this.props.confirmedMnemonic.push(mnemonic);
        }
        this.paint();
    }

    public confirmedMnemonicItemClick(e: Event, v: number) {
        if (v >= this.props.confirmedMnemonic.length) return;
        const arr = this.props.confirmedMnemonic.splice(v, 1);
        arr[0].isActive = false;
        this.paint();
    }

    private compareMnemonicEqualed(): boolean {
        let isEqualed = true;
        const len = this.props.mnemonic.length;
        if (this.props.confirmedMnemonic.length !== len) return false;
        for (let i = 0; i < len; i++) {
            if (this.props.confirmedMnemonic[i].word !== this.props.mnemonic[i]) {
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