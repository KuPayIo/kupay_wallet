import { ERC20Tokens, defaultEthToAddr } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet } from '../core/eth/wallet';
import { getShapeShiftCoins, getTransactionsByAddr, estimateGasERC20 } from '../net/pullWallet';
import { Addr, CurrencyRecord, TransRecordLocal, TxStatus, TxType } from '../store/interface';
import { find, getBorn, updateStore, register } from '../store/store';
import { btcNetwork, ethTokenTransferCode, lang } from '../utils/constants';
import { getAddrsAll, initAddr, getConfirmBlockNumber, formatBalance } from '../utils/tools';
import { ethTokenDivideDecimals, sat2Btc, wei2Eth, smallUnit2LargeUnit } from '../utils/unitTools';
import { fetchTransactionList, fetchLocalTxByHash, getMnemonicByHash } from '../utils/walletTools';
import { BigNumber } from '../res/js/bignumber';
/**
 * 创建事件处理器表
 * @example
 */
export class DataCenter {
    public timerRef: number = 0;
    public timerRef1: number = 0;
    public updateList: any[] = [];

    public currencyExchangeTimer: number;
    // 交易定时器列表
    private txTimerList = [];
    // 余额定时器列表
    private balanceTimerList = [];
    private checkAddrTimer;

    /**
     * 初始化
     */
    public init() {
        //获取shapeshift支持货币
        getShapeShiftCoins();
        this.exchangeRate('ETH');
        this.exchangeRate('BTC');
        this.refreshAllTx();
        this.initErc20GasLimit();
    }
    /**
     * 刷新本地钱包
     */
    public refreshAllTx() {
        // 从缓存中获取地址进行初始化
        const addrs = find('addrs') || [];
        if (addrs) {
            const wallet = find('curWallet');
            if (!wallet) return;
            let list = [];
            wallet.currencyRecords.forEach(v => {
                if (wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                    list = list.concat(v.addrs);
                }
            });
            addrs.forEach(v => {
                if (list.indexOf(v.addr) >= 0 && wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                    this.updateAddrInfo(v.addr, v.currencyName);
                }
            });
        }
    }

    /**
     * 更新地址相关 交易记录及余额定时更新
     */
    public updateAddrInfo(addr: string, currencyName: string) {
        this.parseTransactionDetails(addr,currencyName); //更新交易记录
        this.timerUpdateBalance(addr,currencyName); //定时更新余额
    }

    public initErc20GasLimit(){
        const wallet = find('curWallet');
        if (!wallet) return;
        wallet.showCurrencys.forEach(currencyName=>{
            if(ERC20Tokens[currencyName]){
                this.fetchErc20GasLimit(currencyName);
            }
        });
    }
    public fetchErc20GasLimit(currencyName){
        const defaultPay = 100;
        estimateGasERC20(currencyName,defaultEthToAddr,defaultPay).then(res=>{
            const gasLimitMap = getBorn('gasLimitMap');
            gasLimitMap.set(currencyName,res * 2);
            updateStore('gasLimitMap',gasLimitMap);
        });
    }
    
    // 获取币币交易交易记录
    public fetchCurrencyExchangeTx() {
        const wallet = find('curWallet');
        if (!wallet) return;
        const curAllAddrs = getAddrsAll(wallet);
        curAllAddrs.forEach(item => {
            getTransactionsByAddr(item);
        });

    }

    /****************************************************************************************************
     * 私有函数
     ******************************************************************************************/
 

    // 币币交易记录定时器
    private currencyExchangeTimerStart() {
        this.fetchCurrencyExchangeTx();
        this.currencyExchangeTimer = setTimeout(() => {
            this.currencyExchangeTimerStart();
        }, 30 * 1000);
    }

