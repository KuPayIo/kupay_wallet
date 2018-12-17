
import {cfgMgr} from "../../../../pi/util/cfg";
import {Entrance} from "../../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("earn/server/tmp/rpc/test.award", new Map<string,string>([["rpc","rpcServer"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));