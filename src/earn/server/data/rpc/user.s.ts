
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class UserAgree extends Struct {

    uid: number;
    agree: boolean;
	static _$info =  new StructInfo("earn/server/data/rpc/user.UserAgree",1071012673, null, [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("agree", 
new EnumType( Type.Bool ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.agree = bb.readBool();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeBool(this.agree);
        
	}
}


export class FriendAlias extends Struct {

    rid: number;
    alias: string;
	static _$info =  new StructInfo("earn/server/data/rpc/user.FriendAlias",2913001303, null, [new FieldInfo("rid", 
new EnumType( Type.U32 ), null), new FieldInfo("alias", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.rid = bb.readInt();
		this.alias = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.rid);
                
        bb.writeUtf8(this.alias);
        
	}
}