    private timerCheckAddr(needCheckAddr: CurrencyRecord[]){
        const record: CurrencyRecord = needCheckAddr.shift();
        if(!record){
            return;
        };
        console.log('checkAddr', record.currencyName);
        if (record.currencyName === 'ETH') {
            this.checkEthAddr(record).then(addAddrs=>{
                if (addAddrs.length > 0) {
                    let addrs = find('addrs');
                    addrs = addrs.concat(addAddrs);
                    updateStore('addrs', addrs);
                    addAddrs.forEach(item=>{
                        this.timerUpdateBalance(item.addr,'ETH');
                    });
                }
                const wallet = find('curWallet');
                wallet.currencyRecords = wallet.currencyRecords.map(item=>{
                    if(item.currencyName === record.currencyName){
                        item.updateAddr = true;
                        addAddrs.forEach(addrInfo=>{
                            item.addrs.push(addrInfo.addr);
                        });
                        
                    }
                    return item;
                });
                updateStore('curWallet',wallet);
            });
        } else if (record.currencyName === 'BTC') {
            this.checkBtcAddr(record).then(addAddrs=>{
                if (addAddrs.length > 0) {
                    let addrs = find('addrs');
                    addrs = addrs.concat(addAddrs);
                    updateStore('addrs', addrs);
                    addAddrs.forEach(item=>{
                        this.timerUpdateBalance(item.addr,'ETH');
                    });
                }
                const wallet = find('curWallet');
                wallet.currencyRecords = wallet.currencyRecords.map(item=>{
                    if(item.currencyName === record.currencyName){
                        item.updateAddr = true;
                        addAddrs.forEach(addrInfo=>{
                            item.addrs.push(addrInfo.addr);
                        });
                    }
                    return item;
                });
                updateStore('curWallet',wallet);
            });;
        } else if (ERC20Tokens[record.currencyName]) {
            this.checkEthERC20TokenAddr(record).then(addAddrs=>{
                if (addAddrs.length > 0) {
                    let addrs = find('addrs');
                    addrs = addrs.concat(addAddrs);
                    updateStore('addrs', addrs);
                    addAddrs.forEach(item=>{
                        this.timerUpdateBalance(item.addr,'ETH');
                    });
                }
                const wallet = find('curWallet');
                wallet.currencyRecords = wallet.currencyRecords.map(item=>{
                    if(item.currencyName === record.currencyName){
                        item.updateAddr = true;
                        addAddrs.forEach(addrInfo=>{
                            item.addrs.push(addrInfo.addr);
                        });
                    }
                    return item;
                });
                updateStore('curWallet',wallet);
            });;
        } 
        this.checkAddrTimer = setTimeout(() => {
            this.timerCheckAddr(needCheckAddr);
        }, 1000);
    }
    //检查地址
    public async checkAddr(){
        const wallet = find('curWallet');
        if(!wallet) return;
        if (getBorn('hashMap').get(wallet.walletId)) {
            const currencyRecord: CurrencyRecord[] = wallet.currencyRecords;
            const needCheckAddr = [];
            currencyRecord.forEach(item=>{
                if(!item.updateAddr){
                    needCheckAddr.push(item);
                }
            });
            this.timerCheckAddr(needCheckAddr);
        }
    }

    /**
     * 解析交易详情
     */
    private async parseTransactionDetails(addr: string, currencyName: string) {
        switch (currencyName) {
            case 'ETH': this.parseEthTransactionDetails(addr); break;
            case 'BTC': this.parseBtcTransactionDetails(addr); break;
            default:
        }
        if (ERC20Tokens[currencyName]) {
            this.parseEthERC20TokenTransactionDetails(addr, currencyName);

            return;
        }
    }

