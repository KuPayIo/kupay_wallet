import { addServerPushListener } from '../postMessage/serverPush';
import { ServerPushKey } from '../publicLib/interface';
import { balanceChange, forceOffline, payOk } from './localWallet';

/**
 * 服务器推送处理
 */

addServerPushListener(ServerPushKey.CMD,forceOffline);       // 踢人下线
addServerPushListener(ServerPushKey.EVENTPAYOK,payOk);       // 充值成功
addServerPushListener(ServerPushKey.ALTERBALANCEOK,balanceChange);  // 余额变化       