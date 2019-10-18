import { getStore as chatGetStore } from '../../chat/client/app/data/store';
import { backCall, backList, popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { getRealNode } from '../../pi/widget/painter';
import { lookup } from '../../pi/widget/widget';
import { getStoreData } from '../api/walletApi';
// tslint:disable-next-line:max-line-length
import { Config, defalutShowCurrencys, ERC20Tokens, getModulConfig, inJSVM, MainChainCoin, uploadFileUrlPrefix, USD2CNYRateDefault } from '../public/config';
import { CloudCurrencyType, Currency2USDT, CurrencyRecord } from '../public/interface';
import { getCloudBalances, getStore } from '../store/memstore';
import { piLoadDir } from './commonjsTools';

/**
 * 常用工具 尽量不依赖其他文件很重的文件
 */

declare var pi_modules;
/**
 * 封装ajax成fetch模式
 * @param url  请求url
 * @param header 请求头
 */
export const piFetch = (url:string,param?:any):Promise<any> => {
    // return Promise.reject();
    if (!inJSVM) return fetch(url,param).then(res => res.json());

    return new Promise((resolve,reject) => {
        if (param && param.method === 'POST') {   // post
            // tslint:disable-next-line:max-line-length
            pi_modules.ajax.exports.post(url,param.headers,param.body,'string',param.headers['Content-Type'] || 'application/json',pi_modules.ajax.exports.RESP_TYPE_TEXT,(res) => {
                console.log(`piFetch POST ${url} success===`,res);
                try {
                    resolve(JSON.parse(res));
                } catch (err) {
                    resolve(res);
                }
                
            },(err) => {
                console.log(`piFetch POST ${url} err===`,err);
                try {
                    reject(JSON.parse(err));
                } catch (err) {
                    reject(err);
                }
            });
        } else {    // get
            pi_modules.ajax.exports.get(url,undefined,param && param.body,'string',pi_modules.ajax.exports.RESP_TYPE_TEXT,(res) => {
                console.log(`piFetch GET ${url} success===`,res);
                try {
                    resolve(JSON.parse(res));
                } catch (err) {
                    resolve(res);
                }
            },(err) => {
                console.log(`piFetch GET ${url} err===`,err);
                try {
                    reject(JSON.parse(err));
                } catch (err) {
                    reject(err);
                }
            });
        }
        
    });
};

// 弹出提示框
export const popNewMessage = (content: any) => {
    const name = 'app-components-message-message';
    if (!lookup(name)) {
        const name1 = name.replace(/-/g,'/');
        const sourceList = [`${name1}.tpl`,`${name1}.js`,`${name1}.wcss`,`${name1}.cfg`,`${name1}.widget`];
        piLoadDir(sourceList).then(() => {
            popNew(name, { content });
        });
    } else {
        popNew(name, { content });
    }
};

// 弹出loading
export const popNewLoading = (text: any) => {
    return popNew('app-components1-loading-loading', { text });
};

 // 水波纹动画效果展示
export const rippleShow = (e:any) => {
    getRealNode(e.node).classList.add('ripple');
    
    setTimeout(() => {
        getRealNode(e.node).classList.remove('ripple');
    }, 300);
};

/**
 * 获取用户基本信息
 */
export const getUserInfo = (userInfo1?:any) => {
    let promise;
    if (userInfo1) {
        promise = Promise.resolve(userInfo1);
    } else {
        promise = getStoreData('user');
    }
    
    return promise.then(userInfo => {
        console.log('getUserInfo userInfo = ',userInfo);
        let avatar = userInfo.info.avatar;
        if (avatar && avatar.indexOf('data:image') < 0) {
            if (avatar.slice(0,4) === 'http') {
                avatar = avatar;   
            } else {
                avatar = `${uploadFileUrlPrefix}${avatar}`;
            }
            
        } else {
            avatar = 'app/res/image/default_avater_big.png';
        }
        const level = chatGetStore(`userInfoMap/${chatGetStore('uid')}`,{ level:0 }).level;
    
        return {
            nickName: userInfo.info.nickName,
            phoneNumber: userInfo.info.phoneNumber,
            areaCode: userInfo.info.areaCode,
            isRealUser: userInfo.info.isRealUser,
            acc_id: userInfo.acc_id,
            avatar,
            level,
            sex:userInfo.info.sex,
            note:userInfo.info.note
        };
    });
};

/**
 * 货币判断
 */
export const currencyType = (str:string) => {
    if (str === 'ST') {
        return getModulConfig('ST_SHOW');
    } else if (str === 'KT') {
        return getModulConfig('KT_SHOW');
    } else if (str === 'SC') {
        return getModulConfig('SC_SHOW');
    } else {
        return str;
    }
};

/**
 * 金额格式化
 * @param banlance 金额
 */
export const formatBalance = (banlance: number) => {
    banlance = Number(banlance);
    if (!banlance) return 0;

    return Number(banlance.toFixed(6));
};

/**
 * 余额格式化
 */
export const formatBalanceValue = (value: number) => {
    if (value === 0) return '0.00';

    return value.toFixed(2);
};

/**
 * 计算日期间隔
 */
export const GetDateDiff = (startDate, endDate) => {
    let Y = `${startDate.getFullYear()}-`;
    let M = `${(startDate.getMonth() + 1 < 10 ? `0${(startDate.getMonth() + 1)}` : startDate.getMonth() + 1)}-`;
    let D = `${startDate.getDate()}`;
    startDate = new Date(`${Y}${M}${D}`);
    const startTime = startDate.getTime();
    Y = `${endDate.getFullYear()}-`;
    M = `${(endDate.getMonth() + 1 < 10 ? `0${(endDate.getMonth() + 1)}` : endDate.getMonth() + 1)}-`;
    D = `${endDate.getDate()}`;
    endDate = new Date(`${Y}${M}${D}`);
    const endTime = endDate.getTime();

    return Math.floor(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));
};