    // 解析eth交易详情
    private async parseEthTransactionDetails(addr: string) {
        const api = new EthApi();
        const r: any = await api.getAllTransactionsOf(addr);
        const ethTrans = this.filterEthTrans(r.result);
        const localTxList = fetchTransactionList(addr,'ETH');
        const allTxHash = [];
        localTxList.forEach(item=>{
            allTxHash.push(item.hash);
        });
        ethTrans.forEach(item=>{
            if(allTxHash.indexOf(item.hash) < 0){
                allTxHash.push(item.hash);
            }
        });
        // console.log(`${addr} eth all tx`,allTxHash);
        allTxHash.forEach(hash => {
            if(this.neededUpdate('ETH',hash,addr)){
                this.timerUpdateTx(addr,'ETH',hash);
            };
        });
    }
    // 解析erc20交易详情
    private async parseEthERC20TokenTransactionDetails(addr: string, currencyName: string) {
        const api = new EthApi();
        const contractAddress = ERC20Tokens[currencyName].contractAddr;
        try {
            const res = await api.getTokenTransferEvents(contractAddress, addr);
            const erc20Tx = res.result;
            const localTxList = fetchTransactionList(addr,currencyName);
            const allTxHash = [];
            localTxList.forEach(item=>{
                allTxHash.push(item.hash);
            });
            erc20Tx.forEach(item=>{
                if(allTxHash.indexOf(item.hash) < 0){
                    allTxHash.push(item.hash);
                }
            });
            // console.log(`${addr} ${currencyName} all tx`,allTxHash);
            allTxHash.forEach(hash => {
                if(this.neededUpdate(currencyName,hash,addr)){
                    this.timerUpdateTx(addr,currencyName,hash);
                }
            });
        } catch (err) {
            console.log('parseEthERC20TokenTransactionDetails------',err);
        }
        
    }

    
    // 解析btc交易详情
    private async parseBtcTransactionDetails(addr: string) {
        const info = await BtcApi.getAddrTxHistory(addr);
        if (!info) return;
        if (info.txs) {
            const btcTxList = info.txs;
            const localTxList = fetchTransactionList(addr,'BTC');
            const allTxHash = [];
            localTxList.forEach(item=>{
                allTxHash.push(item.hash);
            });
            btcTxList.forEach(item=>{
                if(allTxHash.indexOf(item.txid) < 0){
                    allTxHash.push(item.txid);
                }
            });
            // console.log(`${addr} btc all tx`,allTxHash);
            allTxHash.forEach(hash => {
                if(this.neededUpdate('BTC',hash,addr)){
                    this.timerUpdateTx(addr,'BTC',hash);
                };
                
            });
        }
    }

    private neededUpdate(currencyName:string,hash:string,addr){
        const txList = fetchTransactionList(addr,currencyName);
        for(let i= 0;i<txList.length;i++){
            if(txList[i].hash === hash && txList[i].currencyName === currencyName && txList[i].status === TxStatus.SUCCESS){
                return false;
            }
        }
        return true;
    }

    //更新本地交易记录
    private updateTransactionLocalStorage(tx:TransRecordLocal){
        const trans = find('transactions') || [];
        let index = -1;
        for(let i = 0; i < trans.length;i++){
            if(trans[i].hash === tx.hash && trans[i].currencyName === tx.currencyName){
                index = i;
                break;
            }
        }
        if(index >=0 ){
            trans.splice(index,1,tx);
        }else{
            trans.push(tx);
        }
        
        updateStore('transactions',trans);
    }

