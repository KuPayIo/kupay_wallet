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
    return walletName.trim().length >=1 && walletName.trim().length <= 12;
}


export function walletPswAvailable(walletPsw){
    let reg = /^[.@$&*#a-zA-Z0-9]{8,}$/;
    return reg.test(walletPsw.trim());
}


export function pswEqualed(psw1,psw2){
    return psw1.trim() === psw2.trim();
}


export function getWalletPswStrength(walletPsw?:string){
    if(!walletPsw || !walletPsw.trim()){
        return walletPswStrengthList[0];
    }
    let strength = checkStrong(walletPsw);
    return walletPswStrengthList[strength];
}


//判断输入密码的类型    
function CharMode(iN){    
    if (iN>=48 && iN <=57) //数字    
        return 1;    
    if (iN>=65 && iN <=90) //大写    
        return 2;    
    if (iN>=97 && iN <=122) //小写    
        return 4;    
    else    
        return 8;     
}  
//bitTotal函数    
//计算密码模式    
function bitTotal(num){    
    let modes=-1;    
    for (let i=0;i<4;i++){    
        if (num & 1) modes++;    
        num>>>=1;    
    }  
    return modes;    
}  
//返回强度级别    
function checkStrong(sPW){    
    if (sPW.length<8)    
        return 0; //密码太短，不检测级别  
    let Modes=0;    
    for (let i=0;i<sPW.length;i++){    
        //密码模式    
        Modes|=CharMode(sPW.charCodeAt(i));    
    }  
    return bitTotal(Modes);    
}  