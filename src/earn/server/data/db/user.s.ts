
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export enum SEXY{FAMALE=0,MALE=1 }

export enum GENERATOR_TYPE{USER="user",GROUP="group" }

export class UserInfo extends Struct {

    uid: number;
    name: string;
    avator: string;
    sex: number;
    tel: string;
    note: string;
	static _$info =  new StructInfo("earn/server/data/db/user.UserInfo",1556791355,  new Map( [["primary","uid"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("avator", 
new EnumType( Type.Str ), null), new FieldInfo("sex", 
new EnumType( Type.U32 ), null), new FieldInfo("tel", 
new EnumType( Type.Str ), null), new FieldInfo("note", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.name = bb.readUtf8();
		this.avator = bb.readUtf8();
		this.sex = bb.readInt();
		this.tel = bb.readUtf8();
		this.note = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeUtf8(this.name);
                
        bb.writeUtf8(this.avator);
                
        bb.writeInt(this.sex);
                
        bb.writeUtf8(this.tel);
                
        bb.writeUtf8(this.note);
        
	}
}


export class UserCredential extends Struct {

    uid: number;
    passwdHash: string;
	static _$info =  new StructInfo("earn/server/data/db/user.UserCredential",1306826458,  new Map( [["primary","uid"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("passwdHash", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.passwdHash = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeUtf8(this.passwdHash);
        
	}
}


export class UserAccount extends Struct {

    user: string;
    uid: number;
	static _$info =  new StructInfo("earn/server/data/db/user.UserAccount",3662233907,  new Map( [["primary","user"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("user", 
new EnumType( Type.Str ), null), new FieldInfo("uid", 
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
		this.user = bb.readUtf8();
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.user);
                
        bb.writeInt(this.uid);
        
	}
}


export class AccountGenerator extends Struct {

    index: string;
    currentIndex: number;
	static _$info =  new StructInfo("earn/server/data/db/user.AccountGenerator",1865020166,  new Map( [["primary","index"],["db","file"],["dbMonitor","true"],["hasmgr","false"]]), [new FieldInfo("index", 
new EnumType( Type.Str ), null), new FieldInfo("currentIndex", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.index = bb.readUtf8();
		this.currentIndex = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.index);
                
        bb.writeInt(this.currentIndex);
        
	}
}


export class FriendLink extends Struct {

    uuid: string;
    alias: string;
    hid: string;
	static _$info =  new StructInfo("earn/server/data/db/user.FriendLink",3047892176,  new Map( [["primary","uuid"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("uuid", 
new EnumType( Type.Str ), null), new FieldInfo("alias", 
new EnumType( Type.Str ), null), new FieldInfo("hid", 
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
		this.uuid = bb.readUtf8();
		this.alias = bb.readUtf8();
		this.hid = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.uuid);
                
        bb.writeUtf8(this.alias);
                
        bb.writeUtf8(this.hid);
        
	}
}


export class Contact extends Struct {

    uid: number;
    friends: Array<number>;
    temp_chat: Array<number>;
    group: Array<number>;
    applyUser: Array<number>;
    applyGroup: Array<number>;
    blackList: Array<number>;
	static _$info =  new StructInfo("earn/server/data/db/user.Contact",1802356745,  new Map( [["primary","uid"],["db","file"],["dbMonitor","true"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("friends", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("temp_chat", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("group", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("applyUser", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("applyGroup", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null), new FieldInfo("blackList", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);


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
		this.friends = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.temp_chat = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.group = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.applyUser = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.applyGroup = bb.readArray(() => {
	return     bb.readInt();
})
;
		this.blackList = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeArray(this.friends, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeArray(this.temp_chat, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeArray(this.group, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeArray(this.applyUser, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeArray(this.applyGroup, (el) => {    
            bb.writeInt(el);
            
        });
                
        bb.writeArray(this.blackList, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class OnlineUsers extends Struct {

    uid: number;
    sessionId: number;
	static _$info =  new StructInfo("earn/server/data/db/user.OnlineUsers",2157377170,  new Map( [["primary","uid"],["db","memory"]]), [new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("sessionId", 
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
		this.uid = bb.readInt();
		this.sessionId = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeInt(this.sessionId);
        
	}
}


export class OnlineUsersReverseIndex extends Struct {

    sessionId: number;
    uid: number;
	static _$info =  new StructInfo("earn/server/data/db/user.OnlineUsersReverseIndex",1153246951,  new Map( [["primary","sessionId"],["db","memory"]]), [new FieldInfo("sessionId", 
new EnumType( Type.U32 ), null), new FieldInfo("uid", 
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
		this.sessionId = bb.readInt();
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.sessionId);
                
        bb.writeInt(this.uid);
        
	}
}