    //获取eth交易详情
    private async getEthTransactionByHash(hash:string,addr:string){
        if(!hash) return;
        const api = new EthApi();
        const res1:any = await api.getTransactionReceipt(hash);
        if(!res1) return;
        
        const res2:any = await api.getTransaction(hash);
        const blockHash = res1.blockHash;
        const res3:any = await api.getBlock(blockHash);
        const blockHeight = Number(await api.getBlockNumber());
        const confirmedBlockNumber = blockHeight - res1.blockNumber + 1;
        const pay = wei2Eth(res2.value);
        const needConfirmedBlockNumber = getConfirmBlockNumber('ETH',pay);
        const status = parseInt(res1.status) === 1 ? (confirmedBlockNumber >= needConfirmedBlockNumber ? TxStatus.SUCCESS : TxStatus.CONFIRMED) : TxStatus.FAILED;
        const gasPrice = new BigNumber(res2.gasPrice);
        const fee = wei2Eth(gasPrice.times(res1.gasUsed)); 
        const localTx = fetchLocalTxByHash(addr,'BTC',hash);
        const record:TransRecordLocal = {
            ...localTx,
            hash: hash,
            txType:addr.toLowerCase() === res1.from.toLowerCase() ? (localTx ? localTx.txType : TxType.TRANSFER) : TxType.RECEIPT,
            fromAddr: res1.from,
            toAddr: res1.to,
            pay,
            fee,
            time: res3.timestamp * 1000,
            info: res2.input,
            currencyName: 'ETH',
            status,
            confirmedBlockNumber,
            needConfirmedBlockNumber,
            nonce:res2.nonce,
            addr
        };
        this.updateTransactionLocalStorage(record);
    }


    //获取erc20交易详情
    private async getERC20TransactionByHash(currencyName:string,hash:string,addr:string){
        if(!hash) return;
        const api = new EthApi();
        const res1:any = await api.getTransactionReceipt(hash);
        if(!res1) return;
        const res2:any = await api.getTransaction(hash);
        const blockHash = res1.blockHash;
        const res3:any = await api.getBlock(blockHash);
        const blockHeight = Number(await api.getBlockNumber());
        const confirmedBlockNumber = blockHeight - res1.blockNumber + 1;
        const obj = this.parseErc20Input(res2.input);
        const pay = smallUnit2LargeUnit(currencyName,obj.pay);
        const toAddr = obj.toAddr;
        const needConfirmedBlockNumber = getConfirmBlockNumber(currencyName,pay);
        const status = parseInt(res1.status) === 1 ? (confirmedBlockNumber >= needConfirmedBlockNumber ? TxStatus.SUCCESS : TxStatus.CONFIRMED) : TxStatus.FAILED;
        const gasPrice = new BigNumber(res2.gasPrice);
        const fee = wei2Eth(gasPrice.times(res1.gasUsed));
        const localTx = fetchLocalTxByHash(addr,'BTC',hash);
        const record:TransRecordLocal = {
            ...localTx,
            hash: hash,
            txType:addr.toLowerCase() === res1.from.toLowerCase() ? (localTx ? localTx.txType : TxType.TRANSFER) : TxType.RECEIPT,
            fromAddr: res1.from,
            toAddr,
            pay,
            fee,
            time: res3.timestamp * 1000,
            info: '',
            currencyName,
            status,
            confirmedBlockNumber,
            needConfirmedBlockNumber,
            nonce:res2.nonce,
            addr
        };
        this.updateTransactionLocalStorage(record);
    }

    // 获取btc交易详情
    public async getBTCTransactionByHash(hash:string,addr:string){
        if(!hash) return;
        const v = await BtcApi.getTxInfo(hash);
        this.parseBtcTransactionTxRecord(addr, v);
    }

    //解析erc20 input
    private parseErc20Input(input:string){
        const toAddr = `0x${input.slice(34,74)}`;
        const pay = Number(`0x${input.slice(74)}`);
        return {
            toAddr,
            pay
        }
    }

