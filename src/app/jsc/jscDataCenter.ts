/**
 * 数据更新中心
 */
import { btcNetwork, defaultEthToAddr, ERC20Tokens, MainChainCoin } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet } from '../core/eth/wallet';
import { getSilverPrice } from '../net/pull';
import { changellyGetCurrencies, fetchCurrency2USDTRate, fetchUSD2CNYRate } from '../net/pull3';
import { BigNumber } from '../res/js/bignumber';
import { AddrInfo,CurrencyRecord,TxHistory,TxStatus, TxType } from '../store/interface';
import { getStore,setStore } from '../store/memstore';
import { erc20GasLimitRate, ethTokenTransferCode, lang } from '../utils/constants';
import { formatBalance,getAddrsAll,getConfirmBlockNumber,getCurrentEthAddr, parseTransferExtraInfo, updateLocalTx } from '../utils/tools';
import { ethTokenDivideDecimals,ethTokenMultiplyDecimals,sat2Btc,smallUnit2LargeUnit, wei2Eth } from '../utils/unitTools';
import { fetchLocalTxByHash,fetchTransactionList,getMnemonicByHash } from '../utils/walletTools';
/**
 * 创建事件处理器表
 * @example
 */
class DataCenter {
    public timerRef: number = 0;
    public timerRef1: number = 0;
    public updateList: any[] = [];
    public currencyExchangeTimer: number;
  // 交易定时器列表
    private txTimerList:any[] = [];
  // 余额定时器列表
    private balanceTimerList:any[] = [];
    private checkAddrTimer:number;

  /**
   * 初始化
   */
    public init() {
        // 币币兑换可用货币获取
        changellyGetCurrencies();
        // 更新黄金价格
        this.updateGoldPrice();
        // 更新人民币美元汇率
        // this.updateUSDRate();
        // 更新货币对比USDT的比率
        // this.updateCurrency2USDTRate();
        this.initErc20GasLimit();
        this.refreshAllTx();
    }
    /**
     * 刷新所有余额
     */
    public refreshAllBalance() {
        let neededRefreshCount = 0;
        const wallet = getStore('wallet');
        if (!wallet) return;
        const list = [];
        wallet.currencyRecords.forEach(v => {
            if (wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                v.addrs.forEach((addrInfo) => {
                    list.push({ addr: addrInfo.addr, currencyName: v.currencyName });
                });
                
            }
        });
        list.forEach(v => {
            this.timerUpdateBalance(v.addr, v.currencyName);
            neededRefreshCount++;
        });

        return neededRefreshCount;
    }
    /**
     * 刷新本地钱包
     */
    public refreshAllTx() {
        let neededRefreshCount = 0;
        const wallet = getStore('wallet');
        if (!wallet) return;
        const list = [];
        wallet.currencyRecords.forEach(v => {
            if (wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                list.push({ addr: v.currentAddr, currencyName: v.currencyName });
            }
        });
        list.forEach(v => {
            this.updateAddrInfo(v.addr, v.currencyName);
            neededRefreshCount++;
        });

        return neededRefreshCount;
    }

    /**
     * 更新地址相关 交易记录及余额定时更新
     */
    public updateAddrInfo(addr: string, currencyName: string) {
        this.timerUpdateBalance(addr, currencyName); // 定时更新余额
        this.parseTransactionDetails(addr,currencyName); // 更新交易记录
    }

    /**
     * 初始化ERC20代币GasLimit
     */
    public initErc20GasLimit() {
        const wallet = getStore('wallet');
        if (!wallet) return;
        wallet.showCurrencys.forEach(currencyName => {
            if (ERC20Tokens[currencyName]) {
                this.fetchErc20GasLimit(currencyName);
            }
        });
    }

    /**
     * 获取ERC20代币GasLimit
     */
    public fetchErc20GasLimit(currencyName:string) {
        const defaultPay = 0;
        const fromAddr = getCurrentEthAddr();
        estimateGasERC20(currencyName, defaultEthToAddr,fromAddr, defaultPay).then(res => {
            const gasLimitMap = getStore('third/gasLimitMap');
            gasLimitMap.set(currencyName, res * erc20GasLimitRate);
            setStore('third/gasLimitMap', gasLimitMap);
        });
    }

