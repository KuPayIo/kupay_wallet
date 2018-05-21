import { register, updateStore, find } from '../store/store'
import { Cipher } from '../core/crypto/cipher'

export function setLocalStorage(key:string,data:any,notified?:boolean){
    updateStore(key,data,notified);
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

export function randomRgbColor() { //随机生成RGB颜色
    let r = Math.floor(Math.random() * 256); 
    let g = Math.floor(Math.random() * 256); 
    let b = Math.floor(Math.random() * 256); 
    return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
}