import { gotoGameService, gotoOfficialGroupChat, gotoRecharge, inviteFriends } from '../api/thirdBase';
import { addThirdPushListener } from '../postMessage/thirdPush';
import { ThirdCmd } from '../publicLib/interface';

/**
 * 三方逻辑
 */

addThirdPushListener(ThirdCmd.INVITE,inviteFriends);                              // 注册邀请好友事件
addThirdPushListener(ThirdCmd.RECHARGE,gotoRecharge);                             // 注册充值事件
addThirdPushListener(ThirdCmd.GAMESERVICE,gotoGameService);                       // 注册游戏客服事件
addThirdPushListener(ThirdCmd.OFFICIALGROUPCHAT,gotoOfficialGroupChat);           // 注册官方群聊事件