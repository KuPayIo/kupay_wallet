/**
 * Mnemonic backup 
 */
import { popNew } from '../../../../pi/ui/root';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../../../../pi/util/base64';
import { Widget } from '../../../../pi/widget/widget';
import { Cipher } from '../../../core/crypto/cipher';
import { GlobalWallet } from '../../../core/globalWallet';
import { DataCenter } from '../../../store/dataCenter';
import { createSecret, restoreSecret, shareSecret } from '../../../utils/secretsBase';
import {
    bytes2Str, decrypt, getCurrentWallet, getLocalStorage, hexstrToU8Array, reductionCipherMnemonic
    , simplifyCipherMnemonic, str2ab, str2Bytes, u8ArrayToHexstr
} from '../../../utils/tools';

export class BackupMnemonic extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        const walletPsw = decrypt(wallet.walletPsw);
        const mnemonic = gwlt.exportMnemonic(walletPsw).split(' ');
        this.state = {
            mnemonic
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public nextStepClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-backupMnemonicConfirm-backupMnemonicConfirm');
    }

    public doShare() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const walletPsw = decrypt(wallet.walletPsw);

        const cipher = new Cipher();

        const mnemonic = ['champion', 'you', 'way', 'rocket', 'august', 'manual', 'bullet', 'salute', 'have', 'mixed', 'still', 'knee'];

        console.log(mnemonic.join(DataCenter.MNEMONIC_SPLIT), walletPsw);
        // 加密助记词分享
        const cipherMnemonic = simplifyCipherMnemonic(cipher.encrypt(walletPsw, mnemonic.join(DataCenter.MNEMONIC_SPLIT)));

        // 对助记词加密时使用的密码通过随机数进行再加密，并对随机数进行分享
        const skey = createSecret();

        const shareStr = `${cipherMnemonic}${DataCenter.SHARE_SPLIT}${skey}`;
        const shareStr1 = bytes2Str(new Uint16Array(str2ab(shareStr)));
        const shares = shareSecret(shareStr1, DataCenter.MAX_SHARE_LEN, DataCenter.MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));

        // 通过随机数加密的密码后续准备存入服务器
        const cipherWalletPsw = cipher.encrypt(skey, walletPsw);

        console.log(cipherMnemonic, skey, shareStr, shareStr1, shares, cipherWalletPsw);

        // todo 测试恢复
        this.doRestore(shares.slice(0, DataCenter.MIN_SHARE_LEN), cipherWalletPsw, null);
    }

    public doRestore(shares: string[], cipherWalletPsw: string, restoreWalletPsw: string) {
        const cipher = new Cipher();

        const restoreShares = shares.map(v => u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v))));

        const comb = restoreSecret(restoreShares);
        const combStr = String.fromCharCode.apply(null, str2Bytes(comb));
        const restoreShareStr = combStr.split(DataCenter.SHARE_SPLIT);
        if (!restoreWalletPsw) {
            restoreWalletPsw = cipher.decrypt(restoreShareStr[1], cipherWalletPsw);
        }
        const restoreMnemonic = cipher.decrypt(restoreWalletPsw, reductionCipherMnemonic(restoreShareStr[0]));
        console.log(restoreMnemonic, restoreWalletPsw);
    }

    /**
     * 废弃的接口
     */
    public doShare_() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const walletPsw = decrypt(wallet.walletPsw);

        const cipher = new Cipher();

        const mnemonic = ['champion', 'you', 'way', 'rocket', 'august', 'manual', 'bullet', 'salute', 'have', 'mixed', 'still', 'knee'];

        console.log(mnemonic.join(DataCenter.MNEMONIC_SPLIT), walletPsw);
        // 加密助记词分享
        const cipherMnemonic = simplifyCipherMnemonic(cipher.encrypt(walletPsw, mnemonic.join(DataCenter.MNEMONIC_SPLIT)));

        // 对助记词加密时使用的密码通过随机数进行再加密，并对随机数进行分享
        const skey = createSecret();

        const shareStr = `${cipherMnemonic}${DataCenter.SHARE_SPLIT}${skey}`;
        const shareStr1 = bytes2Str(new Uint16Array(str2ab(shareStr)));
        const shares = shareSecret(shareStr1, DataCenter.MAX_SHARE_LEN, DataCenter.MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));

        // 通过随机数加密的密码后续准备存入服务器
        const cipherWalletPsw = cipher.encrypt(skey, walletPsw);

        console.log(cipherMnemonic, skey, shareStr, shareStr1, shares, cipherWalletPsw);

        // todo 测试恢复
        this.doRestore(shares.slice(0, DataCenter.MIN_SHARE_LEN), cipherWalletPsw, null);
    }

    public doRestore_(shares: string[], cipherWalletPsw: string, restoreWalletPsw: string) {
        const cipher = new Cipher();

        const restoreShares = shares.map(v => u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v))));

        const comb = restoreSecret(restoreShares);
        const combStr = String.fromCharCode.apply(null, str2Bytes(comb));
        const restoreShareStr = combStr.split(DataCenter.SHARE_SPLIT);
        if (!restoreWalletPsw) {
            restoreWalletPsw = cipher.decrypt(restoreShareStr[1], cipherWalletPsw);
        }
        const restoreMnemonic = cipher.decrypt(restoreWalletPsw, reductionCipherMnemonic(restoreShareStr[0]));
        console.log(restoreMnemonic, restoreWalletPsw);
    }
}