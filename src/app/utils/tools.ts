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