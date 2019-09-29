/**
 * common tools
 */
import { getStore as chatGetStore } from '../../chat/client/app/data/store';
import { setStore as earnSetStore } from '../../earn/client/app/store/memstore';
import { appLanguageList } from '../../pi/browser/localLanguage';
import { backCall, backList, popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { getRealNode } from '../../pi/widget/painter';
import { resize } from '../../pi/widget/resize/resize';
import { lookup } from '../../pi/widget/widget';
import { notSwtichShowCurrencys, preShowCurrencys, resendInterval } from '../config';
import { Config, defalutShowCurrencys, ERC20Tokens, MainChainCoin, uploadFileUrlPrefix } from '../publicLib/config';
import { CloudCurrencyType, CurrencyRecord, MinerFeeLevel, TxHistory, TxStatus, TxType, Wallet } from '../publicLib/interface';
import { unicodeArray2Str } from '../publicLib/tools';
import { getAccountDetail } from '../remote/pull';
import { gotoRecharge } from '../remote/recharge';
import { getCloudBalances, getStore, setStore } from '../store/memstore';
import { SettingLanguage } from '../view/base/app';
import { piLoadDir, piRequire } from './commonjsTools';
/**
 * 获取用户基本信息
 */
export const getUserInfo = (userInfo1?:any) => {
    let promise;
    if (userInfo1) {
        promise = Promise.resolve(userInfo1);
    } else {
        promise = getStore('user/info');
    }
    
    return promise.then(userInfo => {
        console.log('getUserInfo userInfo = ',userInfo);
        let avatar = userInfo.avatar;
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        } else {
            avatar = 'app/res/image/default_avater_big.png';
        }
        const level = chatGetStore(`userInfoMap/${chatGetStore('uid')}`,{ level:0 }).level;
    
        return {
            nickName: userInfo.nickName,
            phoneNumber: userInfo.phoneNumber,
            areaCode: userInfo.areaCode,
            isRealUser: userInfo.isRealUser,
            acc_id: userInfo.acc_id,
            avatar,
            level,
            sex:userInfo.sex,
            note:userInfo.note
        };
    });
};

/**
 * 解析显示的账号信息
 * @param str 需要解析的字符串
 */
