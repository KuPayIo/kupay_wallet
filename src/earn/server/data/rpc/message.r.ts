/**
 * 聊天操作
 */
// ================================================================= 导入
import { AnnounceHistory, Announcement, GroupHistory, GroupMsg, MSG_TYPE, MsgLock, UserHistory, UserHistoryCursor ,UserMsg } from '../db/message.s';
import { Result } from './basic.s';
import { GroupSend, UserSend } from './message.s';

import { BonBuffer } from '../../../pi/util/bon';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { mqttPublish, QoS } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import * as CONSTANT from '../constant';

import { Logger } from '../../../utils/logger';
import { OnlineUsers } from '../db/user.s';

import * as bigInt from '../../../pi/bigint/biginteger';
import { genGroupHid, genHIncId, genNextMessageIndex, genUserHid, genUuid } from '../../../utils/util';
import { getUid } from './group.r';

const logger = new Logger('MESSAGE');

/**
 * 用户确认读取了的最新消息id
 * @param uid user id
 */
// #[rpc=rpcServer]
// export const messageReadAck = (cursor: LastReadMessageId): Result => {
//     const dbMgr = getEnv().getDbMgr();
//     const lastReadMessageidBucket = new Bucket('file', CONSTANT.LAST_READ_MESSAGE_ID_TABLE, dbMgr);
//     const sessionUid = getUid();
//     const uid = cursor.mtype.split(':')[1];
//     const res = new Result();
//     if (sessionUid === undefined) {
//         logger.debug('User didn\'t login, can\'t send message read ack');
//         res.r = 0;

//         return res;
//     }

//     if (sessionUid !== parseInt(uid,10)) {
//         logger.debug('inappropriate uid');
//         res.r = 0;

//         return res;
//     }

//     const lrmi = new LastReadMessageId();
//     lrmi.mtype = cursor.mtype;
//     lrmi.msgId = cursor.msgId;

//     lastReadMessageidBucket.put(uid, lrmi);
//     logger.debug('User: ', uid, 'confirm receive message id: ', lrmi.msgId);
//     res.r = 1;

//     return res;
// };

/**
 * 获取单聊消息游标
 */
// #[rpc=rpcServer]
export const getUserHistoryCursor = (uid: number): UserHistoryCursor => {
    const dbMgr = getEnv().getDbMgr();
    const sid = getUid();
    const userHistoryCursorBucket = new Bucket('file', CONSTANT.USER_HISTORY_CURSOR_TABLE, dbMgr);
  
    return userHistoryCursorBucket.get(genUuid(sid,uid))[0];
};

// ================================================================= 导出
/**
 * 发送群组消息
 * @param message group send
 */
// #[rpc=rpcServer]
export const sendGroupMessage = (message: GroupSend): GroupHistory => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE, dbMgr);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE, dbMgr);
    const gInfoBucket = new Bucket('file', CONSTANT.GROUP_INFO_TABLE, dbMgr);
    const gInfo = gInfoBucket.get(message.gid)[0];        

    const gh = new GroupHistory();
    const gmsg = new GroupMsg();
    gmsg.msg = message.msg;
    gmsg.mtype = message.mtype;
    gmsg.send = true;
    gmsg.sid = getUid();
    gmsg.time = message.time;
    gmsg.cancel = false;    
    gh.msg = gmsg;
    // 判断是否是群组成员
    logger.debug(`sid is : ${gmsg.sid}`);
    if (gInfo.memberids.findIndex(id => id === gmsg.sid) === -1) {
        gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;

        return gh;
    }
    // 生成消息ID
    const msgLock = new MsgLock();
    msgLock.hid = genGroupHid(message.gid);
    // 消息撤回
    if (message.mtype === MSG_TYPE.RECALL) {
        // 需要撤回的消息key
        const recallKey = message.msg;
        // 获取撤回消息的基础信息
        const v = bkt.get<string, GroupHistory>(recallKey);
        // TODO 判断撤回时间
        if (v !== undefined) {
            v.msg.cancel = true;
            bkt.put(recallKey, v[0]);
        }
    }

    // 公告消息撤回
    if (message.mtype === MSG_TYPE.RENOTICE) {
        // 需要撤回的消息key
        const recallKey = message.msg;
        const noticeBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);
        // 获取撤回消息的基础信息
        const v = noticeBucket.get<string, AnnounceHistory>(recallKey);
        // TODO 判断撤回时间
        if (v !== undefined) {
            v.announce.cancel = true;
            noticeBucket.put(recallKey, v[0]);
        }
    }

    // 公告消息
    if (message.mtype === MSG_TYPE.NOTICE) {
        // 公告数据存储
        const noticeBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);
        const anmt = new Announcement();
        anmt.cancel = false;
        anmt.msg = message.msg;
        anmt.mtype = message.mtype;
        anmt.send = true;
        anmt.time = Date.now();
        anmt.sid = getUid();

        const ah = new AnnounceHistory();
        // 公告key使用群聊消息key
        ah.aIncId = msgLock.hid;
        ah.announce = anmt;
        noticeBucket.put(ah.aIncId, ah);
        logger.debug('Send annoucement: ', anmt, 'to group: ', message.gid);
    }

    logger.debug(`before read and write`);
    // 这是一个事务
    msgLockBucket.readAndWrite(msgLock.hid,(mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));

        return msgLock;
    });    
    logger.debug(`after read and write`);
    gh.hIncId = genHIncId(msgLock.hid, msgLock.current);    

    bkt.put(gh.hIncId, gh);

    const buf = new BonBuffer();
    gh.bonEncode(buf);

    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    const groupTopic = `ims/group/msg/${ message.gid}`;
    logger.debug(`before publish ,the topic is : ${groupTopic}`);
    // directly send message to group topic
    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupTopic, buf.getBuffer());
    logger.debug('Send group message: ', message.msg, 'to group topic: ', groupTopic);

    return gh;
};