    // 过滤eth交易记录，过滤掉token的交易记录
    private filterEthTrans(trans: any[]) {
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
        if(!tx) return;
        const vin = tx.vin;
        let fromIndex = 0;
        for(let i = 0;i< vin.length;i++){
            if(vin[i].addr === addr){
                fromIndex = i;
                break;
            }
        }

        const vout = tx.vout;
        let toIndex = 0;
        for(let i = 0;i< vout.length;i++){
            if(vout[i].scriptPubKey.addresses &&  vout[i].scriptPubKey.addresses[0] === addr){
                toIndex = i;
                break;
            }
        }
        const fromAddr = vin[fromIndex].addr || '未知';
        const toAddr = vout[toIndex].scriptPubKey.addresses;
        const value = formatBalance(Number(vout[toIndex].value));


        const pay = value;
        const needConfirmedBlockNumber = getConfirmBlockNumber('BTC',pay); 
        const status = tx.confirmations > 0 ? (tx.confirmations >= needConfirmedBlockNumber ? TxStatus.SUCCESS : TxStatus.CONFIRMED) : TxStatus.PENDING;
        const hash = tx.txid;
        const localTx = fetchLocalTxByHash(addr,'BTC',hash);
        const record:TransRecordLocal = {
            ...localTx,
            hash: tx.txid,
            addr: addr,
            txType:addr === fromAddr ? (localTx ? localTx.txType : TxType.TRANSFER) : TxType.RECEIPT,
            fromAddr,
            toAddr,
            pay,
            time: tx.time * 1000,
            status,
            confirmedBlockNumber:tx.confirmations,
            needConfirmedBlockNumber,
            info:"",
            currencyName: 'BTC',
            fee: tx.fees,
            nonce:-1,
        }
        this.updateTransactionLocalStorage(record);
    }


// ===============================余额更新相关=======================================================
    //定时器更新余额
    public timerUpdateBalance(addr:string,currencyName:string){
        this.updateBalance(addr,currencyName);
        const delay = this.getBalanceUpdateDelay(addr,currencyName);
        this.clearBalanceTimer(addr,currencyName);
        const timer = setTimeout(()=>{
            this.timerUpdateBalance(addr,currencyName);
        },delay);
        this.resetBalanceTimerList(addr,currencyName,timer,delay);
        console.log('定时更新余额',{
            delay,
            addr,
            currencyName,
            time:new Date().getTime(),
            timer
        });
    }

    //通过hash清楚定时器
    private clearBalanceTimer(addr:string,currencyName:string){
        let timerItem;
        for(let i = 0;i< this.balanceTimerList.length;i++){
            if(this.balanceTimerList[i].addr === addr && this.balanceTimerList[i].currencyName === currencyName){
                timerItem = this.balanceTimerList[i];
                clearTimeout(timerItem.timer);
                this.balanceTimerList.splice(i,1)
                return;
            }
        }
    }

    //获取余额更新间隔
    private getBalanceUpdateDelay(addr:string,currencyName:string){
        const second = 1000;
        const minute = 60 * second;
        // const minute = 1 * second;
        const txList = fetchTransactionList(addr,currencyName);
        const now = new Date().getTime();
        let delay = 5 * minute;//默认5分钟更新
        if(currencyName === 'BTC'){
            delay = 30 * minute;
        }
        for(let i = 0;i< txList.length;i++){
            if(txList[i].status === TxStatus.PENDING && now - txList[i].time < 10 * minute){
                delay = 10 * second;
                if(currencyName === 'BTC'){
                    delay = 10 * minute;
                }
                break;
            }
        }
        return delay;
    }
    /**
     * 更新余额
     */
    private updateBalance(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            const balanceOfCode = EthWallet.tokenOperations('balanceof', currencyName, addr);
            const api = new EthApi();
            api.ethCall(ERC20Tokens[currencyName].contractAddr, balanceOfCode).then(r => {
                const num = ethTokenDivideDecimals(Number(r), currencyName);
                this.setBalance(addr, currencyName, num);
            });
        }
        switch (currencyName) {
            case 'ETH':
                const api = new EthApi();
                api.getBalance(addr).then(r => {
                    const num = wei2Eth(r.result);
                    this.setBalance(addr, currencyName, num);
                });
                break;
            case 'BTC':
                BtcApi.getBalance(addr).then(r => {
                    this.setBalance(addr, currencyName, sat2Btc(r));
                });
                break;
            default:
        }
    }
    //重置余额定时器列表
    private resetBalanceTimerList(addr:string,currencyName:string,timer:any,delay:number){
        let index = -1;
        for(let i = 0;i< this.balanceTimerList.length;i++){
            if(this.balanceTimerList[i].addr === addr && this.balanceTimerList[i].currencyName === currencyName){
                index = i;
                break;
            }
        }
        const timerObj ={
            addr,
            currencyName,
            timer,
            delay
        }
        if(index >= 0){
            this.balanceTimerList.splice(index,1,timerObj);
        }else{
            this.balanceTimerList.push(timerObj);
        }
        
    }

    /**
     * 设置余额
     */
    private setBalance(addr: string, currencyName: string, num: number) {
        let addrs = find('addrs') || [];

        let isUpdate = false;
        addrs = addrs.map(v => {
            if (v.addr === addr && v.currencyName === currencyName && v.balance !== num) {
                v.balance = num;
                isUpdate = true;
            }

            return v;
        });

        if (isUpdate) {
            updateStore('addrs', addrs);
        }
    }

