/**
 * 获取客户的基本信息
 * 后端不应该相信前端发送的uid信息，应该自己从会话中获取
 */
// ================================================================= 导入
import { read, write } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import { genHIncId, genNewIdFromOld, genUserHid, genUuid, getIndexFromHIncId } from '../../../utils/util';
import * as CONSTANT from '../constant';
import { UserHistory, UserHistoryCursor } from '../db/message.s';
import { AccountGenerator, Contact, FriendLink, GENERATOR_TYPE, OnlineUsers, OnlineUsersReverseIndex, UserCredential, UserInfo, UserAccount } from '../db/user.s';
import { AnnouceFragment, AnnounceHistoryArray, FriendLinkArray, GetContactReq, GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, GroupArray, GroupHistoryArray, LoginReq, MessageFragment, UserArray, UserHistoryArray, UserHistoryFlag, UserRegister, UserType, UserType_Enum, WalletLoginReq } from './basic.s';
import { getUid } from './group.r';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================================= 导出
/**
 * 用户注册
 * @param registerInfo user info
 */
// #[rpc=rpcServer]
export const registerUser = (registerInfo: UserRegister): UserInfo => {
    logger.debug('user try to register with: ', registerInfo);
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE, dbMgr);
    const userCredentialBucket = new Bucket('file', CONSTANT.USER_CREDENTIAL_TABLE, dbMgr);
    const accountGeneratorBucket = new Bucket('file', CONSTANT.ACCOUNT_GENERATOR_TABLE, dbMgr);

    const userInfo = new UserInfo();
    const userCredential = new UserCredential();

    userInfo.name = registerInfo.name;
    userInfo.note = '';
    userInfo.tel = '';
    // 这是一个事务
    accountGeneratorBucket.readAndWrite(GENERATOR_TYPE.USER, (items: any[]) => {
        const accountGenerator = new AccountGenerator();
        accountGenerator.index = GENERATOR_TYPE.USER;
        accountGenerator.currentIndex = genNewIdFromOld(items[0].currentIndex);
        userInfo.uid = accountGenerator.currentIndex;

        return accountGenerator;
    });

    userInfo.sex = 1;

    userCredential.uid = userInfo.uid;
    userCredential.passwdHash = registerInfo.passwdHash;

    userInfoBucket.put(userInfo.uid, userInfo);
    logger.debug('sucessfully registered user', userInfo);
    userCredentialBucket.put(userInfo.uid, userCredential);

    // write contact info
    const contact = new Contact();
    contact.uid = userInfo.uid;
    contact.applyGroup = [];
    contact.applyUser = [];
    contact.friends = [];
    contact.group = [];
    contact.temp_chat = [];
    contact.blackList = [];

    const contactBucket = new Bucket('file', CONSTANT.CONTACT_TABLE, dbMgr);
    const c = contactBucket.get(userInfo.uid)[0];
    if (c === undefined) {
        const v = contactBucket.put(userInfo.uid, contact);
        if (v) {
            logger.debug('Create user contact success');
        } else {
            logger.error('Create user contact failed');
        }
    }

    return userInfo;
};

