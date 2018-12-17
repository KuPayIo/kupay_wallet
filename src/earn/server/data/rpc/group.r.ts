/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GroupInfo, GroupUserLink } from '../db/group.s';
import { AccountGenerator, Contact, GENERATOR_TYPE, UserInfo } from '../db/user.s';
import { GroupUserLinkArray, Result } from './basic.s';
import { GroupAgree, GroupCreate, GroupMembers, Invite, InviteArray, NotifyAdmin, GuidsAdminArray } from './group.s';

import { BonBuffer } from '../../../pi/util/bon';
import { read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { mqttPublish, QoS, setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import { delValueFromArray, genAnnounceIncId, genGroupHid, genGuid, genHidFromGid, genNewIdFromOld, getGidFromGuid, getUidFromGuid } from '../../../utils/util';
import * as CONSTANT from '../constant';

const logger = new Logger('GROUP');
const START_INDEX = 0;
// ================================================================= 导出

/**
 * 用户主动申请加入群组
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const applyJoinGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    gInfo.applyUser.push(uid);
    groupInfoBucket.put(gid,gInfo);
    const admins = gInfo.adminids;

    const notify = new NotifyAdmin();
    notify.uid = uid;

    const buf = new BonBuffer();
    notify.bonEncode(buf);

    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    // notify all admins
    for (let i = 0; i < admins.length; i++) {
        // TODO: persist this message
        mqttPublish(mqttServer, true, QoS.AtMostOnce, admins[i].toString(), buf.getBuffer());
        logger.debug('Notify admin: ', admins[i], 'for user: ', uid, 'want to join the group');
    }
    res.r = 1;

    return res;
};

/**
 * 用户主动退出群组
 * @param gid group number
 */

// #[rpc=rpcServer]
export const userExitGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();

    const uid = getUid();
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    const index1 = gInfo.memberids.indexOf(uid);
    const contact = contactBucket.get<number, [Contact]>(uid)[0];
    const index2 = contact.group.indexOf(gid);
    // 群主不能主动退出群组 只能调用解散群接口
    if(gInfo.ownerid === uid){
        logger.debug('user: ', uid, 'is owner, cant exit group: ', gid);
        res.r = -1;
        return res;
    }
    if (index1 > -1) {
        gInfo.memberids.splice(index1, 1);
        groupInfoBucket.put(gid, gInfo);
        logger.debug('user: ', uid, 'exit group: ', gid);

        contact.group.splice(index2, 1);
        contactBucket.put(uid, contact);
        logger.debug('Remove group: ', gid, 'from user\'s contact');

        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(`${gid}:${uid}`);
        logger.debug('delete user: ', uid, 'from groupUserLinkBucket');

        res.r = 1;
    } else {
        res.r = 0;
    }

    return res;
};

/**
 * 管理员接受/拒绝用户的加群申请
 * @param agree agree
 */
// #[rpc=rpcServer]
export const acceptUser = (agree: GroupAgree): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(agree.gid)[0];
    const admins = gInfo.adminids;
    const owner = gInfo.ownerid;

    const contactBucket = getContactBucket();
    const contact = contactBucket.get<number, [Contact]>(agree.uid)[0];

    if (!(admins.indexOf(uid) > -1 || owner === uid)) {
        res.r = 3; // user is not admin or owner
        logger.debug('User: ', uid, 'is not amdin or owner');

        return res;
    }

    if (!agree.agree) {
        res.r = 4; // admin refuse user to join
        logger.debug('Admin refuse user: ', agree.uid, 'to join in group: ', agree.gid);

        return res;
    }
    if (gInfo.memberids.indexOf(agree.uid) > -1 || gInfo.adminids.indexOf(agree.uid) > -1) {
        res.r = 2; // user has been exist
        logger.debug('User: ', agree.uid, 'has been exist');
    } else if (contact === undefined) {
        res.r = -1; // agree.uid is not a registered user
        logger.error('user: ', agree.uid, 'is not a registered user');

        return res;
    } else {
        gInfo.memberids.push(agree.uid);
        //删除接受/拒绝用户的加群申请
        if(gInfo.applyUser.findIndex(item => item === agree.uid) === -1){
            const rlt = new Result();
            rlt.r = -1;
            
            return rlt; 
        }
        gInfo.applyUser = delValueFromArray(agree.uid,gInfo.applyUser);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('Accept user: ', agree.uid, 'to group: ', agree.gid);
        contact.group.push(agree.gid);
        contactBucket.put(agree.uid, contact);
        logger.debug('Add group: ', agree.gid, 'to user\'s contact: ', contact.group);

        const groupUserLinkBucket = getGroupUserLinkBucket();
        const gul = new GroupUserLink();
        gul.guid = `${agree.gid}:${agree.uid}`;
        gul.hid = '';
        gul.join_time = Date.now();
        gul.userAlias = '';
        gul.groupAlias = '';

        groupUserLinkBucket.put(gul.guid, gul);
        logger.debug('Add user: ', agree.uid, 'to groupUserLinkBucket');

        res.r = 1; // successfully add user
    }

    return res;
};

