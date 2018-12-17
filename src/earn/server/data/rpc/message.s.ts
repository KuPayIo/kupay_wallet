
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";
import { MSG_TYPE } from "../db/message.s";

export class AnnounceSend extends Struct {

    gid: number;
    mtype: MSG_TYPE;
    msg: string;
    time: number;
	static _$info =  new StructInfo("earn/server/data/rpc/message.AnnounceSend",2282912972, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("mtype", 
new EnumType( Type.U8 ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.Usize ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.gid = bb.readInt();
		this.mtype = bb.readInt() as MSG_TYPE;
		this.msg = bb.readUtf8();
		this.time = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeInt(this.mtype);        
        bb.writeUtf8(this.msg);
                
        bb.writeInt(this.time);
        
	}
}


export class UserSend extends Struct {

    rid: number;
    mtype: MSG_TYPE;
    msg: string;
    time: number;
	static _$info =  new StructInfo("earn/server/data/rpc/message.UserSend",1583000141, null, [new FieldInfo("rid", 
new EnumType( Type.U32 ), null), new FieldInfo("mtype", 
new EnumType( Type.U8 ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.Usize ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.rid = bb.readInt();
		this.mtype = bb.readInt() as MSG_TYPE;
		this.msg = bb.readUtf8();
		this.time = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.rid);
                
        bb.writeInt(this.mtype);        
        bb.writeUtf8(this.msg);
                
        bb.writeInt(this.time);
        
	}
}


export class GroupSend extends Struct {

    gid: number;
    mtype: MSG_TYPE;
    msg: string;
    time: number;
	static _$info =  new StructInfo("earn/server/data/rpc/message.GroupSend",2663809830, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("mtype", 
new EnumType( Type.U8 ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.Usize ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.gid = bb.readInt();
		this.mtype = bb.readInt() as MSG_TYPE;
		this.msg = bb.readUtf8();
		this.time = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeInt(this.mtype);        
        bb.writeUtf8(this.msg);
                
        bb.writeInt(this.time);
        
	}
}

