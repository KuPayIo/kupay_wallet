
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class Test extends Struct {

    r: string;
	static _$info =  new StructInfo("earn/server/tmp/rpc/test.Test",247495545, null, [new FieldInfo("r", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.r = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.r);
        
	}
}

