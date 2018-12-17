/**
 * 前端主动监听后端数据库的变化
 */
// ================================================================= 导入
import { BonBuffer } from '../../../pi/util/bon';
import { ab2hex } from '../../../pi/util/util';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import * as CONSTANT from '../constant';
import { AddressInfo } from '../db/extra.s';
import { GroupInfo, GroupUserLink } from '../db/group.s';    
import { AnnounceHistory, GroupHistory, MsgLock, UserHistory } from '../db/message.s';
import { AccountGenerator, Contact, FriendLink, UserCredential, UserInfo } from '../db/user.s';
import { iterTable } from '../util';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================================= 导出
     
/** 
 * 群组信息 
 * @param gid group id
 */
// #[rpc=rpcServer]
export const watchGroupInfo = (gid:number): GroupInfo => {
    return watchInfo('gid', gid, GroupInfo, -1);
};

/**
 * 群组中的用户信息
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const watchGroupUserLink = (guid: string): GroupUserLink => {
    return watchInfo('guid', guid, GroupUserLink, '-1');
};

/**
 * 用户历史记录
 * @param hIncId history increament id
 */
// #[rpc=rpcServer]
export const watchUserHistory = (hIncId: string): UserHistory => {    
    return watchInfo('hIncId', hIncId, UserHistory, '-1');
};

/**
 * 群组历史记录
 * @param hIncId history increament id
 */
// #[rpc=rpcServer]
export const watchGroupHistory = (hIncId: string): GroupHistory => {    
    return watchInfo('hIncId', hIncId, GroupHistory, '-1');
};

/**
 * 所有公告
 * @param aIncId announce increament id
 */
// #[rpc=rpcServer]
export const watchAnnounceHistory = (aIncId: string): AnnounceHistory => {
    return watchInfo('aIncId', aIncId, AnnounceHistory, '-1');
};

/**
 * 消息锁
 * @param hid history increament id
 */
// #[rpc=rpcServer]
export const watchMsgLock = (hid: string): MsgLock => {
    return watchInfo('hid', hid, MsgLock, -1);
};

/**
 * 用户本人的基本信息
 * @param uid user id
 */
// #[rpc=rpcServer]
export const watchUserInfo = (uid: number): UserInfo => {
    return watchInfo('uid', uid, UserInfo, -1);
};

/**
 * User credential table
 * @param uid user id
 */
// #[rpc=rpcServer]
export const watchUserCredential = (uid: number): UserCredential => {
    return watchInfo('uid', uid, UserCredential, -1);
};

/**
 * User account generator
 * @param index index
 */
// #[rpc=rpcServer]
export const watchAccountGenerator = (index: String): AccountGenerator => {
    return watchInfo('index', index, UserCredential, '-1');
};

/**
 * 好友链接信息
 * @param uuid uid:uid
 */
// #[rpc=rpcServer]
export const watchFriendLink = (uuid: string): FriendLink => {
    return watchInfo('uuid', uuid, FriendLink, '-1');
};

/**
 * 联系人信息
 * @param uid user id 
 */
// #[rpc=rpcServer]
export const watchContact = (uid: number): Contact => {
    return watchInfo('uid', uid, Contact, -1);
};

/**
 * 地址信息
 * @param uid uid user id
 */
// #[rpc=rpcServer]
export const watchAddressInfo = (uid: number): AddressInfo => {
    return watchInfo('uid', uid, AddressInfo, -1);
};

// ================================================================= 本地

/**
 * 获取mqttServer
 */
const getMqttServer = () => {
    return  getEnv().getNativeObject('mqttServer');
};

/**
 * 一个通用的数据库监听器函数
 * @param keyName key name
 * @param keyValue key value 
 * @param tableStruct struct
 * @param defaultValue  default value
 */
export const watchInfo = (keyName:string, keyValue:any, tableStruct:any, keyDefaultValue:any):any => {    
    // 监听数据库
    const mqttServer = getMqttServer();
    const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
    setMqttTopic(<any>mqttServer, `${CONSTANT.WARE_NAME}.${tableStruct._$info.name}.${bonKeyValue}`, true, true); 
    // 返回当前值
    const dbMgr = getEnv().getDbMgr();
    const infoBucket = new Bucket(CONSTANT.WARE_NAME, tableStruct._$info.name, dbMgr); 
    logger.debug(`${tableStruct._$info.name} iter`);
    iterTable(dbMgr,tableStruct);
    logger.debug(`keyName is : ${keyName}, keyValue is : ${keyValue}, info is : ${infoBucket.get(keyValue)[0]}`);  
    const info = infoBucket.get(keyValue)[0] || new tableStruct();
    logger.debug(tableStruct._$info.name);
    info[keyName] = info[keyName] || keyDefaultValue;

    return info;
};
