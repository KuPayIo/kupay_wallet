
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class Mine extends Struct {

    num: number;
    count: number;
    hps: Array<number>;
	static _$info =  new StructInfo("earn/server/tmp/db/item.Mine",4277577105, null, [new FieldInfo("num", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null), new FieldInfo("hps", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.num = bb.readInt();
		this.count = bb.readInt();
		this.hps = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.num);
                
        bb.writeInt(this.count);
                
        bb.writeArray(this.hps, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class Hoe extends Struct {

    num: number;
    count: number;
	static _$info =  new StructInfo("earn/server/tmp/db/item.Hoe",3686263453, null, [new FieldInfo("num", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.num = bb.readInt();
		this.count = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.num);
                
        bb.writeInt(this.count);
        
	}
}


export class BTC extends Struct {

    num: number;
    count: number;
	static _$info =  new StructInfo("earn/server/tmp/db/item.BTC",2023719504, null, [new FieldInfo("num", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.num = bb.readInt();
		this.count = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.num);
                
        bb.writeInt(this.count);
        
	}
}


export class ETH extends Struct {

    num: number;
    count: number;
	static _$info =  new StructInfo("earn/server/tmp/db/item.ETH",3469137383, null, [new FieldInfo("num", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.num = bb.readInt();
		this.count = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.num);
                
        bb.writeInt(this.count);
        
	}
}


export class ST extends Struct {

    num: number;
    count: number;
	static _$info =  new StructInfo("earn/server/tmp/db/item.ST",1831183959, null, [new FieldInfo("num", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.num = bb.readInt();
		this.count = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.num);
                
        bb.writeInt(this.count);
        
	}
}


export class KT extends Struct {

    num: number;
    count: number;
	static _$info =  new StructInfo("earn/server/tmp/db/item.KT",1431790546, null, [new FieldInfo("num", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.num = bb.readInt();
		this.count = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.num);
                
        bb.writeInt(this.count);
        
	}
}


export enum Item_Enum{MINE = 1,HOE = 2,BTC = 3,ETH = 4,ST = 5,KT = 6
}
export class Item extends Struct{
    enum_type: Item_Enum;
    value: Mine | Hoe | BTC | ETH | ST | KT;

    static _$info = new EnumInfo('earn/server/tmp/db/item.Item', 1383861672, null,  [
new EnumType(Type.Struct, Mine._$info ),
new EnumType(Type.Struct, Hoe._$info ),
new EnumType(Type.Struct, BTC._$info ),
new EnumType(Type.Struct, ETH._$info ),
new EnumType(Type.Struct, ST._$info ),
new EnumType(Type.Struct, KT._$info )]);

    constructor(type?: Item_Enum, value?: Mine | Hoe | BTC | ETH | ST | KT){
        super();
        this.enum_type = type;
        this.value = value;
    }

    bonEncode(bb: BonBuffer){
        bb.writeInt(this.enum_type);
        switch (this.enum_type){
            case 1:                
                bb.writeBonCode(this.value as Mine);
                
                break;
            case 2:                
                bb.writeBonCode(this.value as Hoe);
                
                break;
            case 3:                
                bb.writeBonCode(this.value as BTC);
                
                break;
            case 4:                
                bb.writeBonCode(this.value as ETH);
                
                break;
            case 5:                
                bb.writeBonCode(this.value as ST);
                
                break;
            case 6:                
                bb.writeBonCode(this.value as KT);
                
                break;
            default:
                throw new Error("bonEncode type error, A is not exist index:" + this.enum_type);
        }
    }

    bonDecode(bb: BonBuffer){
        let t = bb.readInt();
        this.enum_type = t;
        switch (t){
            case 1:
                this.value =  bb.readBonCode(Mine)
                break;
            case 2:
                this.value =  bb.readBonCode(Hoe)
                break;
            case 3:
                this.value =  bb.readBonCode(BTC)
                break;
            case 4:
                this.value =  bb.readBonCode(ETH)
                break;
            case 5:
                this.value =  bb.readBonCode(ST)
                break;
            case 6:
                this.value =  bb.readBonCode(KT)
                break;
            default:
                throw new Error("bonDecode type error, A is not exist index:" + t);
        }
    }

}

export class Items extends Struct {

    uid: number;
    item: Array<Item>;
	static _$info =  new StructInfo("earn/server/tmp/db/item.Items",3298110829,  new Map( [["primary","uid"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("item", 
new EnumType( Type.Arr, 
new EnumType( Type.Enum, Item._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.item = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.item):Item);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeArray(this.item, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class Prizes extends Struct {

    id: number;
    prize: Item;
    uid: number;
    src: string;
    time: number;
	static _$info =  new StructInfo("earn/server/tmp/db/item.Prizes",2127614748,  new Map( [["primary","id"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("id", 
new EnumType( Type.U32 ), null), new FieldInfo("prize", 
new EnumType( Type.Enum, Item._$info ), null), new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("src", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.id = bb.readInt();
		this.prize =  bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.prize):Item);
		this.uid = bb.readInt();
		this.src = bb.readUtf8();
		this.time = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.id);
                
        bb.writeBonCode(this.prize);
                
        bb.writeInt(this.uid);
                
        bb.writeUtf8(this.src);
                
        bb.writeInt(this.time);
        
	}
}

