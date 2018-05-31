
/**
 * 和账号相关的工具
 */
import { getLocalStorage,setLocalStorage, shuffle } from './tools';

 // 密码强度列表
const walletPswStrengthList = [{
    text:'弱',
    color:'#FF0000'
},{
    text:'一般',
    color:'#FF9900'
},{
    text:'强',
    color:'#33CC00'
}];

/**
 * 钱包名称是否合法
 * @param walletName wallet name
 */
export const walletNameAvailable = (walletName) => {
    return walletName.trim().length >= 1 && walletName.trim().length <= 12;
};

/**
 * 钱包密码是否合乎规则
 * @param walletPsw  wallet password
 */
export const walletPswAvailable = (walletPsw) => {
    const reg = /^[.@$&*#a-zA-Z0-9]{8,}$/;

    return reg.test(walletPsw.trim());
};

/**
 * 判断密码是否相等
 * @param psw1 password one
 * @param psw2 password two
 */
export const pswEqualed = (psw1,psw2) => {
    return psw1.trim() === psw2.trim();
};

/**
 * 获取密码强度对象
 * @param walletPsw wallet password
 */
export const getWalletPswStrength = (walletPsw?:string) => {
    if (!walletPsw || !walletPsw.trim()) {
        return walletPswStrengthList[0];
    }
    const strength = checkStrong(walletPsw);

    return walletPswStrengthList[strength];
};

// 判断输入密码的类型    
const CharMode = (iN) => {    
    if (iN >= 48 && iN <= 57) { // 数字    
        return 1;
    }    
    if (iN >= 65 && iN <= 90) { // 大写    
        return 2;
    }    
    if (iN >= 97 && iN <= 122) { // 小写    
        return 4;
    } else {    
        return 8;
    }     
};  
// bitTotal函数    
// 计算密码模式    
const bitTotal = (num) => {    
    let modes = -1;    
    for (let i = 0;i < 4;i++) {    
        if (num & 1) modes++;    
        num >>>= 1;    
    }  

    return modes;    
};  
// 返回强度级别    
const checkStrong = (sPW) => {    
    if (sPW.length < 8) {    
        return 0;
    } // 密码太短，不检测级别  
    let Modes = 0;    
    for (let i = 0;i < sPW.length;i++) {    
        // 密码模式    
        Modes |= CharMode(sPW.charCodeAt(i));    
    }  

    return bitTotal(Modes);    
};  

/**
 * 名字显示截取
 */
export const nickNameInterception = (name:string):string => {
    let ret = '';
    if (name.length > 6) {
        ret = `${name.slice(0,6)}...`;
    } else {
        ret = name;
    }

    return ret;
};

/**
 * 随机获取头像
 */
export const getAvatarRandom = ():string => {
    // tslint:disable-next-line:max-line-length
    const avatars = getLocalStorage('avatars') || ['img_avatar1.jpg','img_avatar2.jpg','img_avatar3.jpg','img_avatar4.jpg','img_avatar5.jpg','img_avatar6.jpg','img_avatar7.jpg','img_avatar8.jpg','img_avatar9.jpg','img_avatar10.jpg'];
    const shuffledAvatars = shuffle(avatars);
    const avatar = shuffledAvatars.splice(0,1);
    setLocalStorage('avatars',shuffledAvatars);
    
    return avatar[0];
};