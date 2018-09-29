import { ERC20Tokens } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet } from '../core/eth/wallet';
import { getShapeShiftCoins, getTransactionsByAddr } from '../net/pullWallet';
import { Addr, CurrencyRecord, Wallet, TransRecordLocal, TxStatus, TxType } from '../store/interface';
import { find, getBorn, updateStore } from '../store/store';
import { btcNetwork, ethTokenTransferCode, lang } from '../utils/constants';
import { getAddrsAll, getAddrsByCurrencyName, initAddr, getConfirmBlockNumber } from '../utils/tools';
import { ethTokenDivideDecimals, sat2Btc, wei2Eth, smallUnit2LargeUnit } from '../utils/unitTools';
import { getMnemonic, fetchTransactionList, fetchLocalTxByHash } from '../utils/walletTools';
import { BigNumber } from '../res/js/bignumber';
/**
 * 创建事件处理器表
 * @example
 */
export class DataCenter {
    public timerRef: number = 0;
    public timerRef1: number = 0;
    public updateFastList: any[] = [];
    public updateList: any[] = [];

    public currencyExchangeTimer: number;
    // 交易定时器列表
    private txTimerList = [];
    // 余额定时器列表
    private balanceTimerList = [];

    /**
     * 初始化
     */
    public init() {
        //获取shapeshift支持货币
        getShapeShiftCoins();
        this.exchangeRate('ETH');
        this.exchangeRate('BTC');
        this.timerUpdateBalance();//更新余额
        this.refreshAllTx();
        // f7a398978d4f9153f9ec7736cbdf7753ed096e230250ae08a4aa1ccea16878e3
        // BtcApi.getAddrTxHistory('miXYqeEJWkf52UyifMYozkCaDYmSVymQTb').then(res=>{
        //     console.error('getAddrTxHistory!!!!!!!!!',res);
        // });
        // this.parseBtcTransactionDetails('miXYqeEJWkf52UyifMYozkCaDYmSVymQTb');
        // const api = new EthApi();
        // api.getTransactionReceipt("0xa5663410fc3322bc1acfd33510e4f6f06cb10092fdb096a779f21d1d2a1199e1").then(console.log);
        // api.getTransaction("0xa5663410fc3322bc1acfd33510e4f6f06cb10092fdb096a779f21d1d2a1199e1").then(console.log);
        this.updateFastList.push(['shapeShiftCoins']);
        this.updateFastList.push(['exchangeRate', 'ETH']);
        this.updateFastList.push(['exchangeRate', 'BTC']);
        // 启动定时器更新
        // if (!this.timerRef) this.openAddrTxCheck();
        // if (!this.timerRef1) this.openCheck();
        
        // if (!this.currencyExchangeTimer) this.currencyExchangeTimerStart();
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

    // 根据地址刷新交易记录
    public async refreshTrans(addr:string,currencyName:string){
        const txList = fetchTransactionList(addr,currencyName);
        for(let i = 0;i < txList.length;i++){
            const timerItem = this.fetchTimerItem(txList[i].hash);
            if(timerItem) continue;
            this.timerUpdateTx(addr,currencyName,txList[i].hash);
        }
    }


    /**
     * 更新地址相关
     */
    public updateAddrInfo(addr: string, currencyName: string) {
        this.updateBalance(addr,currencyName); //更新余额
        this.parseTransactionDetails(addr,currencyName); //更新交易记录
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
 

    // 普通检测
    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 5 * 1000);
        if (this.updateFastList.length > 0) return;
        if (this.updateList.length > 0) {
            // todo doupdate
            return;
        }

        // 检查地址--放于最后一步
        // this.checkAddr();
    }

    // 币币交易记录定时器
    private currencyExchangeTimerStart() {
        this.fetchCurrencyExchangeTx();
        this.currencyExchangeTimer = setTimeout(() => {
            this.currencyExchangeTimerStart();
        }, 30 * 1000);
    }

