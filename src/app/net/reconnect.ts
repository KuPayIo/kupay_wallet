/**
 * 断线重连相关
 */
import { getStore as chatGetStore } from '../../chat/client/app/data/store';
import { chatManualReconnect } from '../../chat/client/app/net/init';
import { earnManualReconnect } from '../../earn/client/app/net/init';
import { getStore as earnGetStore } from '../../earn/client/app/store/memstore';
import { getStore, setStore } from '../store/memstore';
import { walletManualReconnect } from './login';

/**
 * 获取是否离线
 */
export const getAllIsLogin = () => {
    return getStore('user/id') ? getStore('user/allIsLogin') : true;
};

/**
 * 手动重连
 */
export const manualReconnect = () => {
    // 是否正在重连
    const reconnecting = {
        wallet:false,
        earn:false,
        chat:false
    };
    if (!getStore('user/isLogin')) {
        console.log('wallet is reconnecting');
        walletManualReconnect();
        reconnecting.wallet = true;
    }
    if (!earnGetStore('userInfo/isLogin')) {
        console.log('earn is reconnecting');
        earnManualReconnect();
        reconnecting.earn = true;
    }
    if (!chatGetStore('isLogin')) {
        console.log('chat is reconnecting');
        chatManualReconnect();
        reconnecting.chat = true;
    }
    setStore('flags/reconnecting',reconnecting);
};

/**
 * 是否正在连接
 */
export const isReconnecting = () => {
    const reconnecting = getStore('flags').reconnecting;
    
    return reconnecting && reconnecting.wallet && reconnecting.earn && reconnecting.chat;
};

/**
 * 设置正在连接标识位状态
 */
export const setReconnectingState = (name:'wallet' | 'earn' | 'chat',isReconnecting:boolean) => {
    const reconnecting = getStore('flags').reconnecting; 
    if (reconnecting) {
        reconnecting[name] =  isReconnecting;
        setStore('flags/reconnecting',reconnecting);
    } 
};