    /**
     * 获取币币交易交易记录
     */
    public fetchCurrencyExchangeTx() {
        const wallet = getStore('wallet');
        if (!wallet) return;
        const curAllAddrs = getAddrsAll(wallet);
        curAllAddrs.forEach(item => {
            // getTransactionsByAddr(item);
        });
    }
  
    /**
     * 检查已使用过的地址
     */
    public async checkAddr(secretHash:string) {
        const wallet = getStore('wallet');
        if (!wallet) return;
        const currencyRecord: CurrencyRecord[] = wallet.currencyRecords;
        const needCheckAddr = [];
        currencyRecord.forEach(item => {
            if (!item.updateAddr && wallet.showCurrencys.indexOf(item.currencyName) >= 0) {
                needCheckAddr.push(item);
            }
        });
        this.timerCheckAddr(needCheckAddr,secretHash);
    }

    /**
     * 获取btc交易详情
     */
    public async getBTCTransactionByHash(hash: string, addr: string) {
        if (!hash) return;
        const v = await BtcApi.getTxInfo(hash);
        this.parseBtcTransactionTxRecord(addr, v);
    }

  // ===============================余额更新相关=======================================================
    
    /**
     * 定时器更新余额
     */
    public timerUpdateBalance(addr: string, currencyName: string) {
        this.updateBalance(addr, currencyName);
        const delay = this.getBalanceUpdateDelay(addr, currencyName);
        this.clearBalanceTimer(addr, currencyName);
        const timer = setTimeout(() => {
            this.timerUpdateBalance(addr, currencyName);
        }, delay);
        this.resetBalanceTimerList(addr, currencyName, timer, delay);
        console.log('定时更新余额', {
            delay,
            addr,
            currencyName,
            time: new Date().getTime(),
            timer
        });
    }

