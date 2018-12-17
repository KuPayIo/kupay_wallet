
import {cfgMgr} from "../../../../pi/util/cfg";
import {Entrance} from "../../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("earn/server/data/rpc/net_close.close_connect", new Map<string,string>([["event","net_connect_close"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));