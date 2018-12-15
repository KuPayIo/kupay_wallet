
import { BonBuffer } from "../../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../../pi/struct/sinfo";

export class Result extends Struct {

    r: number;
	static _$info =  new StructInfo("app/view/demo/server/rpc/demo.Result",779022795, null, [new FieldInfo("r", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.r = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.r);
        
	}
}