// #[rpc=rpcServer]
export const login = (user: UserType): UserInfo => {
    // logger.debug('user try to login with uid: ', loginReq.uid);
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE, dbMgr);
    const userCredentialBucket = new Bucket('file', CONSTANT.USER_CREDENTIAL_TABLE, dbMgr);

    let loginReq = new LoginReq();
    let userInfo = new UserInfo();
    if (user.enum_type === UserType_Enum.WALLET) {
        let walletLoginReq = <WalletLoginReq>user.value;
        let openid = walletLoginReq.openid;
        let sign = walletLoginReq.sign;
        //TODO 验证签名
        const userAccountBucket = new Bucket('file', CONSTANT.USER_ACCOUNT_TABLE, dbMgr);
        let v = userAccountBucket.get(openid)[0];
        if (!v) {
            //注册用户
            let reguser = new UserRegister();
            reguser.passwdHash = openid;
            reguser.name = "";
            let userinfo = registerUser(reguser);
            let userAcc = new UserAccount();
            userAcc.user = openid;
            userAcc.uid = userinfo.uid;
            let v = userAccountBucket.put(openid,userAcc);
            loginReq.uid = userinfo.uid;
        } else {
            loginReq.uid = v.uid;
        }
    } else if (user.enum_type === UserType_Enum.DEF) {
        loginReq = <LoginReq>user.value;
        const passwdHash = loginReq.passwdHash;
        const expectedPasswdHash = userCredentialBucket.get(loginReq.uid);
        //判断密码是否正确
        // user doesn't exist
        if ((expectedPasswdHash[0] === undefined) || (passwdHash !== expectedPasswdHash[0].passwdHash)) {
            userInfo.uid = -1;
            userInfo.sex = 0;
            logger.debug('user does not exist: ', loginReq.uid);
            return userInfo;
        }
    }
    // FIXME: constant time equality check
    userInfo = userInfoBucket.get(loginReq.uid)[0];
    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    setMqttTopic(mqttServer, loginReq.uid.toString(), true, true);
    logger.debug('Set user topic: ', loginReq.uid.toString());

    // save session
    const session = getEnv().getSession();
    write(dbMgr, (tr: Tr) => {
        session.set(tr, 'uid', loginReq.uid.toString());
        logger.info('set session value of uid: ', loginReq.uid.toString());
    });

    // TODO: debug purpose
    read(dbMgr, (tr: Tr) => {
        const v = session.get(tr, 'uid');
        logger.debug('read session value of uid: ', v);
        logger.debug('user login session id: ', session.getId());
    });

    const onlineUsersBucket = new Bucket('memory', CONSTANT.ONLINE_USERS_TABLE, dbMgr);
    const onlineUsersReverseIndexBucket = new Bucket('memory', CONSTANT.ONLINE_USERS_REVERSE_INDEX_TABLE, dbMgr);

    const online = new OnlineUsers();
    online.uid = loginReq.uid;
    online.sessionId = session.getId();
    onlineUsersBucket.put(online.uid, online);

    logger.debug('Add user: ', loginReq.uid, 'to online users bucket with sessionId: ', online.sessionId);

    const onlineReverse = new OnlineUsersReverseIndex();
    onlineReverse.sessionId = session.getId();
    onlineReverse.uid = loginReq.uid;
    onlineUsersReverseIndexBucket.put(onlineReverse.sessionId, onlineReverse);

    logger.debug('Add user: ', loginReq.uid, 'to online users reverse index bucket with sessionId: ', online.sessionId);

    userInfo.sex = 0;

    return userInfo;
};

/**
 * 获取用户基本信息
 *
 * @param uid user id
 */
// #[rpc=rpcServer]
export const getUsersInfo = (getUserInfoReq: GetUserInfoReq): UserArray => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE, dbMgr);

    const uids = getUserInfoReq.uids;
    const values: any = userInfoBucket.get(uids);
    logger.debug('Read userinfo: ', uids, values);

    // FIXME: check if `values` have undefined element, or will crash
    const res = new UserArray();
    res.arr = values;

    return res;
};

/**
 * 获取群组基本信息
 * @param uid user id
 */
// #[rpc=rpcServer]
export const getGroupsInfo = (getGroupInfoReq: GetGroupInfoReq): GroupArray => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = new Bucket('file', CONSTANT.GROUP_INFO_TABLE, dbMgr);

    const gids = getGroupInfoReq.gids;
    const values: any = groupInfoBucket.get(gids);

    const res = new GroupArray();
    res.arr = values;

    return res;
};

/**
 * 获取联系人信息
 * @param uid user id 
 */
// #[rpc=rpcServer]
export const getContact = (getContactReq: GetContactReq): Contact => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket('file', CONSTANT.CONTACT_TABLE, dbMgr);

    const uid = getContactReq.uid;
    const value = contactBucket.get<number, Contact>(uid);

    return value[0];
};

/**
 * 获取好友别名和历史记录
 * @param uuidArr userid:userid
 */
// #[rpc=rpcServer]
export const getFriendLinks = (getFriendLinksReq: GetFriendLinksReq): FriendLinkArray => {
    const dbMgr = getEnv().getDbMgr();
    const friendLinkBucket = new Bucket('file', CONSTANT.FRIEND_LINK_TABLE, dbMgr);

    const friendLinkArray = new FriendLinkArray();
    // const friend = new FriendLink();
    logger.debug(`uuid is : ${JSON.stringify(getFriendLinksReq.uuid)}`);
    const friends = friendLinkBucket.get<string[], FriendLink[]>(getFriendLinksReq.uuid);
    // no friends found
    // if (friends === undefined) {
    //     friend.alias = '';
    //     friend.hid = 0;
    //     friend.uuid = '';
    // }
    logger.debug(`friendLinkArray is : ${JSON.stringify(friends)}`);
    friendLinkArray.arr = friends || [];

    return friendLinkArray;
};

