import { gotoGameService, gotoOfficialGroupChat, minWebview, openNewWebview } from '../api/thirdBase';
import { addThirdPushListener } from '../postMessage/thirdPush';
import { ThirdCmd } from '../publicLib/interface';

/**
 * 三方逻辑
 */
addThirdPushListener(ThirdCmd.MIN,(payload:{webviewName: string;popFloatBox:boolean}) => { minWebview(payload); });         // 最小化
addThirdPushListener(ThirdCmd.GAMESERVICE,(webviewName:string) => { gotoGameService(webviewName); });                       // 注册游戏客服事件
addThirdPushListener(ThirdCmd.OFFICIALGROUPCHAT,(webviewName:string) => { gotoOfficialGroupChat(webviewName); });           // 注册官方群聊事件
// tslint:disable-next-line:max-line-length
addThirdPushListener(ThirdCmd.OPENNEWWEBVIEW,(payload:{ webviewName: string;url:string;args:Object }) => { openNewWebview(payload); });   // 打开新webview         // 注册官方群聊事件