#[path=../db/,enumc=MSG_TYPE]
use message.s::{MSG_TYPE};

struct AnnounceSend {
    gid: u32,//组id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: usize,//时间
}

struct UserSend {
    rid: u32,//接受者id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: usize,//时间
}

struct GroupSend {
    gid: u32,//组id
    mtype: MSG_TYPE,
    msg: String,//内容,可能是url
    time: usize,//时间
}
