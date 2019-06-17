import { DeviceIdProvider } from '../../pi/browser/device';
import { WebViewManager } from '../../pi/browser/webview';
import { cryptoRandomInt } from '../../pi/util/math';
// tslint:disable-next-line:max-line-length
import { Config, currencyConfirmBlockNumber, defalutShowCurrencys, ERC20Tokens, MainChainCoin, uploadFileUrlPrefix, USD2CNYRateDefault } from '../publicLib/config';
import { CloudCurrencyType, Currency2USDT, TxHistory } from '../publicLib/interface';
import { formatBalance, formatBalanceValue } from '../publicLib/tools';
import { getCloudBalances, getStore, setStore } from '../store/memstore';

/**
 * common tools
 */
/**
 * 获取屏幕刘海与下部分高度
 */
export const getScreenModify = () => {
    WebViewManager.getScreenModify((high,low) => {
        const calHigh = high / window.devicePixelRatio * 2;
        const calLow = low / window.devicePixelRatio * 2;
        setStore('setting/topHeight',calHigh);
        setStore('setting/bottomHeight',calLow);
    });
};

/**
 * 获取设备唯一id
 * 
 */
export const getDeviceId = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.uuid);
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getUUId((uuid:string) => {
            console.log(`获取设备的唯一id = ${uuid}`);
            if (!uuid) {
                uuid = getStore('setting/deviceId') || cryptoRandomInt().toString();
                setStore('setting/deviceId',uuid);
            }
            resolve(uuid);
        });
    });
};

/**
 * 获取设备信息
 */
export const getDeviceSystem = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve({ 
            manufacturer:oldDeviceAllDetail.manufacturer ,
            model:oldDeviceAllDetail.model,
            version:oldDeviceAllDetail.version 
        });
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getSystem((manufacturer:string,model:string,version:string) => {
            console.log(`获取设备信息 设备制造商 = ${manufacturer},设备名称 = ${model},系统版本号 = ${version}`);
            resolve({ 
                manufacturer:manufacturer || 'default',
                model:model || 'default',
                version:version || 'default' 
            });
        });
    });
};

/**
 * 获取设备总内存和当前可用内存
 */
export const getDeviceMemSize = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve({ 
            total:oldDeviceAllDetail.total ,
            avail: oldDeviceAllDetail.avail 
        });
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getMemSize((total:string,avail:string) => {
            console.log(`获取设备内存 系统总内存 = ${total},当前可用内存 = ${avail}`);
            resolve({ 
                total:total || 'default',
                avail: avail || 'default'
            });
        });
    });
};

/**
 * 获取当前网络状态
 */
export const getDeviceNetWorkStatus = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.netWorkStatus);
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getNetWorkStatus((netWorkStatus) => {
            console.log(`获取当前网络状态 = ${netWorkStatus}`);
            resolve(netWorkStatus || 'default');
        });
    });
};

/**
 * 获取网络供应商
 */
export const getOperatorName = () => {
    const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
    if (oldDeviceAllDetail) {
        return Promise.resolve(oldDeviceAllDetail.operator);
    }

    return new Promise(resolve => {
        const deviceIdProvider = new DeviceIdProvider();
        deviceIdProvider.getOperatorName((operator:string) => {
            console.log(`获取网络供应商 = ${operator}`);
            resolve(operator || 'default');
        });
    });
};

declare var pi_update;
/**
 * 获取设备所有详情
 */
export const getDeviceAllDetail = ():Promise<any> => {
    if (!pi_update.inAndroidApp && !pi_update.inIOSApp) {
        return new Promise((resolve) => {
            const uuid = getStore('setting/deviceId') || cryptoRandomInt().toString();
            setStore('setting/deviceId',uuid);
            resolve({ uuid });
        });
    } else {
        const oldDeviceAllDetail = getStore('flags').deviceAllDetail;
        if (oldDeviceAllDetail) {
            return Promise.resolve(oldDeviceAllDetail);
        }
        const allPromise = [getDeviceId(),getDeviceSystem(),getDeviceMemSize(),getDeviceNetWorkStatus(),getOperatorName()];

        return Promise.all(allPromise).then(([uuid,system,mem,netWorkStatus,operator]) => {
            const deviceAllDetail = {
                uuid,
                netWorkStatus,
                operator,
                ...system,
                ...mem
            };
            console.log('获取设备所有信息 ==',deviceAllDetail);
            setStore('flags/deviceAllDetail',deviceAllDetail);

            return deviceAllDetail;
        });
    }
    
};

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
 * 获取当前正在使用的ETH地址
 */
export const getCurrentEthAddr = () => {
    return getCurrentAddrInfo('ETH').addr;
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
 * 获取用户基本信息
 */
export const getUserInfo = (level:number = 0) => {
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
    // TODO  
    // const level = chatGetStore(`userInfoMap/${chatGetStore('uid')}`,{ level:0 }).level;

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