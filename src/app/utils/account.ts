/**
 * 和账号相关的工具
 */

const walletPswStrengthList = [{
    text:"弱",
    color:"#FF0000"
},{
    text:"一般",
    color:"#FF9900"
},{
    text:"强",
    color:"#33CC00"
}];


export function walletNameAvailable(walletName){
    return walletName.length >=1 && walletName.length <= 12;
}


export function walletPswAvailable(walletPsw){
    let reg = /^[\\p{Punct}a-zA-Z0-9]{8,14}$/;
    return reg.test(walletPsw);
}


export function walletPswConfirmAvailable(walletPsw,walletPswConfirm){
    return walletPsw === walletPswConfirm;
}


export function getWalletPswStrength(walletPsw?:string){
    if(!walletPsw){
        return walletPswStrengthList[0];
    }
    let len = walletPsw.length;
    let strength = 0;
    if(len<6){
        strength = 0;
    }else if(len < 10){
        strength = 1;
    }else{
        strength = 2;
    }
    return walletPswStrengthList[strength];
}