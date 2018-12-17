
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export const isRateAward = (id:number):boolean => {
	return (id/100000|0) == 4;
}

export const isWeightAward = (id:number):boolean => {
	return (id/100000|0) == 3;
}

export const isAverageAward = (id:number):boolean => {
	return (id/100000|0) == 2;
}

export class AverageAwardCfg extends Struct {

	readonly id: number;
	readonly prop: number;
	readonly min: number;
	readonly max: number;
	readonly count: number;
	readonly limit: number;
	static _$info =  new StructInfo("earn/server/tmp/cfg/award.AverageAwardCfg",1042739834,  new Map( [["db","memory"],["readonly","true"],["primary","id"]]), [new FieldInfo("id", 
new EnumType( Type.U32 ), null), new FieldInfo("prop", 
new EnumType( Type.U32 ), null), new FieldInfo("min", 
new EnumType( Type.U32 ), null), new FieldInfo("max", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null), new FieldInfo("limit", 
new EnumType( Type.U32 ), null) ]);

	constructor(id?: number,prop?: number,min?: number,max?: number,count?: number,limit?: number, old?: AverageAwardCfg){
		super();
		if(!old){
			this.id = id;
			this.prop = prop;
			this.min = min;
			this.max = max;
			this.count = count;
			this.limit = limit;
		}else{
			this.id = id === undefined? old.id:id;
			this.prop = prop === undefined? old.prop:prop;
			this.min = min === undefined? old.min:min;
			this.max = max === undefined? old.max:max;
			this.count = count === undefined? old.count:count;
			this.limit = limit === undefined? old.limit:limit;
		}
	}

	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
	}




	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.id);
                
        bb.writeInt(this.prop);
                
        bb.writeInt(this.min);
                
        bb.writeInt(this.max);
                
        bb.writeInt(this.count);
                
        bb.writeInt(this.limit);
        
	}
}


export class WeightAwardCfg extends Struct {

	readonly id: number;
	readonly prop: number;
	readonly min: number;
	readonly max: number;
	readonly count: number;
	readonly limit: number;
	readonly weight: number;
	static _$info =  new StructInfo("earn/server/tmp/cfg/award.WeightAwardCfg",621955944,  new Map( [["db","memory"],["readonly","true"],["primary","id"]]), [new FieldInfo("id", 
new EnumType( Type.U32 ), null), new FieldInfo("prop", 
new EnumType( Type.U32 ), null), new FieldInfo("min", 
new EnumType( Type.U32 ), null), new FieldInfo("max", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null), new FieldInfo("limit", 
new EnumType( Type.U32 ), null), new FieldInfo("weight", 
new EnumType( Type.U32 ), null) ]);

	constructor(id?: number,prop?: number,min?: number,max?: number,count?: number,limit?: number,weight?: number, old?: WeightAwardCfg){
		super();
		if(!old){
			this.id = id;
			this.prop = prop;
			this.min = min;
			this.max = max;
			this.count = count;
			this.limit = limit;
			this.weight = weight;
		}else{
			this.id = id === undefined? old.id:id;
			this.prop = prop === undefined? old.prop:prop;
			this.min = min === undefined? old.min:min;
			this.max = max === undefined? old.max:max;
			this.count = count === undefined? old.count:count;
			this.limit = limit === undefined? old.limit:limit;
			this.weight = weight === undefined? old.weight:weight;
		}
	}

	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
	}




	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.id);
                
        bb.writeInt(this.prop);
                
        bb.writeInt(this.min);
                
        bb.writeInt(this.max);
                
        bb.writeInt(this.count);
                
        bb.writeInt(this.limit);
                
        bb.writeInt(this.weight);
        
	}
}


export class RateAwardCfg extends Struct {

	readonly id: number;
	readonly prop: number;
	readonly min: number;
	readonly max: number;
	readonly count: number;
	readonly rate: number;
	static _$info =  new StructInfo("earn/server/tmp/cfg/award.RateAwardCfg",495966380,  new Map( [["db","memory"],["readonly","true"],["primary","id"]]), [new FieldInfo("id", 
new EnumType( Type.U32 ), null), new FieldInfo("prop", 
new EnumType( Type.U32 ), null), new FieldInfo("min", 
new EnumType( Type.U32 ), null), new FieldInfo("max", 
new EnumType( Type.U32 ), null), new FieldInfo("count", 
new EnumType( Type.U32 ), null), new FieldInfo("rate", 
new EnumType( Type.U32 ), null) ]);

	constructor(id?: number,prop?: number,min?: number,max?: number,count?: number,rate?: number, old?: RateAwardCfg){
		super();
		if(!old){
			this.id = id;
			this.prop = prop;
			this.min = min;
			this.max = max;
			this.count = count;
			this.rate = rate;
		}else{
			this.id = id === undefined? old.id:id;
			this.prop = prop === undefined? old.prop:prop;
			this.min = min === undefined? old.min:min;
			this.max = max === undefined? old.max:max;
			this.count = count === undefined? old.count:count;
			this.rate = rate === undefined? old.rate:rate;
		}
	}

	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
	}




	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.id);
                
        bb.writeInt(this.prop);
                
        bb.writeInt(this.min);
                
        bb.writeInt(this.max);
                
        bb.writeInt(this.count);
                
        bb.writeInt(this.rate);
        
	}
}

