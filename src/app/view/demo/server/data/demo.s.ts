
import { BonBuffer } from "../../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../../pi/struct/sinfo";

export class DemoUserInfo extends Struct {

    id: number;
    name: string;
	static _$info =  new StructInfo("app/view/demo/server/data/demo.DemoUserInfo",2335598058,  new Map( [["primary","id"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("id", 
new EnumType( Type.U32 ), null), new FieldInfo("name", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.id = bb.readInt();
		this.name = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.id);
                
        bb.writeUtf8(this.name);
        
	}
}

