
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class MemberIdArray extends Struct {

    arr: Array<number>;
	static _$info =  new StructInfo("earn/server/data/rpc/group.MemberIdArray",611800930, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GroupCreate extends Struct {

    name: string;
    note: string;
	static _$info =  new StructInfo("earn/server/data/rpc/group.GroupCreate",2473535120, null, [new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("note", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.name = bb.readUtf8();
		this.note = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.name);
                
        bb.writeUtf8(this.note);
        
	}
}


export class GroupAgree extends Struct {

    gid: number;
    uid: number;
    agree: boolean;
	static _$info =  new StructInfo("earn/server/data/rpc/group.GroupAgree",605875537, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("agree", 
new EnumType( Type.Bool ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.gid = bb.readInt();
		this.uid = bb.readInt();
		this.agree = bb.readBool();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeInt(this.uid);
                
        bb.writeBool(this.agree);
        
	}
}


export class Invite extends Struct {

    gid: number;
    rid: number;
	static _$info =  new StructInfo("earn/server/data/rpc/group.Invite",4012426453, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("rid", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.gid = bb.readInt();
		this.rid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeInt(this.rid);
        
	}
}


export class InviteArray extends Struct {

    arr: Array<Invite>;
	static _$info =  new StructInfo("earn/server/data/rpc/group.InviteArray",2193687805, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, Invite._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):Invite);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class NotifyAdmin extends Struct {

    uid: number;
	static _$info =  new StructInfo("earn/server/data/rpc/group.NotifyAdmin",3790404326, null, [new FieldInfo("uid", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
        
	}
}


export class GroupMembers extends Struct {

    members: Array<number>;
	static _$info =  new StructInfo("earn/server/data/rpc/group.GroupMembers",3354764176, null, [new FieldInfo("members", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.members = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.members, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GuidsAdminArray extends Struct {

    guids: Array<string>;
	static _$info =  new StructInfo("earn/server/data/rpc/group.GuidsAdminArray",1247748426, null, [new FieldInfo("guids", 
new EnumType( Type.Arr, 
new EnumType( Type.Str ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.guids = bb.readArray(() => {
	return     bb.readUtf8();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.guids, (el) => {    
            bb.writeUtf8(el);
            
        });
        
	}
}

