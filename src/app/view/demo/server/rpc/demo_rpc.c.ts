
import {cfgMgr} from "../../../../../pi/util/cfg";
import {Entrance} from "../../../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("app/view/demo/server/rpc/demo.demoSetUserInfo", new Map<string,string>([["rpc","rpcServer"]]))],[1, _$c("app/view/demo/server/rpc/demo.demoGetUserInfo", new Map<string,string>([["rpc","rpcServer"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));