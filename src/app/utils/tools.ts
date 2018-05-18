import { register, updateStore, find } from '../store/store'

export function setLocalStorage(key:string,data:any,notifed?:boolean){
    updateStore(key,data,notifed);
}

export function getLocalStorage(key:string, cb?: Function){
    if(cb){
        register(key,cb);
    }
    return find(key);
}

export function getCurrentWallet(wallets){
    if(!(wallets && wallets.curWalletId && wallets.curWalletId.length > 0)){
        return null;
    }
    for(let i = 0;i < wallets.list.length;i++){
        if(wallets.list[i].walletId === wallets.curWalletId){
            return wallets.list[i];
        }
    }
    return null;
}