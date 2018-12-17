#[path=../db/,enumc=SEXY]
use user.s::{UserInfo, FriendLink, SEXY};
#[path=../db/]
use group.s::{GroupInfo, GroupUserLink};
#[path=../db/]
use message.s::{GroupHistory, UserHistory, AnnounceHistory};

struct Result{
    r:u32//1代表成功，其他值都有特殊意义，需要后端提供一个映射表
}

struct UserRegister{
    name:String,
    passwdHash:String,
}

enum ORDER {
    INC = 0,//顺序
    DEC = 1,//逆序
}

struct MessageFragment{
    hid:String,//历史记录id
    from:u32,//开始条数,-1代表最近一条
    order:ORDER,//顺序还是逆序,一般是逆序
    size:u32,//总共取多少条
}

struct AnnouceFragment{
    aid:usize,//公告id
    from:u32,//开始条数,-1代表最近一条
    order:ORDER,//顺序还是逆序,一般是逆序
    size:u32,//总共取多少条
}

struct UserArray{
    arr:&[UserInfo]//用户信息表
}

struct GroupArray{
    arr:&[GroupInfo]//群组信息表
}

struct FriendLinkArray{
    arr:&[FriendLink]//好友链接表
}

struct GroupUserLinkArray{
    arr:&[GroupUserLink]//群组链接表
}

struct GroupHistoryArray{
    arr:&[GroupHistory]//群组历史记录表
}

struct UserHistoryArray{
    newMess:u32, // 新消息条数
    arr:&[UserHistory]//用户历史记录表
}

struct AnnounceHistoryArray{
    arr:&[AnnounceHistory]//公告表
}

struct GetUserInfoReq {
    uids: &[usize]
}

struct GetGroupInfoReq {
    gids: &[usize]
}

struct GetContactReq {
    uid: usize
}

struct GetFriendLinksReq {
    uuid: &[String]
}

struct LoginReq {
    uid: u32,
    passwdHash: String
}

struct WalletLoginReq {
    openid: String,
    sign: String
}

enum UserType {
    DEF(LoginReq),
    WALLET(WalletLoginReq),
}

struct LoginReply {
    status: u8
}

struct UserHistoryFlag {
    rid:u32, // 好友ID
    hIncId:String // 历史记录ID
}