// 时间戳格式化 毫秒为单位
export const timestampFormatToDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;

    return `${year}-${month}-${day}`;
};

// 时间戳格式化 毫秒为单位
export const timestampFormat = (timestamp: number) => { 
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// unicode数组转字符串
export const unicodeArray2Str = (arr) => {
    let str = '';
    if (!arr || arr === 'null') {
        return str;
    }
    if (typeof arr === 'string') {   // 如果本身是字符串直接返回
        return arr;
    }
    for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

/**
 * str转u8Array
 */
export const str2U8Array = (str:string) => {
    const u8Array = new Uint8Array(str.length);
    for (let i = 0;i < str.length;i++) {
        u8Array[i] = str.charCodeAt(i);
    }

    return u8Array;
};

/**
 * 数字前边加0
 */
const addPerZero = (num: number, len: number) => {
    const numStr = num.toString();
    const perLen = len - numStr.length;
    if (perLen <= 0) return numStr;
    const list = [];
    list.length = perLen;

    return list.fill('0').join('') + numStr;
};

/**
 * 转化显示时间格式为‘04-30 14:32:00’
 */
export const transDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}:${addPerZero(t.getSeconds(), 2)}`;
};

/**
 * u8数组转十六进制字符串
 * 
 * @param u8Array 输入数组
 */
export const u8ArrayToHexstr = (u8Array: Uint8Array) => {
    let str = '';
    for (let i = 0; i < u8Array.length; i++) {
        str += Math.floor(u8Array[i] / 16).toString(16);
        str += (u8Array[i] % 16).toString(16);
        // str += u8Array[i].toString(16);
    }
    if (str[0] === '0') str = str.slice(1);

    return str;
};

/**
 * 十六进制字符串转u8数组
 * 
 * @param str 输入字符串
 */
export const hexstrToU8Array = (str: string) => {
    if (str.length % 2 > 0) str = `0${str}`;

    const r = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length; i += 2) {
        const high = parseInt(str.charAt(i), 16);
        const low = parseInt(str.charAt(i + 1), 16);
        r[i / 2] = (high * 16 + low);
    }

    return r;
};

/**
 * u8Array 转字符
 */
export const u8Array2Str = (u8Array:Uint8Array) => {
    let str = '';
    for (let i = 0;i < u8Array.length;i++) {
        str += String.fromCharCode(u8Array[i]);
    }

    return str;
}; 

/**
 * 获取异或值
 * @param first 前段
 * @param second 后段
 */

export const getXOR = (first, second) => {
    if (first.length !== second.length) return '';

    const arr = [];
    for (let i = 0; i < first.length; i++) {
        const m = parseInt(first.substr(i, 1), 16);
        const k = parseInt(second.substr(i, 1), 16);
        arr.push((m ^ k).toString(16));
    }

    return arr.join('');
};

/**
 * 通过地址获取地址余额
 */
export const getAddrInfoByAddr = (currencyRecords:CurrencyRecord[],addr: string, currencyName: string) => {
    for (const record of currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    return addrInfo;
                }
            }
        }
    }
};

// 获取SC涨跌情况 
export const fetchCloudGain = () => {
    return formatBalanceValue(0);
};

/**
 * 转化rtype
 */
export const parseRtype = (rType:number,lang:string) => {
    if (rType === 0) return Config[lang].luckeyMoney.ordinary; // 普通
    if (rType === 1) return Config[lang].luckeyMoney.random; // 随机
    if (rType === 99) return Config[lang].luckeyMoney.invite; // 邀请

    return '';
};

/**
 * 异或解码 解析16进制
 */
export const xorDecode1 = (str:string, key:string) => {
    const u8arr = hexstrToU8Array(str);
    const ord = []; 
    let res = '';

    for (let i = 1; i <= 255; i++) {ord[String.fromCharCode(i)] = i;}
    for (let i = 0; i < u8arr.length;i++) {
        res += String.fromCharCode(u8arr[i] ^ ord[key.substr(i %    key.length, 1)]);
    }

    return res;
};

/**
 * 异或编码
 */
export const xorEncode = (str:string, key:string) => {
    const ord = []; 
    let res = '';

    for (let i = 1; i <= 255; i++) {ord[String.fromCharCode(i)] = i;}

    for (let i = 0; i < str.length; i++) {
        const code = ord[str.substr(i, 1)] ^ ord[key.substr(i %    key.length, 1)];
        if (code < 16) {
            res += `0${code.toString(16)}`;
        } else {
            res += code.toString(16);
        }
    }

    return res;
};

/**
 * base64 to blob
 */
export const base64ToBlob = (base64: string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
};
/**
 * 图片base64转file格式
 */
export const base64ToFile = (base64: string) => {
    const blob = base64ToBlob(base64);
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log(newFile);

    return newFile;
};

/**
 * arrayBuffer转file格式
 */
export const arrayBuffer2File = (buffer:ArrayBuffer) => {
    const u8Arr = new Uint8Array(buffer);
    const blob = new Blob([u8Arr], { type: 'image/jpeg' });
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log('arrayBuffer2File = ',newFile);

    return newFile;
};

/**
 * 关掉所有页面 （不包括首页面）
 */
export const closeAllPage = () => {
    for (const v of backList) {
        if (v.widget.name !== 'app-view-base-app') {
            backCall();
        }
    }
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const fetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number) => {
    let balanceValue = 0;
    const USD2CNYRate = getStore('third/rate') || USD2CNYRateDefault;
    const currency2USDT = getStore('third/currency2USDTMap').get(currencyName) || { open: 0, close: 0 };
    const currencyUnit = getStore('setting/currencyUnit', 'CNY');
    const silverPrice = getStore('third/silver/price') || 0;
    if (currencyUnit === 'CNY') {
        if (currencyName === 'ST') {
            balanceValue = balance * (silverPrice / 100);
        } else if (currencyName === 'SC') {
            balanceValue = balance;
        } else {
            balanceValue = balance * currency2USDT.close * USD2CNYRate;
        }
    } else if (currencyUnit === 'USD') {
        if (currencyName === 'ST') {
            balanceValue = (balance * (silverPrice / 100)) / USD2CNYRate;
        } else if (currencyName === 'SC') {
            balanceValue = balance / USD2CNYRate;
        } else {
            balanceValue = balance * currency2USDT.close;
        }
    }

    return balanceValue;
};

// 获取货币的涨跌情况
export const fetchCoinGain = (currencyName: string) => {
    const currency2USDT: Currency2USDT = getStore('third/currency2USDTMap').get(currencyName);
    if (!currency2USDT) return formatBalanceValue(0);

    return formatBalanceValue(((currency2USDT.close - currency2USDT.open) / currency2USDT.open) * 100);
};

// 获取ST涨跌情况
export const fetchSTGain = () => {
    const goldGain = getStore('third/silver/change');
    if (!goldGain) {
        return formatBalanceValue(0);
    } else {
        return formatBalanceValue(goldGain * 100);
    }
};

/**
 * 获取云端总资产
 */
export const fetchCloudTotalAssets = () => {
    const cloudBalances = getCloudBalances();
    let totalAssets = 0;
    for (const [k, v] of cloudBalances) {
        totalAssets += fetchBalanceValueOfCoin(CloudCurrencyType[<any>k], v);
    }

    return totalAssets;
};

/**
 * 获取本地钱包资产列表
 */
export const fetchWalletAssetList = () => {
    const wallet = getStore('wallet');
    const showCurrencys = (wallet && wallet.showCurrencys) || defalutShowCurrencys;
    const assetList = [];
    for (const k in MainChainCoin) {
        const item: any = {};
        if (MainChainCoin.hasOwnProperty(k) && showCurrencys.indexOf(k) >= 0) {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            const balance = fetchBalanceOfCurrency(k);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(k, balance));
            item.gain = fetchCoinGain(k);
            item.rate = formatBalanceValue(fetchBalanceValueOfCoin(k,1));
            assetList.push(item);
        }

    }

    for (const k in ERC20Tokens) {
        const item: any = {};
        if (ERC20Tokens.hasOwnProperty(k) && showCurrencys.indexOf(k) >= 0) {
            item.currencyName = k;
            item.description = ERC20Tokens[k].description;
            const balance = fetchBalanceOfCurrency(k);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(k, balance));
            item.rate = formatBalanceValue(fetchBalanceValueOfCoin(k,1));
            item.gain = fetchCoinGain(k);
            assetList.push(item);
        }
    }

    return assetList;
};

/**
 * 获取云端钱包资产列表
 */
export const fetchCloudWalletAssetList = () => {
    const assetList = [];
    const cloudBalances = getCloudBalances();
    const ktBalance = cloudBalances.get(CloudCurrencyType.KT) || 0;
    const ktItem = {
        currencyName: 'KT',
        description: 'KT Token',
        balance: formatBalance(ktBalance),
        balanceValue: formatBalanceValue(fetchBalanceValueOfCoin('KT', ktBalance)),
        gain: fetchCloudGain(),
        rate:formatBalanceValue(0)
    };
    assetList.push(ktItem);
    const scBalance = cloudBalances.get(CloudCurrencyType.SC) || 0;
    const gtItem = {
        currencyName: 'SC',
        description: 'SC',
        balance: formatBalance(scBalance),
        balanceValue: formatBalanceValue(fetchBalanceValueOfCoin('SC',scBalance)),
        gain: fetchCloudGain(),
        rate:formatBalanceValue(fetchBalanceValueOfCoin('SC',1))
    };
    assetList.push(gtItem);
    for (const k in CloudCurrencyType) {
        let hidden = [];
        if (getModulConfig('IOS')) {
            hidden = getModulConfig('IOSCLOUDASSETSHIDDEN');
        }
        if (hidden.indexOf(k) >= 0) continue;
        const item: any = {};
        if (MainChainCoin.hasOwnProperty(k)) {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            const balance = cloudBalances.get(CloudCurrencyType[k]) || 0;
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(k, balance));
            item.gain = fetchCoinGain(k);
            item.rate = formatBalanceValue(fetchBalanceValueOfCoin(k,1));
            assetList.push(item);
        }
    }

    return assetList;
};

/**
 * 获取指定货币下余额总数
 * @param currencyName 货币名称
 */
export const fetchBalanceOfCurrency = (currencyName: string) => {
    const wallet = getStore('wallet');
    if (!wallet) return 0;
    let balance = 0;
    let currencyRecord = null;
    for (const item of wallet.currencyRecords) {
        if (item.currencyName === currencyName) {
            currencyRecord = item;
        }
    }
    for (const addrInfo of currencyRecord.addrs) {
        balance += addrInfo.balance;
    }

    return balance;
};

/**
 * 获取总资产
 */
export const fetchLocalTotalAssets = () => {
    const wallet = getStore('wallet');
    if (!wallet) return 0;
    let totalAssets = 0;
    wallet.currencyRecords.forEach(item => {
        if (wallet.showCurrencys.indexOf(item.currencyName) >= 0) {
            const balance = fetchBalanceOfCurrency(item.currencyName);
            totalAssets += fetchBalanceValueOfCoin(item.currencyName, balance);
        }

    });

    return totalAssets;
};

/**
 * 函数节流
 */
export const throttle = (func) => {
    const intervel = 100;
    let lastTime = 0;

    return  () => {
        const nowTime = new Date().getTime();
        if (nowTime - lastTime > intervel) {
            func();
            lastTime = nowTime;
        }
    };
};

// 检查手机弹框提示
export const checkPopPhoneTips = () => {
    return Promise.all([getStore('user/info/phoneNumber'),getStore('user/id')]).then(([phoneNumber,uid]) => {
        if (phoneNumber) {
            delPopPhoneTips();
            
            return;
        }
        if (localStorage.getItem('popPhoneTips') && uid) {
            
            popModalBoxs('app-components-modalBox-modalBox',getPopPhoneTips(),() => { 
                popNew('app-view-mine-setting-phone',{ jump:true });
            },undefined,true);      
        }
    });
};

// 设置手机弹框提示
export const setPopPhoneTips = () => {
    getUserInfo().then(userInfo => {
        const popPhoneTips = localStorage.getItem('popPhoneTips');
        if (!userInfo.phoneNumber && !popPhoneTips) localStorage.setItem('popPhoneTips','1');
    });
};

/**
 * 删除手机弹框提示
 */
export const delPopPhoneTips = () => {
    if (localStorage.getItem('popPhoneTips')) localStorage.removeItem('popPhoneTips');
};

/**
 * 获取手机提示语
 */
export const getPopPhoneTips = () => {
    const modalBox = { 
        zh_Hans:{
            title:'绑定手机',
            content:'为了避免您的游戏数据丢失，请绑定手机号',
            sureText:'去绑定',
            onlyOk:true
        },
        zh_Hant:{
            title:'綁定手機',
            content:'為了避免您的遊戲數據丟失，請綁定手機號',
            sureText:'去綁定',
            onlyOk:true
        },
        en:'' 
    };

    return modalBox[getLang()];
};