/**
 * 群成员邀请其他用户加入群
 * @param invite invaite Array
 */
// #[rpc=rpcServer]
export const inviteUsers = (invites: InviteArray): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();
    const uid = getUid();
    const res = new Result();
    const gid = invites.arr[0].gid;

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    // 判断该用户是否属于该群组
    if (gInfo.memberids.indexOf(uid) <= -1) {
        logger.debug('user: ', uid, 'is not a member of this group');
        res.r = 2; // User is not a member of this group

        return res;
    }
    // 判断该用户是否和被邀请的用户是好友
    const currentUserInfo = contactBucket.get<number, [Contact]>(uid)[0];
    logger.debug(`before filter invites is : ${JSON.stringify(invites.arr)}`);
    logger.debug(`currentUserInfo.friends is : ${JSON.stringify(currentUserInfo.friends)}`);
    invites.arr = invites.arr.filter((ele:Invite) => {
        // 无法邀请不是好友的用户
        return currentUserInfo.friends.findIndex(item => item === ele.rid) !== -1;
    });
    logger.debug(`after filter invites is : ${JSON.stringify(invites.arr)}`);
    for (let i = 0; i < invites.arr.length; i++) {
        const rid = invites.arr[i].rid;
        const cInfo = contactBucket.get<number, [Contact]>(rid)[0];
        // TODO: 判断对方是否已经在当前群中
        cInfo.applyGroup.push(gid);
        contactBucket.put(rid, cInfo);
        logger.debug('Invite user: ', rid, 'to group: ', gid);
    }

    res.r = 1;

    return res;
};

/**
 * 用户同意加入群组(被动加入)
 * @param agree GroupAgree
 */
// #[rpc=rpcServer]
export const agreeJoinGroup = (agree: GroupAgree): GroupInfo => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();
    const uid = getUid();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(agree.gid)[0];
    const cInfo = contactBucket.get<number, [Contact]>(uid)[0];
    // 判断群组是否邀请了该用户,如果没有邀请，则直接返回
    if (cInfo.applyGroup.findIndex(item => item === agree.gid) === -1) {
        gInfo.gid = -1; // gid = -1 indicate that user don't want to join this group
        
        return gInfo; 
    }
    // 删除applyGroup并放回db中
    cInfo.applyGroup = delValueFromArray(agree.gid, cInfo.applyGroup);   
    
    if (agree.agree) {
        cInfo.group.push(agree.gid);
    }
    contactBucket.put(uid, cInfo);
    if (!agree.agree) {        
        logger.debug('User: ', uid, 'don\'t want to join group: ', agree.gid);
        gInfo.gid = -1; // gid = -1 indicate that user don't want to join this group

        return gInfo;
    }    

    if (gInfo.memberids.indexOf(uid) > -1) {
        logger.debug('User: ', uid, 'has been exist');
    } else {
        gInfo.memberids.push(uid);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('User: ', uid, 'agree to join group: ', agree.gid);        

        const groupUserLinkBucket = getGroupUserLinkBucket();
        const gul = new GroupUserLink();
        gul.guid = genGuid(agree.gid, uid);
        gul.hid = gInfo.hid;
        gul.join_time = Date.now();        
        gul.userAlias = getCurrentUserInfo().name;
        gul.groupAlias = gInfo.name;

        groupUserLinkBucket.put(gul.guid, gul);
        logger.debug('Add user: ', uid, 'to groupUserLinkBucket');
    }

    return gInfo;
};

