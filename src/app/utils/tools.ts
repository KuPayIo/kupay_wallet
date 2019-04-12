/**
 * common tools
 */
import { getStore as chatGetStore } from '../../chat/client/app/data/store';
import { backCall, backList, popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { cryptoRandomInt } from '../../pi/util/math';
import { Callback } from '../../pi/util/util';
import { getRealNode } from '../../pi/widget/painter';
import { resize } from '../../pi/widget/resize/resize';
import { lookup } from '../../pi/widget/widget';
import { Config, ERC20Tokens, MainChainCoin, uploadFileUrlPrefix } from '../config';
import { getDeviceId } from '../logic/native';
import { getModulConfig } from '../modulConfig';
import { logoutAccount } from '../net/login';
import { CloudCurrencyType, Currency2USDT, MinerFeeLevel, TxHistory, TxStatus, TxType } from '../store/interface';
import { getCloudBalances, getStore,setStore } from '../store/memstore';
import { getCipherToolsMod, getDataCenter, getGenmnemonicMod, piLoadDir, piRequire } from './commonjsTools';
// tslint:disable-next-line:max-line-length
import { currencyConfirmBlockNumber, defalutShowCurrencys, lang, notSwtichShowCurrencys, preShowCurrencys, resendInterval, USD2CNYRateDefault } from './constants';

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const getCurrentAddrInfo = (currencyName: string) => {
    const wallet = getStore('wallet');
    if (!wallet) return;
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === record.currentAddr) {
                    return addrInfo;
                }
            }
        }
    }

    return;
};

/**
 * 获取钱包下的所有地址
 * @param wallet wallet obj
 */
export const getAddrsAll = (wallet) => {
    const currencyRecords = wallet.currencyRecords;
    const retAddrs = [];
    currencyRecords.forEach((item) => {
        retAddrs.push(...item.addrs);
    });

    // 去除数组中重复的地址
    return [...new Set(retAddrs)];
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const getAddrsInfoByCurrencyName = (currencyName: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            return record.addrs;
        }
    }
};

/**
 * 通过地址获取地址余额
 */
export const getAddrInfoByAddr = (addr: string, currencyName: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    return addrInfo;
                }
            }
        }
    }
};

/**
 * 解析显示的账号信息
 * @param str 需要解析的字符串
 */
export const parseAccount = (str: string) => {
    if (str.length <= 29) return str;

    return `${str.slice(0, 6)}...${str.slice(str.length - 6, str.length)}`;
};

/**
 * 转化显示时间格式为‘04-30 14:32:00’
 */
