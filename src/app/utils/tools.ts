import { register, updateStore, find } from '../store/store'
import { Cipher } from '../core/crypto/cipher'

export function setLocalStorage(key:string,data:any){
    updateStore(key,data);
}

export function getLocalStorage(key:string){
    return find(key);
}

export function getCurrentWallet(wallets){
    if(!(wallets && wallets.curWalletId && wallets.curWalletId.length > 0)){
        return null;
    }
    for(let i = 0;i < wallets.walletList.length;i++){
        if(wallets.walletList[i].walletId === wallets.curWalletId){
            return wallets.walletList[i];
        }
    }
    return null;
}


 //Password used to encrypt the plainText
 const passwd = "gaia";

 export function encrypt(plainText:string){
     const cipher = new Cipher();
     return cipher.encrypt(passwd,plainText);
 }

 export function decrypt(cipherText:string){
    const cipher = new Cipher();
    return cipher.decrypt(passwd,cipherText);
}