/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import { read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import { delValueFromArray, genUserHid, genUuid } from '../../../utils/util';
import * as CONSTANT from '../constant';
import { Contact, FriendLink, UserInfo } from '../db/user.s';
import { Result } from './basic.s';
import { getUid } from './group.r';
import { FriendAlias, UserAgree } from './user.s';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uuid uid:uid
 */
// #[rpc=rpcServer]
export const applyFriend = (uid: number): Result => {
    /**
     * 添加到联系人表中
     * @param sid sender id
     * @param rid reader id
     */
    const _applyFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        // 取出联系人表
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // TODO:判断rid是否已经添加了sid为好友
        // 取出对应的那一个联系人
        const contactInfo = contactBucket.get(rid)[0];
        contactInfo.applyUser.findIndex(item => item === sid) === -1 && contactInfo.applyUser.push(sid);      
        contactBucket.put(rid, contactInfo);
    };

    _applyFriend(getUid(), uid);

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 接受对方为好友
 * @param agree user agree
 */
// #[rpc=rpcServer]
export const acceptFriend = (agree: UserAgree): Result => {
    const _acceptFriend = (sid: number, rid: number, agree: boolean) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从申请列表中删除当前同意/拒绝的用户
        console.log(`sContactInfo.applyFriend is ${sContactInfo.applyUser}`);

        // 判断对方是否邀请了该用户,如果没有邀请，则直接返回
        if (sContactInfo.applyUser.findIndex(item => item === rid) === -1) {
            const rlt = new Result();
            rlt.r = -1;
            
            return rlt; 
        }

        sContactInfo.applyUser = delValueFromArray(rid, sContactInfo.applyUser);
        if (agree) {
            // 在对方的列表中添加好友
            const rContactInfo = contactBucket.get(rid)[0];
            rContactInfo.friends.findIndex(item => item === sid) === -1 && rContactInfo.friends.push(sid);
            contactBucket.put(rid, rContactInfo);
            // 在当前用户列表中添加好友
            sContactInfo.friends.findIndex(item => item === rid) === -1 && sContactInfo.friends.push(rid);
        }
        contactBucket.put(sid, sContactInfo);
        // 分别插入到friendLink中去
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
        const friendLink = new FriendLink();
        friendLink.uuid = genUuid(sid,rid);
        friendLink.alias = '';
        friendLink.hid = genUserHid(sid, rid);
        friendLinkBucket.put(friendLink.uuid,friendLink);
        friendLink.uuid = genUuid(rid,sid);
        friendLinkBucket.put(friendLink.uuid,friendLink);

    };

    _acceptFriend(getUid(), agree.uid, agree.agree);

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 删除好友
 * @param uuid uid:uid
 */
// #[rpc=rpcServer]
export const delFriend = (uid: number): Result => {
    const _delFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从好友列表中删除当前用户
        sContactInfo.friends = delValueFromArray(rid, sContactInfo.friends);
        contactBucket.put(sid, sContactInfo);
        // 从friendLink中删除
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
        friendLinkBucket.delete(genUuid(sid,rid));        
    };

    _delFriend(getUid(), uid);

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 将用户添加到黑名单
 * @param uid user id
 */
export const addToBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        logger.debug('User: ', peerUid, 'has already in blacklist of user: ', uid);
        result.r = 0;

        return result;
    } else {
        contactInfo.blackList.push(peerUid);
        contactBucket.put(uid, contactInfo);
        logger.debug('Add user: ', peerUid, 'to blacklist of user: ', uid);

        result.r = 1;

        return result;
    }
};

/**
 * 将用户移除黑名单
 * @param uid user id
 */

export const removeFromBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        contactInfo.blackList.splice(index, 1);
        contactBucket.put(uid, contactInfo);
        logger.debug('Remove user: ', peerUid, 'from blacklist of user: ', uid);
        result.r = 1;

        return result;
    } else {
        logger.debug('User: ', peerUid, 'is not banned by user: ', uid);
        result.r = 0;

        return result;
    }
};

/**
 * 修改好友别名
 * @param rid user id
 * @param alias user alias
 */
// #[rpc=rpcServer]
export const changeFriendAlias = (friendAlias:FriendAlias):Result => {
    const dbMgr = getEnv().getDbMgr();
    const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME,CONSTANT.FRIEND_LINK_TABLE,dbMgr);
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const sid = getUid();
    const uuid = genUuid(sid,friendAlias.rid);
    const result = new Result();
    const contactInfo = contactBucket.get(sid)[0];
    const index = contactInfo.friends.indexOf(friendAlias.rid);
    // 判断rid是否是当前用户的好友
    if (index > -1) {
        const friend = friendLinkBucket.get(uuid)[0];
        friend.alias = friendAlias.alias;
        friendLinkBucket.put(uuid,friend);
        result.r = 1;
    } else {
        logger.debug('user: ',friendAlias.rid,' is not your friend');
        result.r = 0;
    }
    
    return result;
};

/**
 * 修改当前用户的基础信息
 * @param userinfo user info
 */
// #[rpc=rpcServer]
export const changeUserInfo = (userinfo:UserInfo):UserInfo => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME,CONSTANT.USER_INFO_TABLE,dbMgr);
    const sid = getUid();
    let newUser = new UserInfo();
    if (userinfo.uid === sid) {
        userInfoBucket.put(sid,userinfo);
        newUser = userinfo;
    } else {
        logger.debug('curUser: ',sid,' changeUser: ',userinfo.uid);
        newUser.uid = -1;
    }
    
    return newUser;
};

// ================================================================= 本地