/**
 * 转移群主
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const setOwner = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = guid.split(':')[0];
    const newOwnerId = guid.split(':')[1];
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to chang new owner: ', newOwnerId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10))[0];
    if (uid !== gInfo.ownerid) {
        logger.debug('User: ', uid, 'is not the owner of group: ', gInfo.gid);
        res.r = 0; // not the group owner

        return res;
    }

    // 将原管理员列表对应项替换成新的群主
    const ownerIdindex = gInfo.adminids.indexOf(gInfo.ownerid);
    gInfo.adminids.splice(ownerIdindex,1,parseInt(newOwnerId),10);
    gInfo.ownerid = parseInt(newOwnerId,10);
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('change group: ', groupId, 'owner from: ', gInfo.ownerid, 'to: ', newOwnerId);
    res.r = 1;

    return res;
};

/**
 * 添加管理员
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const addAdmin = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    // TODO:判断群是否已经销毁
    // TODO:判断群是否存在
    // TODO:先判断当前用户是否是管理员
    // TODO:判断被添加的用户是否是群成员
    // 判断被添加的用户是否已经是管理员
    const uid = getUid();

    const guids = guidsAdmin.guids;

    const res = new Result();
    const groupId = guids[0].split(':')[0];
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10))[0];
    if(gInfo.ownerid !== uid){
        logger.debug('User: ', uid, 'is not an owner');
        res.r = -1;
        return res;
    }
    guids.forEach(item => {
        let addAdminId = item.split(':')[1];
        if (gInfo.adminids.indexOf(parseInt(addAdminId,10)) > -1) {
            res.r = 0;
            logger.debug('User: ', addAdminId, 'is already an admin');
    
            return res;
        }
        logger.debug('user logged in with uid: ', uid, 'and you want to add an admin: ', addAdminId);
        gInfo.adminids.push(parseInt(addAdminId,10));
    })
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('After add admin: ', gInfo);
    res.r = 1;

    return res;
};

/**
 * 删除管理员
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const delAdmin = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    // TODO:判断群是否已经销毁
    // TODO:判断群是否存在
    // TODO:先判断当前用户是否是管理员
    // TODO:判断是否是群主，群主必须是管理员,不能被删除
    // 判断被添加的用户是否是管理员成员
    const groupId = guid.split(':')[0];
    const delAdminId = guid.split(':')[1];
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to delete an admin: ', delAdminId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10))[0];
    logger.debug('read group info: ', gInfo);
    const adminids = gInfo.adminids;

    logger.debug('before delete admin memebers: ', gInfo.adminids);
    const index = adminids.indexOf(parseInt(delAdminId,10));
    if (index > -1) {
        adminids.splice(index, 1);
        gInfo.adminids = adminids;
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('after delete admin memmber: ', groupInfoBucket.get(gInfo.gid));

        

        res.r = 1;

        return res;
    } else {
        res.r = 0; // not an admin
        logger.debug('User: ', delAdminId, 'is not an admin');

        return res;
    }
};

/**
 * 剔除用户
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const delMember = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = guid.split(':')[0];
    const delId = guid.split(':')[1];
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to delete a member: ', delId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10));
    logger.debug('read group info: ', gInfo[0]);
    const members = gInfo[0].memberids;

    logger.debug('before delete memeber: ', gInfo[0].memberids);
    const index = members.indexOf(parseInt(delId,10));
    if (index > -1) {
        members.splice(index, 1);
        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(guid);
        logger.debug('delete user: ', delId, 'from groupUserLinkBucket');
    }

    gInfo[0].memberids = members;
    groupInfoBucket.put(gInfo[0].gid, gInfo[0]);
    logger.debug('after delete memmber: ', groupInfoBucket.get(gInfo[0].gid)[0]);

    res.r = 1;

    return res;
};

/**
 * 获取群组内的用户id
 * @param gid group id
 */
