/**
 * 描述了要定义的主题
 */

/**
 * 
 订阅表
 */

 /**
  * 
  * 订阅主题
ims/group/msg/_hid //特定群组的聊天主题
img/group/anounnce/_aid //特定群组的公告

news/暂无
  */

//

/**
 * 消息推送
 * 
 //申请加入群   
applyFriend  //别人申请添加当前用户为好友
acceptFriend //别人同意添加当前用户为好友
inviteJoin //别人邀请当前用户加入群
acceptJoin //群接受了当前用户的加入申请
 */   

//  $r

// 4种应用通讯方式:

// 1. rpc
// 2. 前端主动监听后端数据库变化
//     后端数据表允许监听->调用后端数据表的rpc监听接口->前端订阅后端数据表的变化->如果数据变化了更新store
// 3. 主题订阅
//   1. 订阅权限->标准是能订阅所有主题
//   2. 收到的消息进行了处理
// 4. 消息推送

// 4. =>rpc 都需要获取session信息

// public(topic,message)
// aaa(key,message);

//   rpc=>申请添加TM好友,发送成功
//   推送 =>{"applyFriend",{LB->TM}}
//   rpc=>同意添加LB为好友
//   推送=>{"acceptFriend",{TM->LB}}