    /**
     * 更新余额
     */
    public updateBalance(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            const balanceOfCode = EthWallet.tokenOperations('balanceof',currencyName,addr);
            const api = new EthApi();

            return api.ethCall(ERC20Tokens[currencyName].contractAddr, balanceOfCode)
                .then(r => {
                    const num = formatBalance(ethTokenDivideDecimals(Number(r), currencyName));
                    this.setBalance(addr, currencyName, num);
                });
        }
        switch (currencyName) {
            case 'ETH':
                const api = new EthApi();
                
                return api.getBalance(addr).then(r => {
                    const num = wei2Eth(r.result);
                    this.setBalance(addr, currencyName, num);
                });
            case 'BTC':
                return BtcApi.getBalance(addr).then(r => {
                    if (!r) return;
                    this.setBalance(addr, currencyName, sat2Btc(r));
                });
            default:
        }
    }

  // 定时更新交易
    public async timerUpdateTxWithdraw(tx: TxHistory) {
        const addr = tx.addr;
        const currencyName = tx.currencyName;
        const hash = tx.hash;
        const newTx = fetchLocalTxByHash(addr, currencyName, hash);
        const delay = this.calTxDelay(tx, tx.currencyName);
        const status = tx.status;
        if (status === TxStatus.Success) return;
        this.updateTxStatus(tx && tx.hash, currencyName, addr);
        if (!delay) return;
        const timer = setTimeout(() => {
            this.timerUpdateTxWithdraw(newTx || tx);
        }, delay);
        this.resetTxTimer(tx.hash, timer);
    }

  // 通过hash清楚定时器
    public clearTxTimer(hash: string) {
        let timerItem;
        for (let i = 0; i < this.txTimerList.length; i++) {
            // tslint:disable-next-line:possible-timing-attack
            if (this.txTimerList[i].hash === hash) {
                timerItem = this.txTimerList[i];
                clearTimeout(timerItem.timer);
                this.txTimerList.splice(i, 1);

                return;
            }
        }
    }

  /****************************************************************************************************
   * 私有函数
   ******************************************************************************************/

  // 币币交易记录定时器
    private currencyExchangeTimerStart() {
        // this.fetchCurrencyExchangeTx();
        this.currencyExchangeTimer = setTimeout(() => {
            this.currencyExchangeTimerStart();
        }, 30 * 1000);
    }

    private timerCheckAddr(needCheckAddr:CurrencyRecord[],secretHash:string) {
        clearTimeout(this.checkAddrTimer);
        const record = needCheckAddr.shift();
        if (!record) return;
        
        if (!record.updateAddr) {
            console.log('checkAddr', record.currencyName);
            if (record.currencyName === 'ETH') {
                this.checkEthAddr(secretHash);
            } else if (record.currencyName === 'BTC') {
                this.checkBtcAddr(secretHash);
            } else if (ERC20Tokens[record.currencyName]) {
                this.checkEthERC20TokenAddr(record.currencyName,secretHash);
            }

        }

        this.checkAddrTimer = setTimeout(() => {
            this.timerCheckAddr(needCheckAddr,secretHash);
        }, 1000);
    }

  /**
   * 解析交易详情
   */
    private async parseTransactionDetails(addr: string, currencyName: string) {
        switch (currencyName) {
            case 'ETH':
                this.parseEthTransactionDetails(addr);
                break;
            case 'BTC':
                this.parseBtcTransactionDetails(addr);
                break;
            default:
        }
        if (ERC20Tokens[currencyName]) {
            this.parseEthERC20TokenTransactionDetails(addr, currencyName);

            return;
        }
    }

    /**
     * 解析eth交易详情
     * @param addr addr
     */
    private async parseEthTransactionDetails(addr: string) {
        try {
            const api = new EthApi();
            const r: any = await api.getAllTransactionsOf(addr);
            // console.log(r);
            const ethTrans = this.filterEthTrans(r.result);
            const localTxList = fetchTransactionList(addr, 'ETH');
            const allTxHash = [];
            localTxList.forEach(item => {
                allTxHash.push(item.hash);
            });
            ethTrans.forEach(item => {
                if (allTxHash.indexOf(item.hash) < 0) {
                    allTxHash.push(item.hash);
                }
            });
            allTxHash.forEach(hash => {
                if (this.neededUpdate('ETH', hash, addr)) {
                    this.timerUpdateTx(addr, 'ETH', hash);
                }
            });
        } catch (err) {
            console.log('parseEthTransactionDetails------', err);
        }
        
    }

    /**
     * 解析erc20交易详情
     */
    private async parseEthERC20TokenTransactionDetails(addr: string,currencyName: string) {
        try {
            const api = new EthApi();
            const contractAddress = ERC20Tokens[currencyName].contractAddr;
            const res = await api.getTokenTransferEvents(contractAddress, addr);
            const erc20Tx = res.result;
            const localTxList = fetchTransactionList(addr, currencyName);
            const allTxHash = [];
            localTxList.forEach(item => {
                allTxHash.push(item.hash);
            });
            erc20Tx.forEach(item => {
                if (allTxHash.indexOf(item.hash) < 0) {
                    allTxHash.push(item.hash);
                }
            });
            allTxHash.forEach(hash => {
                if (this.neededUpdate(currencyName, hash, addr)) {
                    this.timerUpdateTx(addr, currencyName, hash);
                }
            });
        } catch (err) {
            console.log('parseEthERC20TokenTransactionDetails------', err);
        }
    }

    /**
     * 解析btc交易详情
     */
    private async parseBtcTransactionDetails(addr: string) {
        try {
            const info = await BtcApi.getAddrTxHistory(addr);
            if (!info) return;
            if (info.txs) {
                const btcTxList = info.txs;
                const localTxList = fetchTransactionList(addr, 'BTC');
                const allTxHash = [];
                localTxList.forEach(item => {
                    allTxHash.push(item.hash);
                });
                btcTxList.forEach(item => {
                    if (allTxHash.indexOf(item.txid) < 0) {
                        allTxHash.push(item.txid);
                    }
                });
                allTxHash.forEach(hash => {
                    if (this.neededUpdate('BTC', hash, addr)) {
                        this.timerUpdateTx(addr, 'BTC', hash);
                    }
                });
            }
        } catch (err) {
            console.log('parseBtcTransactionDetails------', err);
        }
        
    }

    /**
     * 判断此hash交易是否需要更新
     */
    private neededUpdate(currencyName: string, hash: string, addr:string) {
        const txList = fetchTransactionList(addr, currencyName);
        for (const tx of txList) {
            // tslint:disable-next-line:possible-timing-attack
            if (tx.hash === hash && tx.currencyName === currencyName && tx.status === TxStatus.Success) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * 获取eth交易详情
     */
    private async getEthTransactionByHash(hash: string, addr: string) {
        if (!hash) return;
        const api = new EthApi();
        const res1: any = await api.getTransactionReceipt(hash);
        if (!res1) return;

        const res2: any = await api.getTransaction(hash);
        const blockHash = res1.blockHash;
        const res3: any = await api.getBlock(blockHash);
        const blockHeight = Number(await api.getBlockNumber());
        const confirmedBlockNumber = blockHeight - res1.blockNumber + 1;
        const pay = wei2Eth(res2.value);
        const needConfirmedBlockNumber = getConfirmBlockNumber('ETH', pay);
        // tslint:disable-next-line:max-line-length
        const status = parseInt(res1.status,16) === 1 ? confirmedBlockNumber >= needConfirmedBlockNumber ? TxStatus.Success : TxStatus.Confirmed : TxStatus.Failed;
        const gasPrice = new BigNumber(res2.gasPrice);
        const fee = wei2Eth(gasPrice.times(res1.gasUsed));
        const localTx = fetchLocalTxByHash(addr, 'BTC', hash);
        const record: TxHistory = {
            ...localTx,
            hash: hash,
            txType:addr.toLowerCase() === res1.from.toLowerCase() ? localTx ? localTx.txType : TxType.Transfer : TxType.Receipt,
            fromAddr: res1.from,
            toAddr: res1.to,
            pay,
            fee,
            time: res3.timestamp * 1000,
            info: parseTransferExtraInfo(res2.input),
            currencyName: 'ETH',
            status,
            confirmedBlockNumber,
            needConfirmedBlockNumber,
            nonce: res2.nonce,
            addr
        };
        updateLocalTx(record);
    }

    /**
     * 获取erc20交易详情
     */
    private async getERC20TransactionByHash(currencyName: string,hash: string,addr: string) {
        if (!hash) return;
        const api = new EthApi();
        const res1: any = await api.getTransactionReceipt(hash);
        if (!res1) return;
        const res2: any = await api.getTransaction(hash);
        const blockHash = res1.blockHash;
        const res3: any = await api.getBlock(blockHash);
        const blockHeight = Number(await api.getBlockNumber());
        const confirmedBlockNumber = blockHeight - res1.blockNumber + 1;
        const obj = this.parseErc20Input(res2.input);
        if (!obj) return;
        const pay = smallUnit2LargeUnit(currencyName, obj.pay);
        const toAddr = obj.toAddr;
        const needConfirmedBlockNumber = getConfirmBlockNumber(currencyName, pay);
        // tslint:disable-next-line:max-line-length
        const status = parseInt(res1.status,16) === 1 ? confirmedBlockNumber >= needConfirmedBlockNumber ? TxStatus.Success : TxStatus.Confirmed : TxStatus.Failed;
        const gasPrice = new BigNumber(res2.gasPrice);
        const fee = wei2Eth(gasPrice.times(res1.gasUsed));
        const localTx = fetchLocalTxByHash(addr, 'BTC', hash);
        const record: TxHistory = {
            ...localTx,
            hash: hash,
            txType: addr.toLowerCase() === res1.from.toLowerCase() ? localTx ? localTx.txType : TxType.Transfer : TxType.Receipt,
            fromAddr: res1.from,
            toAddr,
            pay,
            fee,
            time: res3.timestamp * 1000,
            info: '无',
            currencyName,
            status,
            confirmedBlockNumber,
            needConfirmedBlockNumber,
            nonce: res2.nonce,
            addr
        };
        updateLocalTx(record);
    }
    /**
     * 解析erc20 input
     */
    private parseErc20Input(input: string) {
        if (!input.startsWith('0xa9059cbb')) return;
        const toAddr = `0x${input.slice(34, 74)}`;
        const pay = Number(`0x${input.slice(74)}`);

        return {
            toAddr,
            pay
        };
    }

    /**
     * 过滤eth交易记录，过滤掉token的交易记录
     */
    private filterEthTrans(trans: any[]) {
        if (!trans)return [];
  
        return trans.filter(item => {
            if (item.to.length === 0) return false;
            if (item.input.indexOf(ethTokenTransferCode) === 0) return false;

            return true;
        });
    }

    /**
     * 解析btc交易详情记录
     */
    private parseBtcTransactionTxRecord(addr: string, tx: any) {
        if (!tx) return;

        const vin = tx.vin;
        let fromIndex = 0;
        for (let i = 0; i < vin.length; i++) {
            if (vin[i].addr === addr) {
                fromIndex = i;
                break;
            }
        }
        const fromAddr = vin[fromIndex].addr || '未知';

        const vout = tx.vout;
        let toIndex = 0;
        for (let i = 0; i < vout.length; i++) {
            if (fromAddr === addr) {
                if (vout[i].scriptPubKey.addresses) {
                    toIndex = i;
                    break;
                }
            } else {
                if (vout[i].scriptPubKey.addresses && vout[i].scriptPubKey.addresses[0] === addr) {
                    toIndex = i;
                    break;
                }
            }
        }

        const toAddr = vout[toIndex].scriptPubKey.addresses;
        const value = formatBalance(Number(vout[toIndex].value));

        const pay = value;
        const needConfirmedBlockNumber = getConfirmBlockNumber('BTC', pay);
        // tslint:disable-next-line:max-line-length
        const status = tx.confirmations > 0 ? tx.confirmations >= needConfirmedBlockNumber ? TxStatus.Success : TxStatus.Confirmed : TxStatus.Pending;
        const hash = tx.txid;
        const localTx = fetchLocalTxByHash(addr, 'BTC', hash);
        const record: TxHistory = {
            ...localTx,
            hash: tx.txid,
            addr: addr,
            txType:addr === fromAddr ? localTx ? localTx.txType : TxType.Transfer : TxType.Receipt,
            fromAddr,
            toAddr,
            pay,
            time: tx.time * 1000,
            status,
            confirmedBlockNumber: tx.confirmations,
            needConfirmedBlockNumber,
            info: '无',
            currencyName: 'BTC',
            fee: formatBalance(tx.fees),
            nonce: -1
        };
        updateLocalTx(record);
    }

    /**
     * 通过hash清楚定时器
     */
    private clearBalanceTimer(addr: string, currencyName: string) {
        let timerItem;
        for (let i = 0; i < this.balanceTimerList.length; i++) {
            if (this.balanceTimerList[i].addr === addr && this.balanceTimerList[i].currencyName === currencyName) {
                timerItem = this.balanceTimerList[i];
                clearTimeout(timerItem.timer);
                this.balanceTimerList.splice(i, 1);

                return;
            }
        }
    }

    /**
     * 获取余额更新间隔
     */
    private getBalanceUpdateDelay(addr: string, currencyName: string) {
        const second = 1000;
        const minute = second * 60;
        const txList = fetchTransactionList(addr, currencyName);
        const now = new Date().getTime();
        let delay = minute * 5; // 默认5分钟更新
        if (currencyName === 'BTC') {
            delay = minute * 30;
        }
        for (let i = 0; i < txList.length; i++) {
            if (txList[i].status === TxStatus.Pending && now - txList[i].time < minute * 10) {
                delay = second * 10;
                if (currencyName === 'BTC') {
                    delay = minute * 10;
                }
                break;
            }
        }

        return delay;
    }

    /**
     * 重置余额定时器列表
     */
    private resetBalanceTimerList(addr: string,currencyName: string,timer: any,delay: number) {
        let index = -1;
        for (let i = 0; i < this.balanceTimerList.length; i++) {
            if (this.balanceTimerList[i].addr === addr && this.balanceTimerList[i].currencyName === currencyName) {
                index = i;
                break;
            }
        }
        const timerObj = {
            addr,
            currencyName,
            timer,
            delay
        };
        if (index >= 0) {
            this.balanceTimerList.splice(index, 1, timerObj);
        } else {
            this.balanceTimerList.push(timerObj);
        }
    }

  /**
   * 设置余额
   */
    private setBalance(addr: string, currencyName: string, num: number) {
        const wallet = getStore('wallet');
        if (!wallet) return;
        for (const record of wallet.currencyRecords) {
            if (record.currencyName === currencyName) {
                for (const addrInfo of record.addrs) {
                    if (addrInfo.addr === addr && addrInfo.balance !== num) {
                        addrInfo.balance = num;
                        setStore('wallet/currencyRecords', wallet.currencyRecords);

                        return;
                    }
                }

            }
        }
    }

  // ===============================余额更新相关=======================================================

    /**
     * 添加已使用过的地址
     */
    private  addUserdAddrs(currencyName:string,addrs:AddrInfo[]) {
        const wallet = getStore('wallet');
        if (!wallet) return;
        const record = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        if (addrs.length > 0) {
            record.addrs.push(...addrs);
            addrs.forEach(addrInfo => {
                dataCenter.updateAddrInfo(addrInfo.addr, currencyName);
            });
        }
        record.updateAddr = true;
        setStore('wallet/currencyRecords',wallet.currencyRecords);
    }
    /**
     * 检查eth地址
     */
    private async checkEthAddr(secretHash:string) {
        const wallet = getStore('wallet');
        if (!wallet) return [];
        const mnemonic = getMnemonicByHash(secretHash);
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const cnt = await ethWallet.scanUsedAddress();
        const addrs: AddrInfo[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = ethWallet.selectAddress(i);
            const addr:AddrInfo =  {
                addr: address,                   
                balance: 0,                
                txHistory: [],          
                nonce: 0
            };
            addrs.push(addr);
        }
        this.addUserdAddrs('ETH',addrs);

        return addrs;
    }

    /**
     * 检查btc地址
     */
    private async checkBtcAddr(secretHash:string) {
        const wallet = getStore('wallet');
        if (!wallet) return [];
        const mnemonic = getMnemonicByHash(secretHash);
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        btcWallet.unlock();
        const cnt = await btcWallet.scanUsedAddress();

        const addrs: AddrInfo[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = btcWallet.derive(i);
            const addr:AddrInfo =  {
                addr: address,                   
                balance: 0,                
                txHistory: [],          
                nonce: 0
            };
            addrs.push(addr);
        }
        btcWallet.lock();
        this.addUserdAddrs('BTC',addrs);

        return addrs;
    }

    /**
     * 检查eth erc20 token地址
     */
    private async checkEthERC20TokenAddr(currencyName:string,secretHash:string) {
        const wallet = getStore('wallet');
        if (!wallet) return [];
        const mnemonic = getMnemonicByHash(secretHash);
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const cnt = await ethWallet.scanTokenUsedAddress(ERC20Tokens[currencyName].contractAddr);
        const addrs: AddrInfo[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = ethWallet.selectAddress(i);
            const addr:AddrInfo =  {
                addr: address,                   
                balance: 0,                
                txHistory: [],          
                nonce: 0
            };
            addrs.push(addr);
        }
        this.addUserdAddrs(currencyName,addrs);

        return addrs;
    }

    /**
     * 定时更新交易
     */
    private async timerUpdateTx(addr: string,currencyName: string,hash: string) {
        const tx = fetchLocalTxByHash(addr, currencyName, hash);
        const delay = this.calTxDelay(tx, currencyName);
        const status = tx && tx.status;
        if (status === TxStatus.Success) return tx;
        if (!delay) return;
        this.updateTxStatus(hash, currencyName, addr);
        this.clearTxTimer(hash);
        const timer = setTimeout(() => {
            this.timerUpdateTx(addr, currencyName, hash);
        }, delay);
        this.resetTxTimer(hash, timer);
        console.log('定时更新交易记录', {
            currencyName,
            hash,
            delay,
            timer,
            time: new Date().getTime()
        });
    }

    /**
     * 更新交易状态
     */
    private async updateTxStatus(hash: string,currencyName: string,addr: string) {
        if (currencyName === 'ETH') {
            this.getEthTransactionByHash(hash, addr);
        } else if (currencyName === 'BTC') {
            this.getBTCTransactionByHash(hash, addr);
        } else {
            this.getERC20TransactionByHash(currencyName, hash, addr);
        }
    }

    /**
     * 通过hash获取timer item
     */
    private fetchTxTimer(hash: string) {
        let timerItem;
        for (let i = 0; i < this.txTimerList.length; i++) {
            // tslint:disable-next-line:possible-timing-attack
            if (this.txTimerList[i].hash === hash) {
                timerItem = this.txTimerList[i];

                return timerItem;
            }
        }
    }

    /**
     * 修改timer
     */
    private resetTxTimer(hash: string | number, timer:number) {
        let index = -1;
        for (let i = 0; i < this.txTimerList.length; i++) {
            // tslint:disable-next-line:possible-timing-attack
            if (this.txTimerList[i].hash === hash) {
                index = i;
                break;
            }
        }
        const timerObj = {
            hash,
            timer
        };
        if (index >= 0) {
            this.txTimerList.splice(index, 1, timerObj);
        } else {
            this.txTimerList.push(timerObj);
        }
    }

    /**
     * 计算更新eth delay
     */
    private calTxDelay(tx: TxHistory, currencyName: string) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        if (!tx) {
            if (currencyName === 'BTC') {
                return minute * 10;
            } else {
                return second * 10;
            }
        }
        const curTime = new Date().getTime();
        const interval = curTime - tx.time;
        if (tx.status === TxStatus.Pending) {
            if (currencyName === 'BTC') {
                if (interval < hour * 4) {
                    // 4小时以内
                    return minute * 10;
                } else {
                    return minute *  30;
                }
            } else {
                if (interval < minute * 10) {
                    // 10分钟以内
                    return second * 10;
                } else {
                    // 超过7天
                    return minute * 5;
                }
            }
        } else if (tx.status === TxStatus.Confirmed) {
            if (currencyName === 'BTC') {
                return minute * 10;
            } else {
                return second * 10;
            }
        }
    }

    /**
     * 整点更新人民币美元汇率
     */
    private updateUSDRate() {
        const nextPoint = new Date();
        nextPoint.setHours(nextPoint.getHours() + 1);
        nextPoint.setMinutes(0);
        nextPoint.setSeconds(0);
        const delay = nextPoint.getTime() - new Date().getTime();
        fetchUSD2CNYRate().then((res: any) => {
            if (res.result === 'success') {
                const rate = Number(res.rates.CNY);
                setStore('third/rate', rate);
            }
        });
        setTimeout(() => {
            this.updateUSDRate();
        },delay);
    }

    /**
     * 整点更新黄金价格
     */
    private updateGoldPrice() {
        const nextPoint = new Date();
        nextPoint.setHours(nextPoint.getHours() + 1);
        nextPoint.setMinutes(0);
        nextPoint.setSeconds(0);
        const delay = nextPoint.getTime() - new Date().getTime();
        getSilverPrice();
        setTimeout(() => {
            this.updateGoldPrice();
        },delay);
    }

    /**
     * 整点更新货币对比USDT的比率
     */
    private updateCurrency2USDTRate() {
        const nextPoint = new Date();
        const seconds = nextPoint.getSeconds();
        const delaySeconds = seconds < 30 ? 30 - seconds : 60 - seconds;
        const delay = delaySeconds * 1000;

        const currencyList = [];
        for (const k in MainChainCoin) {
            currencyList.push(k);
        }
        for (const k in ERC20Tokens) {
            currencyList.push(k);
        }
        currencyList.forEach(currencyName => {
            fetchCurrency2USDTRate(currencyName)
        .then((res: any) => {
            // okey
            if (!res.error_code) {
                const currency2USDTMap = getStore('third/currency2USDTMap');
                const open = Number(res[0][1]);
                const close = Number(res[0][4]);
                currency2USDTMap.set(currencyName, {
                    open,
                    close
                });
                setStore('third/currency2USDTMap', currency2USDTMap);
            }
        })
        .catch(res => {
          // console.log('fetchCurrency2USDTRate err');
        });
        });
        setTimeout(() => {
            this.updateCurrency2USDTRate();
        },delay);
    }
}

// =====================================================

const estimateGasERC20 = (currencyName:string,toAddr:string,fromAddr:string,amount:number | string) => {
    const api = new EthApi();

    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(amount, currencyName));

    return api.estimateGas({ to: ERC20Tokens[currencyName].contractAddr,from:fromAddr, value:'0x0', data: transferCode });
};

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();
