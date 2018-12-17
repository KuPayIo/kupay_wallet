struct MemberIdArray{
    arr:&[u32]//用户id数组
}

struct GroupCreate{
    name:String,
    note:String
}

struct GroupAgree{
    gid:u32,//群组id
    uid:u32,//用户id
    agree:bool//是否同意
}

struct Invite{
    gid:u32,//群组
    rid:u32//接受邀请方
}

struct InviteArray{
    arr:&[Invite]//被邀请的用户数组
}

struct NotifyAdmin {
    uid: u32
}

struct GroupMembers {
    members: &[u32]
}

struct GuidsAdminArray{
    guids:&[String]//被添加的管理员数组
}