export const parseAccount = (str: string) => {
    if (str.length <= 29) return str;

    return `${str.slice(0, 6)}...${str.slice(str.length - 6, str.length)}`;
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
 * 弹出密码提示框
 */
export const popPswBox = (content = [],onlyOk:boolean = false,cancelDel:boolean = false):Promise<string> => {
    return new Promise(async (resolve) => {
        const BoxInputTitle = Config[getLang()].userInfo.PswBoxInputTitle;
        popNew('app-components1-modalBoxInput-modalBoxInput', { itype: 'password', title: BoxInputTitle, content,onlyOk }, (r: string) => {
            resolve(r);
            if (!r && cancelDel) popPswBox(content,onlyOk,cancelDel);
        }, (forgetPsw:boolean) => {
            // TODO 删除账号
            // if (cancelDel && !forgetPsw)  logoutAccount();
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

// ==========================================================new version tools

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
export const fetchWalletAssetListAdded = (wallet:Wallet) => {
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

 // 水波纹动画效果展示
export const rippleShow = (e:any) => {
    getRealNode(e.node).classList.add('ripple');
    
    setTimeout(() => {
        getRealNode(e.node).classList.remove('ripple');
    }, 300);
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
 * 货币logo路径
 */
export const calCurrencyLogoUrl = (currencyName:string) => {
    const directory = preShowCurrencys.indexOf(currencyName) >= 0 ? 'image1' : 'image';
    
    return `app/res/${directory}/currency/${currencyName}.png`;
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
 * 过滤表情符号
 */
export const filterEomoji = (str:string) => {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g;
    str = str.replace(patt, (char) => {
        if (char.length === 2) {   // 辅助平面字符（我们需要做处理的一类）

            return '';
        } else {
            return char;
        }
    });

    return str;
};
/**
 * 表情包转字符
 */
export const utf16toEntities = (str:string) => { // 检测utf16emoji表情 转换为实体字符以供后台存储
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g;
    str = str.replace(patt, (char) => {
        // tslint:disable-next-line:one-variable-per-declaration
        let H, L, code;
        if (char.length === 2) {   // 辅助平面字符（我们需要做处理的一类）
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法

            return `&#${code};`;
        } else {
            return char;
        }
    });

    return str;
};

/**
 * 字符转表情
 */
export const uncodeUtf16 = (str:string) => {
    const reg = /\&#.*?;/g;

    return str.replace(reg,(char) => {
        // tslint:disable-next-line:one-variable-per-declaration
        let H,L,code;
        if (char.length === 9) {
            // tslint:disable-next-line:radix
            code = parseInt(char.match(/[0-9]+/g).toString());
            H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
            L = (code - 0x10000) % 0x400 + 0xDC00;

            return unescape(`%u${H.toString(16)}%u${L.toString(16)}`);
        } else {
            return char;
        }
    });

};

/**
 * 根据当前语言设置获取静态文字，对于组件模块
 */
export const getLanguage = (w) => {
    const lan = localStorage.getItem(SettingLanguage) || appLanguageList[appLanguageList.zh_Hans];

    return w.config.value[lan];
};

/**
 * 根据当前语言设置获取静态文字，对于单独的ts文件
 */
export const getStaticLanguage =  () => {
    const lan = localStorage.getItem(SettingLanguage) || appLanguageList[appLanguageList.zh_Hans];

    return Config[lan];
};

/**
 * 根据交易hash获取所有地址上本地交易详情
 */
export const fetchLocalTxByHash1 = (currencyRecords:CurrencyRecord[],hash:string) => {
    let txHistory = [];
    for (const record of currencyRecords) {
        for (const addrInfo of record.addrs) {
            txHistory = txHistory.concat(addrInfo.txHistory);
        }
    }
    for (const tx of txHistory) {
        // tslint:disable-next-line:possible-timing-attack
        if (tx.hash === hash) {
            return tx;
        }
    }
};

/**
 * 获取货币单位符号 $ ￥
 */
export const getCurrencyUnitSymbol = () => {
    return getStore('setting/currencyUnit', 'CNY').then(currencyUnit => {
        if (currencyUnit === 'CNY') {
            return '￥';
        } else if (currencyUnit === 'USD') {
            return '$';
        }
    });
};

/**
 * 获取当前使用货币的地址列表
 */
export const getCurrentAddrInfo1 = (currencyName:string,currencyRecords:CurrencyRecord[]) => {
    for (const record of currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === record.currentAddr) {
                    return addrInfo;
                }
            }
        }
    }
    
    return ;
};

/**
 * 去充值
 */
export const goRecharge = () => {
    const cloudBalances = getCloudBalances();
    const scBalance = cloudBalances.get(CloudCurrencyType.SC);
    gotoRecharge(scBalance,0).then(([err,res]) => {
        if (err !== 'cancel recharge') {
            popNewMessage('支付失败');
            console.log('支付失败 err',err);

            return;
        }
        popNew('app-view-wallet-cloudWalletCustomize-transactionDetails', { oid: res.oid,itype:res.itype,ctype:1 });
        earnSetStore('flags/firstRecharge',true); // 首次充值
        getAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
    });
};

/**
 * 简单数据深拷贝
 */
export const deepCopy = (v: any): any => {
    if (typeof v !== 'object') return v;
    
    return JSON.parse(JSON.stringify(v));
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

// ======================================================================================================================

/**
 * 钱包名称是否合法
 * @param walletName wallet name
 */
export const walletNameAvailable = (walletName) => {
    
    return getStrLen(walletName.trim()) >= 1 && getStrLen(walletName.trim()) <= 20;
};

/**
 * 修改钱包名称
 * @param walletName wallet name
 */
export const changeWalletName = (walletName:string) => {
    return getStore('user/info').then(userInfo => {
        userInfo.nickName = walletName;
        setStore('user/info', userInfo);
    });
    
};

/**
 * 钱包密码是否合乎规则
 * @param walletPsw  wallet password
 */
export const walletPswAvailable = (walletPsw:string) => {
    const reg = /^[.@$&*#a-zA-Z0-9]{8,}$/;

    return reg.test(walletPsw.trim());
};

/**
 * 判断密码是否相等
 * @param psw1 password one
 * @param psw2 password two
 */
export const pswEqualed = (psw1, psw2) => {
    if (!psw1 || !psw2) return false;
    
    return psw1.trim() === psw2.trim();
};

/**
 * 名字显示截取
 */
export const nickNameInterception = (name: string): string => {
    let ret = '';
    if (name.length > 6) {
        ret = `${name.slice(0, 6)}...`;
    } else {
        ret = name;
    }

    return ret;
};

/**
 * 修改钱包个性签名
 * @param walletNote wallet note
 */
export const changeWalletNote = (walletNote:string) => {
    return getStore('user/info').then(userInfo => {
        userInfo.note = walletNote;
        setStore('user/info', userInfo);
    });
    
};

/**
 * 修改钱包性别
 * @param walletSex wallet sex
 */
export const changeWalletSex = (walletSex:number) => {
    return getStore('user/info').then(userInfo => {
        userInfo.sex = walletSex;
        setStore('user/info', userInfo);
    });
    
};