export const getGroupMembers = (gid: number): GroupMembers => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();

    const gm = new GroupMembers();
    const m = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    gm.members = m.memberids;

    return gm;
};

/**
 * 获取用户在群组内的信息
 * @param gid group id
 */
export const getGroupUserLink = (gid: number): GroupUserLinkArray => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();
    const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
    const gla = new GroupUserLinkArray();

    const m = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];

    for (let i = 0; i < m.memberids.length; i++) {
        const guid = `${gid}:${m.memberids[i]}`;
        gla.arr.push(groupUserLinkBucket.get(guid)[0]);
    }

    logger.debug('Get group user link: ', gla);

    return gla;
};

/**
 * 创建群
 * @param uid user id
 * 
 * 
 */
// #[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const accountGeneratorBucket = new Bucket('file', CONSTANT.ACCOUNT_GENERATOR_TABLE, dbMgr);

    if (uid !== undefined) {
        const gInfo = new GroupInfo();
        // 这是一个事务
        accountGeneratorBucket.readAndWrite(GENERATOR_TYPE.GROUP,(items:any[]) => {
            const accountGenerator = new AccountGenerator();
            accountGenerator.index = GENERATOR_TYPE.GROUP;
            accountGenerator.currentIndex = genNewIdFromOld(items[0].currentIndex);
            gInfo.gid = accountGenerator.currentIndex;

            return accountGenerator;
        });
        gInfo.name = groupInfo.name;
        gInfo.hid = genGroupHid(gInfo.gid);
        gInfo.note = groupInfo.note;
        gInfo.adminids = [uid];
        gInfo.annoceid = genAnnounceIncId(gInfo.gid, START_INDEX);
        gInfo.create_time = Date.now();
        gInfo.dissolve_time = 0;
        
        gInfo.join_method = 0;
        gInfo.ownerid = uid;
        // TODO: add self to memberids
        gInfo.memberids = [uid]; // add self to member
        gInfo.state = 0;
        gInfo.applyUser = [];

        logger.debug('create group: ', gInfo);

        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('read group info: ', groupInfoBucket.get(gInfo.gid));
        // 修改创建群的人的联系人列表，把当前群组加进去
        const contactBucket = getContactBucket();
        const contact = contactBucket.get<number, [Contact]>(uid)[0];
        contact.group.push(gInfo.gid);
        contactBucket.put(uid, contact);
        logger.debug('Add self: ', uid, 'to conatact group');
        // // 发送一条当前群组创建成功的消息，其实不是必须的
        const groupTopic = `ims/group/msg/${gInfo.gid}`;
        const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
        setMqttTopic(mqttServer, groupTopic, true, true);
        logger.debug('Set mqtt topic for group: ', gInfo.gid, 'with topic name: ', groupTopic);
        // 把创建群的任加入groupUserLink
        const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
        const gulink = new GroupUserLink();
        gulink.groupAlias = '';
        gulink.guid = genGuid(gInfo.gid,uid);
        gulink.hid = '';
        gulink.join_time = Date.now();
        gulink.userAlias = '';

        groupUserLinkBucket.put(gulink.guid, gulink);

        return gInfo;
    }
};

/**
 * 解散群
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const dissolveGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid);

    if (uid === gInfo[0].ownerid) {
        gInfo[0].state = 1;
        groupInfoBucket.put(gid, gInfo[0]);
        logger.debug('After group dissovled: ', groupInfoBucket.get(gid)[0]);

        res.r = 1;

        return res;
    }

    // TODO: delete group topic
};

export const getUid = () => {
    const dbMgr = getEnv().getDbMgr();
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });

    return parseInt(uid,10);
};
// ============ helpers =================

const getGroupUserLinkBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
};

const getGroupInfoBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return  new Bucket('file', CONSTANT.GROUP_INFO_TABLE, dbMgr);
};

const getContactBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.CONTACT_TABLE, dbMgr);
};

const getCurrentUserInfo = (uid?:number):UserInfo => {
    const currentUid = uid || getUid();
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE, dbMgr);

    return userInfoBucket.get(currentUid)[0];
};