    //检查地址
    private async checkAddr() {
        const walletList = find('walletList');
        if (!walletList || walletList.length <= 0) return;
        const list = [];
        walletList.forEach((v, i) => {
            if (getBorn('hashMap').get(v.walletId)) {
                v.currencyRecords.forEach((v1, i1) => {
                    if (!v1.updateAddr) list.push([i, i1]);
                });
            }
        });

        if (list[0]) {
            let addrs = find('addrs') || [];
            const wallet = walletList[list[0][0]];
            const currencyRecord: CurrencyRecord = wallet.currencyRecords[list[0][1]];
            console.log('checkAddr', currencyRecord.currencyName);
            let addAddrs;
            if (currencyRecord.currencyName === 'ETH') {
                addAddrs = await this.checkEthAddr(wallet, currencyRecord);
            } else if (currencyRecord.currencyName === 'BTC') {
                addAddrs = await this.checkBtcAddr(wallet, currencyRecord);
            } else if (ERC20Tokens[currencyRecord.currencyName]) {
                addAddrs = await this.checkEthERC20TokenAddr(wallet, currencyRecord);
            }
            if (addAddrs.length > 0) {
                addrs = addrs.concat(addAddrs);
                updateStore('addrs', addrs);
            }
            currencyRecord.updateAddr = true;
            updateStore('walletList', walletList);
        }
    }

