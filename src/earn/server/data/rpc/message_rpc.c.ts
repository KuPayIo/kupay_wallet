
import {cfgMgr} from "../../../../pi/util/cfg";
import {Entrance} from "../../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("earn/server/data/rpc/message.getUserHistoryCursor", new Map<string,string>([["rpc","rpcServer"]]))],[1, _$c("earn/server/data/rpc/message.getUserHistoryCursor", new Map<string,string>([["rpc","rpcServer"]]))],[2, _$c("earn/server/data/rpc/message.sendGroupMessage", new Map<string,string>([["rpc","rpcServer"]]))],[3, _$c("earn/server/data/rpc/message.sendUserMessage", new Map<string,string>([["rpc","rpcServer"]]))],[4, _$c("earn/server/data/rpc/message.isUserOnline", new Map<string,string>([["rpc","rpcServer"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));