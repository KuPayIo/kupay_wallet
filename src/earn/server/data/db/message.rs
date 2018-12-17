/**
*聊天信息表
*/


/**
*消息类型
*/
enum MSG_TYPE {
    TXT = 1,//文本
    IMG = 2,//图片
    VOICE = 3,//声音
    VIDEO = 4,//视频
    RECALL = 5,//撤回消息
    NOTICE = 6,//公告消息
    RENOTICE = 7,//撤回公告消息
}

/**
* 用户消息
*/
struct UserMsg {
    sid: u32,//发信人id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: usize,//时间
    send: bool,//是否发送
    read: bool,//是否已读
    cancel: bool,//是否撤回
}

/*
*群组消息
*/
struct GroupMsg {
    sid: u32,//发信人id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: usize,//时间
    send: bool,//是否发送
    cancel: bool,//是否撤回
}

/**
*群组公告
*/
struct Announcement {
    sid: u32,//发布者id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: usize,//时间
    send: bool,//是否发送
    cancel: bool,//是否撤销
}


/**
*用户历史记录
*/
#[primary=hIncId,db=file,dbMonitor=true]
struct UserHistory {
    hIncId: String,//"-1"代表不存在,历史记录的唯一id,"10001:111",前面代表hid后面代表index
    msg: UserMsg,
}

/**
*群组历史记录
*/
#[primary=hIncId,db=file,dbMonitor=true]
struct GroupHistory {
    hIncId: String,//历史记录的唯一id,"10001:111",前面代表hid后面代表index
    msg: GroupMsg,
}

/**
*所有公告
*/
#[primary=aIncId,db=file,dbMonitor=true]
struct AnnounceHistory {
    aIncId: String,//公告记录的唯一id,"10001:111",前面代表aid后面代表index
    announce: Announcement,
}

/**
*消息锁,用于消息和公告
*/
#[primary=hid,db=file,dbMonitor=true]
struct MsgLock {
    hid: String,//历史记录id,-1代表不存在
    current: u32,//当前消息锁编号
}

/**
*用户历史记录游标
*/
#[primary=uuid,db=file]
struct UserHistoryCursor {
    uuid: String,//两个用户的id"-1"代表不存在,"10001:10002",前面代表uid1后面代表uid2
    cursor: i32,//当前已推送给用户uid1的最大消息ID
}