    /**
     * 解析交易详情
     */
    private async parseTransactionDetails(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            this.parseEthERC20TokenTransactionDetails(addr, currencyName);

            return;
        }
        switch (currencyName) {
            case 'ETH': this.parseEthTransactionDetails(addr); break;
            case 'BTC': this.parseBtcTransactionDetails(addr); break;
            default:
        }

    }

    // 解析erc20交易详情
    private async parseEthERC20TokenTransactionDetails(addr: string, currencyName: string) {
        const api = new EthApi();
        const contractAddress = ERC20Tokens[currencyName].contractAddr;
        try {
            const res = await api.getTokenTransferEvents(contractAddress, addr);
            res.result.forEach(v => {
                if(this.neededUpdate(currencyName,v.hash,addr)){
                    this.getERC20TransactionByHash(currencyName,v.hash,addr);
                }
                
            });
        } catch (err) {
            console.log('parseEthERC20TokenTransactionDetails------',err);
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
    // 解析eth交易详情
    private async parseEthTransactionDetails(addr: string) {
        const api = new EthApi();
        const r: any = await api.getAllTransactionsOf(addr);
        const ethTrans = this.filterEthTrans(r.result);
        for(let i = 0;i < ethTrans.length;i++){
            const hash = ethTrans[i].hash;
            if(this.neededUpdate('ETH',hash,addr)){
                this.getEthTransactionByHash(hash,addr);
            };
            
        }
    }
    // 解析btc交易详情
    private async parseBtcTransactionDetails(addr: string) {
        const info = await BtcApi.getAddrTxHistory(addr);
        if (!info) return;
        if (info.txs) {
            info.txs.forEach(v => {
                const hash = v.txid;
                if(this.neededUpdate('BTC',hash,addr)){
                    this.getBTCTransactionByHash(hash, addr);
                };
                
            });
        }
    }


    //更新本地交易记录
    private updateTransactionLocalStorage(tx:TransRecordLocal){
        const trans = find('transactions') || [];
        let index = -1;
        for(let i = 0; i < trans.length;i++){
            if(trans[i].hash === tx.hash){
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
        console.log('定时更新交易记录',{
            tx:record,
            time:new Date().getTime()
        });
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
        console.log('定时更新交易记录',{
            tx:record,
            time:new Date().getTime()
        });
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
        let value = 0;
        const inputs = tx.vin.map(v => {
            return v.addr ;
        });
        const outputs = tx.vout.map(v => {
            if (!value) {
                if (inputs.indexOf(addr) >= 0) {
                    value = parseFloat(v.value);
                } else if (addr === v.scriptPubKey.addresses[0]) {
                    value = parseFloat(v.value);
                }
            }

            return v.scriptPubKey.addresses[0];
        });

        let fromAddr;
        let toAddr;
        if (inputs && inputs.indexOf(addr) >= 0) {
            fromAddr = addr;
            toAddr = outputs[0];
        } else {
            fromAddr = inputs[0];
            toAddr = addr;
        }

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
        console.log('定时更新交易',{tx:record,time:new Date().getTime()});
    }

    //定时器更新余额
    private timerUpdateBalance(){
        this.balanceTimerList.forEach(item=>{
            clearTimeout(item.timer);
        });
        const wallet = find('curWallet');
        if(!wallet) return;
        const showCurrencys = wallet.showCurrencys;
        
        showCurrencys.forEach(currencyName=>{
            const addrs1 = getAddrsByCurrencyName(wallet,currencyName);
            addrs1.forEach(addr=>{
                this.updateBalance(addr,currencyName);
            });
        });
    }

    //获取余额更新间隔
    private getBalanceUpdateDelay(addr:string,currencyName:string){
        const second = 1000;
        const minute = 60 * second;
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
                    delay = 10 *minute;
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
        const timerItem = this.fetchBalanceTimer(addr,currencyName);
        if(timerItem){
            clearTimeout(timerItem.timer);
        }
        if (ERC20Tokens[currencyName]) {
            const balanceOfCode = EthWallet.tokenOperations('balanceof', currencyName, addr);
            // console.log('balanceOfCode',balanceOfCode);
            const api = new EthApi();
            api.ethCall(ERC20Tokens[currencyName].contractAddr, balanceOfCode).then(r => {
                // tslint:disable-next-line:radix
                const num = ethTokenDivideDecimals(Number(r), currencyName);
                // console.log(currencyName,num);
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
        const delay = this.getBalanceUpdateDelay(addr,currencyName);
        const timer = setTimeout(()=>{
            console.log('定时更新余额',{
                delay,
                addr,
                currencyName,
                time:new Date().getTime()
            });
            this.updateBalance(addr,currencyName);
        },delay);
        this.resetBalanceTimerList(addr,currencyName,timer);
    }
    //重置余额定时器列表
    private resetBalanceTimerList(addr:string,currencyName:string,timer:any){
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
            timer
        }
        if(index >= 0){
            this.balanceTimerList.splice(index,1,timerObj);
        }else{
            this.balanceTimerList.push(timerObj);
        }
        
    }

    private fetchBalanceTimer(addr:string,currencyName:string){
        for(let i = 0;i<this.balanceTimerList.length;i++){
            if(this.balanceTimerList[i].addr === addr && this.balanceTimerList[i].currencyName === currencyName){
                return this.balanceTimerList[i];
            }
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
    private async checkEthAddr(wallet: Wallet, currencyRecord: CurrencyRecord) {
        const mnemonic = await getMnemonic(wallet, '');
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
    private async checkBtcAddr(wallet: Wallet, currencyRecord: CurrencyRecord) {
        const mnemonic = await getMnemonic(wallet, '');
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
    private async checkEthERC20TokenAddr(wallet: Wallet, currencyRecord: CurrencyRecord) {
        const mnemonic = await getMnemonic(wallet, '');
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
        const delay = this.calUpdateDelay(tx);
        const status = tx.status;
        if(status === TxStatus.SUCCESS) return;
        this.updateTxStatus(tx && tx.hash,currencyName,addr);
        if(!delay) return;
        const timer = setTimeout(()=>{
            this.timerUpdateTxWithdraw(newTx || tx);
        },delay);
        this.resetTimer(tx.hash,timer);
    }

    //定时更新交易
    private async timerUpdateTx(addr:string,currencyName:string,hash:string){
        const tx = fetchLocalTxByHash(addr,currencyName,hash);
        const delay = this.calUpdateDelay(tx);
        const status = tx.status;
        if(status === TxStatus.SUCCESS) return tx;
        this.updateTxStatus(tx && tx.hash,currencyName,addr);
        if(!delay) return;
        console.log(`${currencyName}--------delay`,delay);
        const timer = setTimeout(()=>{
            this.timerUpdateTx(addr,currencyName,hash);
        },delay);
        this.resetTimer(tx.hash,timer);

    }

    //通过hash获取timer item
    private fetchTimerItem(hash:string){
        let timerItem;
        for(let i = 0;i< this.txTimerList.length;i++){
            if(this.txTimerList[i].hash === hash){
                timerItem = this.txTimerList[i];
                return timerItem;
            }
        }
    }

    //通过hash清楚定时器
    public clearTimer(hash:string){
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
    private resetTimer(hash:string | number,timer){
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
    private calUpdateDelay(tx:TransRecordLocal){
        const second = 1000;
        const minute = 60 * second;
        const hour = 60 * minute;
        const currencyName = tx.currencyName;
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

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();