/**
 * 发送单聊消息
 * @param message user send
 */
// #[rpc=rpcServer]
export const sendUserMessage = (message: UserSend): UserHistory => {
    console.log('sendMsg!!!!!!!!!!!', message);
    const dbMgr = getEnv().getDbMgr();
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE, dbMgr);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE, dbMgr);

    const sid = getUid();
    const userHistory = new UserHistory();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    // 获取对方联系人列表
    const sContactInfo = contactBucket.get(message.rid)[0];
    // 判断当前用户是否在对方的好友列表中
    
    // 消息撤回
    if (message.mtype === MSG_TYPE.RECALL) {
        // 需要撤回的消息key
        const recallKey = message.msg;
        // 获取撤回消息的基础信息
        const v = userHistoryBucket.get<string, UserHistory>(recallKey);
        // TODO 判断撤回时间
        if (v[0] !== undefined) {
            v.msg.cancel = true;
            userHistoryBucket.put(recallKey, v[0]);
        }
    }
    const userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = message.mtype;
    userMsg.read = false;
    userMsg.send = false;
    userMsg.sid = sid;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    // logger.debug(`friends is : ${JSON.stringify(sContactInfo.friends)}, sid is : ${sid}`);
    if (sContactInfo.friends.findIndex(item => item === sid) === -1) {
        userHistory.hIncId =  CONSTANT.DEFAULT_ERROR_STR;

        return userHistory;
    }
    
    const msgLock = new MsgLock();
    msgLock.hid = genUserHid(sid, message.rid);
    // 这是一个事务
    logger.debug('before readAndWrite');
    msgLockBucket.readAndWrite(msgLock.hid,(mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));
        logger.debug('readAndWrite...');

        return msgLock;
    });
    logger.debug('after readAndWrite');
    userHistory.hIncId =  genHIncId(msgLock.hid, msgLock.current);
    
    userHistoryBucket.put(userHistory.hIncId, userHistory);
    logger.debug('Persist user history message to DB: ', userHistory);

    const buf = new BonBuffer();
    userHistory.bonEncode(buf);

    const userHistoryCursorBucket = new Bucket('file',CONSTANT.USER_HISTORY_CURSOR_TABLE,dbMgr);
    let sidHistoryCursor = userHistoryCursorBucket.get(genUuid(sid,message.rid))[0];
    let ridHistoryCursor = userHistoryCursorBucket.get(genUuid(message.rid,sid))[0];
    logger.debug('sendUserMessage begin sidHistoryCursor: ', sidHistoryCursor);
    logger.debug('sendUserMessage begin ridHistoryCursor: ', ridHistoryCursor);
    
    // 游标表中是否有该用户的记录
    if (sidHistoryCursor) { 
        sidHistoryCursor.cursor = msgLock.current; // 发送者的游标一定在变化
    } else {
        sidHistoryCursor = new UserHistoryCursor();
        sidHistoryCursor.uuid = genUuid(sid,message.rid);
        sidHistoryCursor.cursor = msgLock.current;
    }
    
    logger.debug('sendUserMessage sidHistoryCursor: ', sidHistoryCursor);
    userHistoryCursorBucket.put(genUuid(sid,message.rid),sidHistoryCursor);

    // 游标表中是否有该用户的记录
    if (!ridHistoryCursor) {
        ridHistoryCursor = new UserHistoryCursor();
        ridHistoryCursor.uuid = genUuid(message.rid,sid);
        ridHistoryCursor.cursor = -1;
    }
    // 对方是否在线，不在线则不推送消息
    const res = isUserOnline(message.rid);
    if (res.r === 1) {
        const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
        mqttPublish(mqttServer, true, QoS.AtMostOnce, message.rid.toString(), buf.getBuffer());
        logger.debug(`from ${sid} to ${message.rid}, message is : ${JSON.stringify(userHistory)}`);
        
        ridHistoryCursor.cursor = msgLock.current; // 接收者在线则游标会变化，否则不变化
    } 

    userHistoryCursorBucket.put(genUuid(message.rid,sid),ridHistoryCursor); 
    logger.debug(`sendUserMessage ridHistoryCursor: ${JSON.stringify(ridHistoryCursor)}`);

    return userHistory;
};

/**
 * 判断用户是否在线
 * @param uid 用户ID
 */
// #[rpc=rpcServer]
export const isUserOnline = (uid: number): Result => {
    const dbMgr = getEnv().getDbMgr();

    const res = new Result();
    const bucket = new Bucket('memory', CONSTANT.ONLINE_USERS_TABLE, dbMgr);
    const onlineUser = bucket.get<number, [OnlineUsers]>(uid)[0];
    if (onlineUser !== undefined && onlineUser.sessionId !== -1) {
        logger.debug('User: ', uid, 'on line');
        res.r = 1; // on line;

        return res;
    } else {
        logger.debug('User: ', uid, 'off line');
        res.r = 0; // off online

        return res;
    }
};

// ----------------- helpers ------------------