export const transDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}:${addPerZero(t.getSeconds(), 2)}`;
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

// 数组乱序
export const shuffle = (arr: any[]): any[] => {
    const length = arr.length;
    const shuffled = Array(length);
    for (let index = 0, rand; index < length; index++) {
        rand = ~~(Math.random() * (index + 1));
        if (rand !== index) {
            shuffled[index] = shuffled[rand];
        }
        shuffled[rand] = arr[index];
    }

    return shuffled;
};

/**
 * 获取字符串有效长度
 * @param str 字符串
 * 
 * 中文字符算2个字符
 */
export const getStrLen = (str): number => {
    if (str === null) return 0;
    if (typeof str !== 'string') {
        str += '';
    }

    return str.replace(/[^\x00-\xff]/g, '01').length;
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

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

/**
 * 获取memery hash
 */
export const calcHashValuePromise = (pwd, salt?):Promise<string> => {
    return new Promise((resolve,reject) => {
        console.time('pi_create  calc argonHash');
        piRequire(['pi/browser/argonHash']).then(async (mods) => {
            let secretHash;
            const ArgonHash = mods[0].ArgonHash;
            const argonHash = new ArgonHash();
            argonHash.init();
            secretHash = await argonHash.calcHashValuePromise({ pwd, salt });
            console.timeEnd('pi_create  calc argonHash');
            getDataCenter().then(dataCenter => {
                dataCenter.checkAddr(secretHash);
            });
            
            resolve(secretHash);
        });
    });
};

/**
 * 弹出密码提示框
 */
export const popPswBox = (content = [],onlyOk:boolean = false,cancelDel:boolean = false):Promise<string> => {
    return new Promise(async (resolve) => {
        const name = 'app-components-modalBoxInput-modalBoxInput';
        if (!lookup(name)) {
            const name1 = name.replace(/-/g,'/');
            const sourceList = [`${name1}.tpl`,`${name1}.js`,`${name1}.wcss`,`${name1}.cfg`,`${name1}.widget`];
            await piLoadDir(sourceList);
        }
        const BoxInputTitle = Config[getLang()].userInfo.PswBoxInputTitle;
        popNew('app-components-modalBoxInput-modalBoxInput', { itype: 'password', title: BoxInputTitle, content,onlyOk }, (r: string) => {
            resolve(r);
            if (!r && cancelDel) popPswBox(content,onlyOk,cancelDel);
        }, (forgetPsw:boolean) => {
            if (cancelDel && !forgetPsw) logoutAccount();
            resolve('');
        });
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

// 计算支持的币币兑换的币种
export const currencyExchangeAvailable = () => {
    const changellyCurrencies = getStore('third/changellyCurrencies', []);
    const currencyArr = [];
    for (const i in MainChainCoin) {
        currencyArr.push(i);
    }
    for (const i in ERC20Tokens) {
        currencyArr.push(i);
    }

    return changellyCurrencies.filter(item => {
        return currencyArr.indexOf(item) >= 0;
    });
};

// 根据货币名获取当前正在使用的地址
export const getCurrentAddrByCurrencyName = (currencyName: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            return record.currentAddr;
        }
    }

    return;
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
// ==========================================================new version tools

// 获取gasPrice
export const fetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return getStore('third/gasPrice')[minerFeeLevel];
};

// 获取btc miner fee
export const fetchBtcMinerFee = (minerFeeLevel: MinerFeeLevel) => {
    return getStore('third/btcMinerFee')[minerFeeLevel];
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
 * 获取云端总资产
 */
export const fetchCloudTotalAssets = () => {
    const cloudBalances = getCloudBalances();
    let totalAssets = 0;
    for (const [k, v] of cloudBalances) {
        totalAssets += fetchBalanceValueOfCoin(CloudCurrencyType[k], v);
    }

    return totalAssets;
};

/**
 * 获取某个币种对应的货币价值
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
 * 没有创建钱包时
 */
export const hasWallet = () => {
    const wallet = getStore('wallet');
    if (!wallet) {
        popNew('app-components-modalBox-newUserWelfare',undefined, () => {
            // popNew('app-view-wallet-create-home');
            // popNew('app-view-base-localImg');
        });

        return false;
    }

    return true;
};

// 解析交易状态
export const parseStatusShow = (tx: TxHistory) => {
    if (!tx) {
        return {
            text: Config[getLang()].transfer.packing,// 打包
            icon: 'pending.png'
        };
    }
    const status = tx.status;
    if (status === TxStatus.Pending) {
        return {
            text: Config[getLang()].transfer.packing,// 打包
            icon: 'pending.png'
        };
    } else if (status === TxStatus.Confirmed) {
        return {
            text: `${Config[getLang()].transfer.confirmed} ${tx.confirmedBlockNumber}/${tx.needConfirmedBlockNumber}`,// 已确认
            icon: 'pending.png'
        };
    } else if (status === TxStatus.Failed) {
        return {
            text: Config[getLang()].transfer.transferFailed,// 交易失败
            icon: 'fail.png'
        };
    } else {
        return {
            text: Config[getLang()].transfer.completed,// 已完成
            icon: 'icon_right2.png'
        };
    }
};

// 解析转账类型
export const parseTxTypeShow = (txType: TxType) => {
    if (txType === TxType.Receipt) {
        return Config[getLang()].transfer.receipt;// 收款
    }

    return Config[getLang()].transfer.transfer;// 转账
};

// 解析是否可以重发
export const canResend = (tx) => {
    if (tx.status !== TxStatus.Pending) return false;
    if (tx.minerFeeLevel === MinerFeeLevel.Fastest) return false;
    const startTime = tx.time;
    const now = new Date().getTime();
    if (now - startTime < resendInterval) return false;

    return true;
};

/**
 * 获取钱包资产列表是否添加
 */
export const fetchWalletAssetListAdded = () => {
    const wallet = getStore('wallet');
    const showCurrencys = wallet.showCurrencys || defalutShowCurrencys;
    const assetList = [];
    for (const k in MainChainCoin) {
        const item: any = {};
        if (MainChainCoin.hasOwnProperty(k) && k !== 'KT') {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            if (showCurrencys.indexOf(k) >= 0) {
                item.added = true;
            } else {
                item.added = false;
            }
            if (notSwtichShowCurrencys.indexOf(k) >= 0) {
                item.canSwtiched = false;
            } else {
                item.canSwtiched = true;
            }
            assetList.push(item);
        }

    }

    for (const k in ERC20Tokens) {
        const item: any = {};
        if (ERC20Tokens.hasOwnProperty(k)) {
            item.currencyName = k;
            item.description = ERC20Tokens[k].description;
            if (showCurrencys.indexOf(k) >= 0) {
                item.added = true;
            } else {
                item.added = false;
            }
            if (notSwtichShowCurrencys.indexOf(k) >= 0) {
                item.canSwtiched = false;
            } else {
                item.canSwtiched = true;
            }
            assetList.push(item);
        }
    }

    return assetList;
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

// 获取SC涨跌情况 
export const fetchCloudGain = () => {
    return formatBalanceValue(0);
};
/**
 * 转化rtype
 */
export const parseRtype = (rType) => {
    if (rType === 0) return Config[getLang()].luckeyMoney.ordinary; // 普通
    if (rType === 1) return Config[getLang()].luckeyMoney.random; // 随机
    if (rType === 99) return Config[getLang()].luckeyMoney.invite; // 邀请

    return '';
};
/**
 * 获取某id理财产品持有量，不算已经赎回的
 */
export const fetchHoldedProductAmount = (id: string) => {
    const purchaseRecord = getStore('activity/financialManagement/purchaseHistories');
    let holdAmout = 0;
    for (let i = 0; i < purchaseRecord.length; i++) {
        const one = purchaseRecord[i];
        if (one.id === id && one.state === 1) {
            holdAmout += one.amount;
        }
    }

    return holdAmout;
};

/**
 * 计算剩余百分比
 */
export const calPercent = (surplus: number, total: number) => {
    if (surplus === 0) {
        return {
            left: 0,
            use: 100
        };
    }
    if (surplus === total) {
        return {
            left: 100,
            use: 0
        };
    }
    if (surplus <= total / 100) {
        return {
            left: 1,
            use: 99
        };
    }
    const r = Number((surplus / total).toString().slice(0, 4));

    return {
        left: r * 100,
        use: 100 - r * 100
    };
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
 * arrayBuffer图片压缩
 * @param buffer 图片arraybuffer
 */
export const imgResize = (buffer:ArrayBuffer,callback:Function) => {
    const file = arrayBuffer2File(buffer);
    const fr = new FileReader();
    fr.readAsDataURL(file); 
    fr.onload = () => { 
        const dataUrl = fr.result.toString();  
        resize({ url: dataUrl, width: 140, ratio: 0.3, type: 'jpeg' }, (res) => {
            console.log('resize---------', res);
            callback(res);
        });
    };
    
};

/**
 * 获取区块确认数
 */
export const getConfirmBlockNumber = (currencyName: string, amount: number) => {
    if (ERC20Tokens[currencyName]) {
        return currencyConfirmBlockNumber.ERC20;
    }
    const confirmBlockNumbers = currencyConfirmBlockNumber[currencyName];
    for (let i = 0; i < confirmBlockNumbers.length; i++) {
        if (amount < confirmBlockNumbers[i].value) {
            return confirmBlockNumbers[i].number;
        }
    }
};

/**
 * 根据当前语言设置获取静态文字，对于组件模块
 */
export const getLanguage = (w) => {
    const lan = getStore('setting/language', 'zh_Hans');

    return w.config.value[lan];
};

/**
 * 根据当前语言设置获取静态文字，对于单独的ts文件
 */
export const getStaticLanguage = () => {
    const lan = getStore('setting/language', 'zh_Hans');

    return Config[lan];
};

/**
 * 助记词片段分享加密
 * 为了便于识别用户使用的是同一组密钥，会在分享出去的密钥的第2/4/6/8/10/12加上一个相同的随机数
 */
export const mnemonicFragmentEncrypt = (fragments: string[]) => {
    const len = 6;
    const randomArr = [];
    for (let i = 0; i < len; i++) {
        const random = Math.floor(Math.random() * 10);
        randomArr.push(random);
    }
    const retFragments = [];
    for (let i = 0; i < fragments.length; i++) {
        const fragmentArr = fragments[i].split('');
        let j = 1;
        // tslint:disable-next-line:binary-expression-operand-order
        while (2 * j <= 12) {
            // tslint:disable-next-line:binary-expression-operand-order
            fragmentArr.splice(2 * j - 1, 0, randomArr[j - 1]);
            j++;
        }
        retFragments.push(fragmentArr.join(''));
    }

    return retFragments;
};

/**
 * 助记词片段分享解密
 * 为了便于识别用户使用的是同一组密钥，会在分享出去的密钥的第2/4/6/8/10/12加上一个相同的随机数
 */
export const mnemonicFragmentDecrypt = (fragment: string) => {
    const fragmentArr = fragment.split('');
    const randomArr = [];
    let j = 6;
    while (j > 0) {
        // tslint:disable-next-line:binary-expression-operand-order
        const delRandom = fragmentArr.splice(2 * j - 1, 1);
        j--;
        randomArr.push(delRandom);
    }

    return {
        fragment: fragmentArr.join(''),
        randomStr: randomArr.reverse().join('')
    };
};

/**
 * 判断是否是有效的货币地址
 */
export const isValidAddress = (addr: string, currencyName: string) => {
    if (currencyName === 'BTC') {
        // todo
    } else {
        return isETHValidAddress(addr);
    }
};

/**
 * 判断是否是有效的ETH地址
 */
const isETHValidAddress = (addr: string) => {
    if (!addr || !addr.startsWith('0x') || addr.length !== 42) return false;
    if (isNaN(Number(addr))) return false;

    return true;
};

declare var pi_modules;

// 获取本地版本号
export const getLocalVersion = () => {
    const updateMod = pi_modules.update.exports;
    const versionArr = updateMod.getLocalVersion();
    const versionStr = versionArr.join('.');

    return versionStr.slice(0, versionStr.length - 7);
};

// 获取远端版本号
export const getRemoteVersion = () => {
    const updateMod = pi_modules.update.exports;
    const versionArr = updateMod.getRemoteVersion();
    const versionStr = versionArr.join('.');

    return versionStr.slice(0, versionStr.length - 7);
};

/**
 * 获取货币单位符号 $ ￥
 */
export const getCurrencyUnitSymbol = () => {
    const currencyUnit = getStore('setting/currencyUnit', 'CNY');
    if (currencyUnit === 'CNY') {
        return '￥';
    } else if (currencyUnit === 'USD') {
        return '$';
    }
};

/**
 * 判断地址是否合法
 * @param ctype 货币名称
 * @param str 地址
 */
export const judgeAddressAvailable = (ctype: string, addr: string) => {
    if (ctype === 'BTC') {
        return /^[0-9a-zA-Z]{26,34}$/.test(addr);
    } else {
        return /(^0x)[0-9a-fA-f]{40}$/.test(addr);
    }
};

/**
 * 解析交易的额外信息
 */
export const parseTransferExtraInfo = (input: string) => {
    return input === '0x' ? '无' : input;
};

/**
 * 更新本地交易记录
 */
export const updateLocalTx = (tx: TxHistory) => {
    const wallet = getStore('wallet');
    if (!wallet) return;
    const currencyName = tx.currencyName;
    const addr = tx.addr;
    wallet.currencyRecords.forEach(record => {
        if (record.currencyName === currencyName) {
            record.addrs.forEach(addrInfo => {
                if (addrInfo.addr.toLowerCase() === addr.toLowerCase()) {
                    let index = -1;
                    const txHistory = addrInfo.txHistory;
                    for (let i = 0; i < txHistory.length; i++) {
                        if (txHistory[i].hash === tx.hash) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        txHistory.splice(index, 1, tx);
                    } else {
                        txHistory.push(tx);
                    }
                }
            });
        }
    });

    setStore('wallet/currencyRecords', wallet.currencyRecords);
};

/**
 * 删除本地交易记录
 */
export const deletLocalTx = (tx: TxHistory) => {
    const wallet = getStore('wallet');
    const currencyName = tx.currencyName;
    const addr = tx.addr;
    wallet.currencyRecords.forEach(record => {
        if (record.currencyName === currencyName) {
            record.addrs.forEach(addrInfo => {
                if (addrInfo.addr === addr) {
                    let index = -1;
                    const txHistory = addrInfo.txHistory;
                    for (let i = 0; i < txHistory.length; i++) {
                        if (txHistory[i].hash === tx.hash) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        txHistory.splice(index, 1);
                    }
                }
            });
        }
    });

    setStore('wallet/currencyRecords', wallet.currencyRecords);
};

/**
 * 获取某个地址的nonce
 * 只取ETH地址下的nonce
 */
export const getEthNonce = (addr: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === 'ETH') {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    return addrInfo.nonce;
                }
            }
        }

    }
};

/**
 * 设置某个地址的nonce
 * 只设置ETH地址下的nonce
 */
export const setEthNonce = (newNonce: number, addr: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === 'ETH') {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    addrInfo.nonce = newNonce;
                    setStore('wallet', wallet);

                    return;
                }
            }
        }

    }
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
 * 获取当前正在使用的ETH地址
 */
export const getCurrentEthAddr = () => {
    return getCurrentAddrInfo('ETH').addr;
};

/**
 * 获取用户基本信息
 */
export const getUserInfo = () => {
    const userInfo = getStore('user/info');
    const nickName = userInfo.nickName;
    const phoneNumber = userInfo.phoneNumber;
    const isRealUser = userInfo.isRealUser;
    const areaCode = userInfo.areaCode;
    const acc_id = userInfo.acc_id;
    let avatar = userInfo.avatar;
    if (avatar && avatar.indexOf('data:image') < 0) {
        avatar = `${uploadFileUrlPrefix}${avatar}`;
    } else {
        avatar = 'app/res/image/default_avater_big.png';
    }

    const level = chatGetStore(`userInfoMap/${chatGetStore('uid')}`,{ level:0 }).level;

    return {
        nickName,
        avatar,
        phoneNumber,
        areaCode,
        isRealUser,
        acc_id,
        level
    };
};

 // 水波纹动画效果展示
export const rippleShow = (e:any) => {
    getRealNode(e.node).classList.add('ripple');

    setTimeout(() => {
        getRealNode(e.node).classList.remove('ripple');
    }, 500);
};

/**
 * 获取随机名字
 */
export const playerName = async () => {
    const mods = await piRequire(['app/utils/nameWareHouse']);
    const nameWare = mods[0].nameWare;
    const num1 = nameWare[0].length;
    const num2 = nameWare[1].length;
    let name = '';
    // tslint:disable-next-line:max-line-length
    name = unicodeArray2Str(nameWare[0][Math.floor(Math.random() * num1)]) + unicodeArray2Str(nameWare[1][Math.floor(Math.random() * num2)]);
    
    return name;
};

/**
 * 获取助记词
 */
export const getMnemonic = async (passwd) => {
    const wallet = getStore('wallet');
    const hashPromise = calcHashValuePromise(passwd, getStore('user/salt'));
    const cipherToolsrPromise = getCipherToolsMod();
    const genmnemonicPromise = getGenmnemonicMod();
    const [hash,cipherTools,genmnemonic] = await Promise.all([hashPromise,cipherToolsrPromise,genmnemonicPromise]);
    try {
        const r = cipherTools.decrypt(wallet.vault,hash);
        
        return genmnemonic.toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 货币logo路径
 */
export const calCurrencyLogoUrl = (currencyName:string) => {
    const directory = preShowCurrencys.indexOf(currencyName) >= 0 ? 'image1' : 'image';
    
    return `app/res/${directory}/currency/${currencyName}.png`;
};

/**
 * 弹出三级页面
 */
export const popNew3 = (name: string, props?: any, ok?: Callback, cancel?: Callback) => {
    const level_3_page_loaded = getStore('flags').level_3_page_loaded;
    if (level_3_page_loaded) {
        popNew(name,props,ok,cancel);
    } else {
        const loading = popNew('app-components1-loading-loading1');
        const level3SourceList = [
            'app/core/',
            'app/logic/',
            'app/components/',
            'app/res/',
            'app/api/',
            'app/view/',
            'chat/client/app/view/',
            'chat/client/app/widget/',
            'chat/client/app/res/',
            'earn/client/app/view/',
            'earn/client/app/test/',
            'earn/client/app/components/',
            'earn/client/app/res/',
            'earn/client/app/xls/',
            'earn/xlsx/'
        ];
        piLoadDir(level3SourceList).then(() => {
            console.log('popNew3 ------ all resource loaded');
            popNew(name,props,ok,cancel);
            loading.callback(loading.widget);
        });
    }
};

/**
 * 关掉所有页面 （不包括首页面）
 */
export const closeAllPage = () => {
    for (let i = backList.length;i > 1;i--) {
        backCall();
    }
};

// 货币判断
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
// 检查手机弹框提示
export const checkPopPhoneTips = () => {
    if (getStore('user/info/phoneNumber')) {
        delPopPhoneTips();
        
        return;
    }
    if (localStorage.getItem('popPhoneTips') && getStore('user/id')) {
        
        popModalBoxs('app-components-modalBox-modalBox',getPopPhoneTips(),() => { 
            popNew('app-view-mine-setting-phone',{ jump:true });
        },undefined,true);      
    }
};

// 设置手机弹框提示
export const setPopPhoneTips = () => {
    const userInfo = getUserInfo();
    const popPhoneTips = localStorage.getItem('popPhoneTips');
    if (!userInfo.phoneNumber && !popPhoneTips) localStorage.setItem('popPhoneTips','1');
};

/**
 * 删除手机弹框提示
 */
export const delPopPhoneTips = () => {
    if (localStorage.getItem('popPhoneTips')) localStorage.removeItem('popPhoneTips');
};