/**
 * 获取群组聊天的历史记录
 * @param hid history id
 */
// #[rpc=rpcServer]
export const getGroupHistory = (param: MessageFragment): GroupHistoryArray => {
    const dbMgr = getEnv().getDbMgr();
    const groupHistoryBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE, dbMgr);

    const groupHistoryArray = new GroupHistoryArray();

    // we don't use param.order there, because `iter` is not bidirectional
    const hid = param.hid;
    // tslint:disable-next-line:no-reserved-keywords
    const from = param.from;
    const size = param.size;

    const keyPrefix = `${hid}:`;
    const value = groupHistoryBucket.get(keyPrefix + from);

    if (value[0] !== undefined) {
        for (let i = from; i < from + size; i++) {
            const v = groupHistoryBucket.get(keyPrefix + i);
            if (v[0] !== undefined) {
                groupHistoryArray.arr.push(v[0]);
            } else {
                break;
            }
        }
    }

    return groupHistoryArray;
};

/**
 * 获取单聊的消息记录
 */
// #[rpc=rpcServer]
export const getUserHistory = (param: UserHistoryFlag): UserHistoryArray => {
    logger.debug('getUserHistory param', param);
    const dbMgr = getEnv().getDbMgr();
    const sid = getUid();
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE, dbMgr);
    const userHistoryCursorBucket = new Bucket('file', CONSTANT.USER_HISTORY_CURSOR_TABLE, dbMgr);
    const hid = genUserHid(sid, param.rid); // 删除好友也应该可以看到以前发送的历史记录，所以不从friendLink中获取
    const userHistoryArray = new UserHistoryArray();
    userHistoryArray.arr = [];

    let fg = 1;
    let index = -1;
    let userCursor = userHistoryCursorBucket.get<String, UserHistoryCursor>(genUuid(sid, param.rid))[0];
    logger.debug(`getUserHistory begin index:${index}, userHistoryCursor: ${JSON.stringify(userCursor)}`);

    if (param.hIncId) {  // 如果本地有记录则取本地记录
        index = getIndexFromHIncId(param.hIncId);

    } else if (userCursor) { // 如果本地没有记录且cursor存在则从cursor中获取，否则从0开始
        index = userCursor.cursor;
    }

    while (fg === 1) {
        index++;
        const oneMess = userHistoryBucket.get<String, UserHistory>(genHIncId(hid, index))[0];
        logger.debug('getUserHistory oneMess: ', oneMess);
        if (oneMess) {
            userHistoryArray.arr.push(oneMess);
        } else {
            fg = 0;
        }
    }

    // 游标表中是否有该用户的记录
    if (!userCursor) {

        userCursor = new UserHistoryCursor();
        userCursor.uuid = genUuid(sid, param.rid);
    }
    userCursor.cursor = index - 1;
    userHistoryCursorBucket.put(userCursor.uuid, userCursor);
    logger.debug(`getUserHistory index:${index}, userHistoryCursor: ${JSON.stringify(userCursor)}`);

    userHistoryArray.newMess = userHistoryArray.arr.length;
    logger.debug('getUserHistory rid: ', param.rid, 'history: ', userHistoryArray);

    return userHistoryArray;
};

/**
 * 获取公告
 * @param param AnnouceFragment
 */
// #[rpc=rpcServer]
export const getAnnoucement = (param: AnnouceFragment): AnnounceHistoryArray => {
    const dbMgr = getEnv().getDbMgr();
    const announceHistoryBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);

    const announceHistory = new AnnounceHistoryArray();

    // we don't use param.order there, because `iter` is not bidirectional
    const aid = param.aid;
    // tslint:disable-next-line:no-reserved-keywords
    const from = param.from;
    const size = param.size;

    const keyPrefix = `${aid}:`;
    const value = announceHistoryBucket.get(keyPrefix + from);

    if (value[0] !== undefined) {
        for (let i = from; i < from + size; i++) {
            const v = announceHistoryBucket.get(keyPrefix + i);
            if (v[0] !== undefined) {
                announceHistory.arr.push(v[0]);
            } else {
                break;
            }
        }
    }

    return announceHistory;
};

// ================================================================= 本地
