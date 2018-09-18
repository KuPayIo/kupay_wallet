declare var pi_modules;

import {BonBuffer} from "../util/bon";
import {Struct, StructMgr} from "./struct_mgr"

export const rigisterStruct = (structMgr: StructMgr) => {
    for(var id in pi_modules){
        if(pi_modules.hasOwnProperty(id) && pi_modules[id].exports){
            for(var kk in pi_modules[id].exports){
                var c = pi_modules[id].exports[kk];
                if(Struct.isPrototypeOf(c) && c._$info){
                    //console.log(c._$info);
                    structMgr.register(c._$info.name_hash, c, c._$info.name);
                }
            }
        }
    }
}

export const writeBon = (o: Struct, bb: BonBuffer) => {
    bb.writeCt(o, () => {
        let h = (<any>o.constructor)._$info.name_hash;
        bb.writeU32(h);//写类型hash
        o.bonEncode(bb);
    });
}

//写入一个数组
export const writeArray = (o: Array<any>, bb: BonBuffer) => {
    bb.writeCt(o, () => {
        bb.writeU32(2);//数组类型
        bb.writeArray(o, (el) => {
            write(el, bb);
        });
    });
}

export const writeMap = (o: Map<any, any>, bb: BonBuffer) => {
    bb.writeCt(o, () => {
        bb.writeU32(3);//map类型
        bb.writeMap(o, (k, v) => {
            write(k, bb);
            write(v, bb);
        });
    });
}

export const write = (o: any, bb: BonBuffer) => {
    if(!o){
        bb.writeNil();
    }else if(Object.prototype.toString.call(o)=='[object Array]'){
        writeArray(o, bb);
    }else if(o instanceof Map){
        writeMap(o, bb)
    }else if(o instanceof Struct){
        writeBon(o, bb)
    }else{
        bb.write(o);
    }
}

export const read = (bb: BonBuffer, mgr: StructMgr): any => {
    return bb.read((b, t): any => {
        if(t === 2){
            return b.readArray(() => {
                return read(b, mgr);
            });
        }else if(t === 3){
            return b.readMap(() => {
                return [read(b, mgr), read(b, mgr)]
            });
        }else{
            let c = mgr.lookup(t).construct; //必须保证mgr中存在该类型的元信息;
            let r = bb.readBonCode(c);
            return r;
        }
    });
}