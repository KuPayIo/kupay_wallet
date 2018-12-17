
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class AddressInfo extends Struct {

    uid: number;
    addr: string;
	static _$info =  new StructInfo("earn/server/data/db/extra.AddressInfo",172277425,  new Map( [["primary","uid"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("addr", 
new EnumType( Type.Str ), null) ]);


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
		this.addr = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeUtf8(this.addr);
        
	}
}

