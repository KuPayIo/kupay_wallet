
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class UserAcc extends Struct {

    user: string;
    uid: number;
	static _$info =  new StructInfo("earn/server/tmp/db/user.UserAcc",2472313651,  new Map( [["primary","user"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("user", 
new EnumType( Type.Str ), null), new FieldInfo("uid", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.user = bb.readUtf8();
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.user);
                
        bb.writeInt(this.uid);
        
	}
}


export class UserInfo extends Struct {

    uid: number;
    name: string;
    avator: string;
    sex: number;
    tel: string;
    note: string;
	static _$info =  new StructInfo("earn/server/tmp/db/user.UserInfo",4214385472,  new Map( [["primary","uid"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("avator", 
new EnumType( Type.Str ), null), new FieldInfo("sex", 
new EnumType( Type.U32 ), null), new FieldInfo("tel", 
new EnumType( Type.Str ), null), new FieldInfo("note", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.name = bb.readUtf8();
		this.avator = bb.readUtf8();
		this.sex = bb.readInt();
		this.tel = bb.readUtf8();
		this.note = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeUtf8(this.name);
                
        bb.writeUtf8(this.avator);
                
        bb.writeInt(this.sex);
                
        bb.writeUtf8(this.tel);
                
        bb.writeUtf8(this.note);
        
	}
}


export class IDIndex extends Struct {

    index: string;
    id: number;
	static _$info =  new StructInfo("earn/server/tmp/db/user.IDIndex",3656997294,  new Map( [["primary","index"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("index", 
new EnumType( Type.Str ), null), new FieldInfo("id", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.index = bb.readUtf8();
		this.id = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.index);
                
        bb.writeInt(this.id);
        
	}
}


export class Online extends Struct {

    uid: number;
    session_id: number;
	static _$info =  new StructInfo("earn/server/tmp/db/user.Online",3845751654,  new Map( [["primary","uid"],["db","memory"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("session_id", 
new EnumType( Type.U32 ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
	}



	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.session_id = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeInt(this.session_id);
        
	}
}


export class OnlineMap extends Struct {

    session_id: number;
    uid: number;
	static _$info =  new StructInfo("earn/server/tmp/db/user.OnlineMap",771266447,  new Map( [["primary","session_id"],["db","memory"]]), [new FieldInfo("session_id", 
new EnumType( Type.U32 ), null), new FieldInfo("uid", 
new EnumType( Type.U32 ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
	}



	bonDecode(bb:BonBuffer) {
		this.session_id = bb.readInt();
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.session_id);
                
        bb.writeInt(this.uid);
        
	}
}

