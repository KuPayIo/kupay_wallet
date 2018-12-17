
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export enum MSG_TYPE{TXT=1,IMG=2,VOICE=3,VIDEO=4,RECALL=5,NOTICE=6,RENOTICE=7 }

export class UserMsg extends Struct {

    sid: number;
    mtype: MSG_TYPE;
    msg: string;
    time: number;
    send: boolean;
    read: boolean;
    cancel: boolean;
	static _$info =  new StructInfo("earn/server/data/db/message.UserMsg",2837087773, null, [new FieldInfo("sid", 
new EnumType( Type.U32 ), null), new FieldInfo("mtype", 
new EnumType( Type.U8 ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.Usize ), null), new FieldInfo("send", 
new EnumType( Type.Bool ), null), new FieldInfo("read", 
new EnumType( Type.Bool ), null), new FieldInfo("cancel", 
new EnumType( Type.Bool ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.sid = bb.readInt();
		this.mtype = bb.readInt() as MSG_TYPE;
		this.msg = bb.readUtf8();
		this.time = bb.readInt();
		this.send = bb.readBool();
		this.read = bb.readBool();
		this.cancel = bb.readBool();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.sid);
                
        bb.writeInt(this.mtype);        
        bb.writeUtf8(this.msg);
                
        bb.writeInt(this.time);
                
        bb.writeBool(this.send);
                
        bb.writeBool(this.read);
                
        bb.writeBool(this.cancel);
        
	}
}


export class GroupMsg extends Struct {

    sid: number;
    mtype: MSG_TYPE;
    msg: string;
    time: number;
    send: boolean;
    cancel: boolean;
	static _$info =  new StructInfo("earn/server/data/db/message.GroupMsg",576345906, null, [new FieldInfo("sid", 
new EnumType( Type.U32 ), null), new FieldInfo("mtype", 
new EnumType( Type.U8 ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.Usize ), null), new FieldInfo("send", 
new EnumType( Type.Bool ), null), new FieldInfo("cancel", 
new EnumType( Type.Bool ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.sid = bb.readInt();
		this.mtype = bb.readInt() as MSG_TYPE;
		this.msg = bb.readUtf8();
		this.time = bb.readInt();
		this.send = bb.readBool();
		this.cancel = bb.readBool();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.sid);
                
        bb.writeInt(this.mtype);        
        bb.writeUtf8(this.msg);
                
        bb.writeInt(this.time);
                
        bb.writeBool(this.send);
                
        bb.writeBool(this.cancel);
        
	}
}


export class Announcement extends Struct {

    sid: number;
    mtype: MSG_TYPE;
    msg: string;
    time: number;
    send: boolean;
    cancel: boolean;
	static _$info =  new StructInfo("earn/server/data/db/message.Announcement",3561787296, null, [new FieldInfo("sid", 
new EnumType( Type.U32 ), null), new FieldInfo("mtype", 
new EnumType( Type.U8 ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null), new FieldInfo("time", 
new EnumType( Type.Usize ), null), new FieldInfo("send", 
new EnumType( Type.Bool ), null), new FieldInfo("cancel", 
new EnumType( Type.Bool ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.sid = bb.readInt();
		this.mtype = bb.readInt() as MSG_TYPE;
		this.msg = bb.readUtf8();
		this.time = bb.readInt();
		this.send = bb.readBool();
		this.cancel = bb.readBool();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.sid);
                
        bb.writeInt(this.mtype);        
        bb.writeUtf8(this.msg);
                
        bb.writeInt(this.time);
                
        bb.writeBool(this.send);
                
        bb.writeBool(this.cancel);
        
	}
}


export class UserHistory extends Struct {

    hIncId: string;
    msg: UserMsg;
	static _$info =  new StructInfo("earn/server/data/db/message.UserHistory",425341758,  new Map( [["primary","hIncId"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("hIncId", 
new EnumType( Type.Str ), null), new FieldInfo("msg", 
new EnumType(Type.Struct, UserMsg._$info ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		this.msg && this.msg.addMeta(mgr);
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
		this.msg && this.msg.removeMeta();
	}



	bonDecode(bb:BonBuffer) {
		this.hIncId = bb.readUtf8();
		this.msg =  bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.msg):UserMsg);
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.hIncId);
                
        bb.writeBonCode(this.msg);
        
	}
}


export class GroupHistory extends Struct {

    hIncId: string;
    msg: GroupMsg;
	static _$info =  new StructInfo("earn/server/data/db/message.GroupHistory",3191629575,  new Map( [["primary","hIncId"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("hIncId", 
new EnumType( Type.Str ), null), new FieldInfo("msg", 
new EnumType(Type.Struct, GroupMsg._$info ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		this.msg && this.msg.addMeta(mgr);
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
		this.msg && this.msg.removeMeta();
	}



	bonDecode(bb:BonBuffer) {
		this.hIncId = bb.readUtf8();
		this.msg =  bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.msg):GroupMsg);
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.hIncId);
                
        bb.writeBonCode(this.msg);
        
	}
}


export class AnnounceHistory extends Struct {

    aIncId: string;
    announce: Announcement;
	static _$info =  new StructInfo("earn/server/data/db/message.AnnounceHistory",3870607504,  new Map( [["primary","aIncId"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("aIncId", 
new EnumType( Type.Str ), null), new FieldInfo("announce", 
new EnumType(Type.Struct, Announcement._$info ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		this.announce && this.announce.addMeta(mgr);
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
		this.announce && this.announce.removeMeta();
	}



	bonDecode(bb:BonBuffer) {
		this.aIncId = bb.readUtf8();
		this.announce =  bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.announce):Announcement);
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.aIncId);
                
        bb.writeBonCode(this.announce);
        
	}
}


export class MsgLock extends Struct {

    hid: string;
    current: number;
	static _$info =  new StructInfo("earn/server/data/db/message.MsgLock",2054755229,  new Map( [["primary","hid"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("hid", 
new EnumType( Type.Str ), null), new FieldInfo("current", 
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
		this.hid = bb.readUtf8();
		this.current = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.hid);
                
        bb.writeInt(this.current);
        
	}
}


export class UserHistoryCursor extends Struct {

    uuid: string;
    cursor: number;
	static _$info =  new StructInfo("earn/server/data/db/message.UserHistoryCursor",3885579548,  new Map( [["primary","uuid"],["db","file"]]), [new FieldInfo("uuid", 
new EnumType( Type.Str ), null), new FieldInfo("cursor", 
new EnumType( Type.I32 ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
	}



	bonDecode(bb:BonBuffer) {
		this.uuid = bb.readUtf8();
		this.cursor = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.uuid);
                
        bb.writeInt(this.cursor);
        
	}
}

