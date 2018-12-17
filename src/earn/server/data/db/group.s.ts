
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export enum GROUP_STATE{CREATED=0,DISSOLVE=1 }

export enum JOIN_METHOD{USER_APPLY=0,MEMBER_INVITE=1 }

export class GroupInfo extends Struct {

    gid: number;
    name: string;
    ownerid: number;
    adminids: Array<number>;
    memberids: Array<number>;
    annoceid: string;
    hid: string;
    create_time: number;
    dissolve_time: number;
    join_method: JOIN_METHOD;
    note: string;
    state: GROUP_STATE;
    applyUser: Array<number>;
	static _$info =  new StructInfo("earn/server/data/db/group.GroupInfo",2424135214,  new Map( [["primary","gid"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("ownerid", 
new EnumType( Type.U32 ), null), new FieldInfo("adminids", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("memberids", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("annoceid", 
new EnumType( Type.Str ), null), new FieldInfo("hid", 
new EnumType( Type.Str ), null), new FieldInfo("create_time", 
new EnumType( Type.U32 ), null), new FieldInfo("dissolve_time", 
new EnumType( Type.U32 ), null), new FieldInfo("join_method", 
new EnumType( Type.U8 ), null), new FieldInfo("note", 
new EnumType( Type.Str ), null), new FieldInfo("state", 
new EnumType( Type.U8 ), null), new FieldInfo("applyUser", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.gid = bb.readInt();
		this.name = bb.readUtf8();
		this.ownerid = bb.readInt();
		this.adminids = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.memberids = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.annoceid = bb.readUtf8();
		this.hid = bb.readUtf8();
		this.create_time = bb.readInt();
		this.dissolve_time = bb.readInt();
		this.join_method = bb.readInt() as JOIN_METHOD;
		this.note = bb.readUtf8();
		this.state = bb.readInt() as GROUP_STATE;
		this.applyUser = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeUtf8(this.name);
                
        bb.writeInt(this.ownerid);
                
        bb.writeArray(this.adminids, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeArray(this.memberids, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeUtf8(this.annoceid);
                
        bb.writeUtf8(this.hid);
                
        bb.writeInt(this.create_time);
                
        bb.writeInt(this.dissolve_time);
                
        bb.writeInt(this.join_method);        
        bb.writeUtf8(this.note);
                
        bb.writeInt(this.state);        
        bb.writeArray(this.applyUser, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GroupUserLink extends Struct {

    guid: string;
    groupAlias: string;
    userAlias: string;
    hid: string;
    join_time: number;
	static _$info =  new StructInfo("earn/server/data/db/group.GroupUserLink",2955888927,  new Map( [["primary","guid"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("guid", 
new EnumType( Type.Str ), null), new FieldInfo("groupAlias", 
new EnumType( Type.Str ), null), new FieldInfo("userAlias", 
new EnumType( Type.Str ), null), new FieldInfo("hid", 
new EnumType( Type.Str ), null), new FieldInfo("join_time", 
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
		this.guid = bb.readUtf8();
		this.groupAlias = bb.readUtf8();
		this.userAlias = bb.readUtf8();
		this.hid = bb.readUtf8();
		this.join_time = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.guid);
                
        bb.writeUtf8(this.groupAlias);
                
        bb.writeUtf8(this.userAlias);
                
        bb.writeUtf8(this.hid);
                
        bb.writeInt(this.join_time);
        
	}
}