// ===============================余额更新相关=======================================================


    // 汇率获取更新
    private async exchangeRate(currencyName: string) {
        switch (currencyName) {
            case 'ETH':
                const ethApi: EthApi = new EthApi();
                const ethRate = await ethApi.getExchangeRate();
                updateStore('exchangeRateJson', getBorn('exchangeRateJson').set('ETH', ethRate));
                break;
            case 'BTC':
                const btcRate = await BtcApi.getExchangeRate();
                updateStore('exchangeRateJson', getBorn('exchangeRateJson').set('BTC', btcRate));
                break;
            default:
        }

    }

    /**
     * 检查eth地址
     */
    private async checkEthAddr(currencyRecord: CurrencyRecord) {
        const mnemonic = getMnemonicByHash(getBorn('hashMap').get(find('curWallet').walletId));
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const cnt = await ethWallet.scanUsedAddress();
        const addrs: Addr[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = ethWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            addrs.push(initAddr(address, 'ETH'));
        }

        return addrs;
    }

    /**
     * 检查btc地址
     */
    private async checkBtcAddr(currencyRecord: CurrencyRecord) {
        const mnemonic = getMnemonicByHash(getBorn('hashMap').get(find('curWallet').walletId));
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        btcWallet.unlock();
        const cnt = await btcWallet.scanUsedAddress();

        const addrs: Addr[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = btcWallet.derive(i);
            currencyRecord.addrs.push(address);
            addrs.push(initAddr(address, 'BTC'));
        }
        btcWallet.lock();

        return addrs;
    }

    /**
     * 检查eth erc20 token地址
     */
    private async checkEthERC20TokenAddr(currencyRecord: CurrencyRecord) {
        const mnemonic = getMnemonicByHash(getBorn('hashMap').get(find('curWallet').walletId));
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const cnt = await ethWallet.scanTokenUsedAddress(ERC20Tokens[currencyRecord.currencyName].contractAddr);
        const addrs: Addr[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = ethWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            addrs.push(initAddr(address, currencyRecord.currencyName));
        }

        return addrs;
    }

    //定时更新交易
    private async timerUpdateTx(addr:string,currencyName:string,hash:string){
        const tx = fetchLocalTxByHash(addr,currencyName,hash);
        const delay = this.calTxDelay(tx,currencyName);
        const status = tx && tx.status;
        if(status === TxStatus.SUCCESS) return tx;
        if(!delay) return;
        this.updateTxStatus(hash,currencyName,addr);
        const timer = setTimeout(()=>{
            this.timerUpdateTx(addr,currencyName,hash);
        },delay);
        this.resetTxTimer(hash,timer);
        console.log('定时更新交易记录',{
            currencyName,
            hash,
            delay,
            timer,
            time:new Date().getTime()
        });
    }

    // 更新交易状态
    private async updateTxStatus(hash:string,currencyName:string,addr:string){
        if(currencyName === 'ETH'){
            this.getEthTransactionByHash(hash,addr);
        }else if(currencyName === 'BTC'){
            this.getBTCTransactionByHash(hash,addr);
        }else{
           this.getERC20TransactionByHash(currencyName,hash,addr);
        }
    }

    //定时更新交易
    public async timerUpdateTxWithdraw(tx:TransRecordLocal){
        const addr = tx.addr;
        const currencyName = tx.currencyName;
        const hash = tx.hash;
        const newTx = fetchLocalTxByHash(addr,currencyName,hash);
        const delay = this.calTxDelay(tx,tx.currencyName);
        const status = tx.status;
        if(status === TxStatus.SUCCESS) return;
        this.updateTxStatus(tx && tx.hash,currencyName,addr);
        if(!delay) return;
        const timer = setTimeout(()=>{
            this.timerUpdateTxWithdraw(newTx || tx);
        },delay);
        this.resetTxTimer(tx.hash,timer);
    }


    //通过hash获取timer item
    private fetchTxTimer(hash:string){
        let timerItem;
        for(let i = 0;i< this.txTimerList.length;i++){
            if(this.txTimerList[i].hash === hash){
                timerItem = this.txTimerList[i];
                return timerItem;
            }
        }
    }

    //通过hash清楚定时器
    public clearTxTimer(hash:string){
        let timerItem;
        for(let i = 0;i< this.txTimerList.length;i++){
            if(this.txTimerList[i].hash === hash){
                timerItem = this.txTimerList[i];
                clearTimeout(timerItem.timer);
                this.txTimerList.splice(i,1)
                return;
            }
        }
    }

    //修改timer
    private resetTxTimer(hash:string | number,timer){
        let index = -1;
        for(let i = 0;i< this.txTimerList.length;i++){
            if(this.txTimerList[i].hash === hash){
                index = i;
                break;
            }
        }
        const timerObj ={
            hash,
            timer
        }
        if(index >=0){
            this.txTimerList.splice(index,1,timerObj);
        }else{
            this.txTimerList.push(timerObj);
        }
        
    }

    // 计算更新eth delay
    private calTxDelay(tx:TransRecordLocal,currencyName:string){
        const second = 1000;
        const minute = 60 * second;
        // const minute = 1 * second;
        const hour = 60 * minute;
        if(!tx){
            if(currencyName === 'BTC'){
                return 10 * minute;
            }else{
                return 10 * second;
            }
        }
        const curTime = new Date().getTime();
        const interval = curTime - tx.time;
        if(tx.status === TxStatus.PENDING){
            if(currencyName === 'BTC'){
                if( interval < 4 * hour){//4小时以内
                    return 10 * minute; 
                }else{
                    return 30 * minute;
                }
            }else{
                if( interval < 10 * minute){//10分钟以内
                    return 10 * second; 
                }else{//超过7天
                    return 5 * minute;
                }
            }
        }else if(tx.status === TxStatus.CONFIRMED){
            if(currencyName === 'BTC'){
                return 10 * minute; 
            }else{
                return 10 * second; 
            }
        }
    }
}

//==========================三方接口=======================================
//http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4 测试
//http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=37223&sign=7987216e841c32aa08d0ea0dcbf65eed
// 获取美元对人民币汇率
export const fetchUSD2CNYRate = ()=>{
    fetch('http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=37223&sign=7987216e841c32aa08d0ea0dcbf65eed',{
        mode: 'no-cors',
        headers:{
            'Content-Type': 'application/json'
        },
    })
    .then(res=>{
        return res.json()
    })
    .then(function(res) {
      console.log('汇率',res);
    });
}
//======================================================================

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();

//检查地址
register('hashMap',()=>{
    setTimeout(()=>{
        dataCenter.checkAddr();
    },200);
});