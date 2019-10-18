import { setStore as earnSetStore } from '../../earn/client/app/store/memstore';
import { closeCon, setBottomLayerReloginMsg } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { cryptoRandomInt } from '../../pi/util/math';
import { Callback } from '../../pi/util/util';
import { resize } from '../../pi/widget/resize/resize';
import { getStoreData, setStoreData } from '../api/walletApi';
import { logoutWalletSuccess, openConnect } from '../net/login';
import { getAccountDetail } from '../net/pull';
// tslint:disable-next-line:max-line-length
import { Config, defalutShowCurrencys, ERC20Tokens, MainChainCoin, notSwtichShowCurrencys, preShowCurrencys, resendInterval } from '../public/config';
import { CloudCurrencyType, CurrencyRecord, MinerFeeLevel, TxHistory, TxStatus, TxType, Wallet } from '../public/interface';
import { getCloudBalances, getStore,initCloudWallets, setStore } from '../store/memstore';
import { piLoadDir, piRequire } from './commonjsTools';
// tslint:disable-next-line:max-line-length
import { arrayBuffer2File, closeAllPage, delPopPhoneTips, popNewMessage, unicodeArray2Str } from './pureUtils';
import { gotoRecharge } from './recharge';

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
 * 获取文字配置
 */
export const getStaticLanguage = () => {
    const lan = getStore('setting/language');
    
    return Config[lan];
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
 * 弹出三级页面
 */
export const popNew3 = (name: string, props?: any, ok?: Callback, cancel?: Callback) => {
    const level_3_page_loaded = getStore('flags').level_3_page_loaded;
    if (level_3_page_loaded) {
        popNew(name,props,ok,cancel);
    } else {
        const loading = popNew('app-components1-loading-loading1');
        const level3SourceList = [
            'app/middleLayer/',
            'app/publicLib/',
            'app/viewLogic/',
            'app/components/',
            'app/res/',
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
            setStore('flags/level_3_page_loaded',true);
            loading.callback(loading.widget);
        });
    }
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
    const currencyUnit = getStore('setting/currencyUnit', 'CNY');
    if (currencyUnit === 'CNY') {
        return '￥';
    } else if (currencyUnit === 'USD') {
        return '$';
    }
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
    getStoreData('user/info').then((r:any) => {
        r.nickName = walletName;
        setStoreData('user/info',r);
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
    getStoreData('user/info').then((r:any) => {
        r.note = walletNote;
        setStoreData('user/info',r);
    });
};

/**
 * 修改钱包性别
 * @param walletSex wallet sex
 */
export const changeWalletSex = (walletSex:number) => {
    getStoreData('user/info').then((r:any) => {
        r.sex = walletSex;
        setStoreData('user/info',r);
    });
};

/**
 * 注销账户并删除数据
 */
export const logoutAccount = async (del:boolean = false,noLogin:boolean = false) => {
    setStore('user/token','');
    const user = {
        id: '',                      // 该账号的id
        isLogin: false,              // 登录状态
        offline:false,                // 在线状态
        allIsLogin:false,            // 所有服务登录状态  (钱包  活动  聊天)
        token: '',                   // 自动登录token
        conRandom: '',               // 连接随机数
        conUid: '',                   // 服务器连接uid
        publicKey: '',               // 用户公钥, 第一个以太坊地址的公钥
        salt: cryptoRandomInt().toString(),                    // 加密 盐值
        secretHash: '',             // 密码hash缓存   
        info: {                      // 用户基本信息
            nickName: '',           // 昵称
            avatar: '',            // 头像
            phoneNumber: '',       // 手机号
            isRealUser: false    // 是否是真实用户
        }
    };
    const cloud = {
        cloudWallets: initCloudWallets()     // 云端钱包相关数据, 余额  充值提现记录...
    };
    
    const activity = {
        luckyMoney: {
            sends: null,          // 发送红包记录
            exchange: null,       // 兑换红包记录
            invite: null          // 邀请码记录
        },
        mining: {
            total: null,      // 挖矿汇总信息
            history: null, // 挖矿历史记录
            addMine: [],  // 矿山增加项目
            mineRank: null,    // 矿山排名
            miningRank: null,  // 挖矿排名
            itemJump: null
        },                       // 挖矿
        dividend: {
            total: null,         // 分红汇总信息
            history: null       // 分红历史记录
        },
        financialManagement: {          // 理财
            products: null,
            purchaseHistories: null
        }
    };

    let lockScreen = getStore('setting/lockScreen');
    lockScreen = {
        psw:'',
        open:false
    };
    setStore('wallet',null,false);
    setStore('cloud',cloud,false);
    setStore('user',user);
    setStore('activity',activity);
    setStore('setting/lockScreen',lockScreen);
    setStore('flags/saveAccount', false);  
    setBottomLayerReloginMsg('','','');
    closeCon();
    logoutWalletSuccess();
    setTimeout(() => {
        openConnect();
    },100);
    if (!noLogin) {
        closeAllPage();
        popNew('app-view-base-entrance');
    }
    delPopPhoneTips();
   
};
