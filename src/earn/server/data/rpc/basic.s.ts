
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";
import { UserInfo,FriendLink,SEXY } from "../db/user.s";
import { GroupInfo,GroupUserLink } from "../db/group.s";
import { GroupHistory,UserHistory,AnnounceHistory } from "../db/message.s";

export class Result extends Struct {

    r: number;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.Result",137283507, null, [new FieldInfo("r", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.r = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.r);
        
	}
}


export class UserRegister extends Struct {

    name: string;
    passwdHash: string;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.UserRegister",206086688, null, [new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("passwdHash", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.name = bb.readUtf8();
		this.passwdHash = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.name);
                
        bb.writeUtf8(this.passwdHash);
        
	}
}


export enum ORDER{INC=0,DEC=1 }

export class MessageFragment extends Struct {

    hid: string;
    from: number;
    order: ORDER;
    size: number;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.MessageFragment",440400444, null, [new FieldInfo("hid", 
new EnumType( Type.Str ), null), new FieldInfo("from", 
new EnumType( Type.U32 ), null), new FieldInfo("order", 
new EnumType( Type.U8 ), null), new FieldInfo("size", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.hid = bb.readUtf8();
		this.from = bb.readInt();
		this.order = bb.readInt() as ORDER;
		this.size = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.hid);
                
        bb.writeInt(this.from);
                
        bb.writeInt(this.order);        
        bb.writeInt(this.size);
        
	}
}


export class AnnouceFragment extends Struct {

    aid: number;
    from: number;
    order: ORDER;
    size: number;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.AnnouceFragment",1620616721, null, [new FieldInfo("aid", 
new EnumType( Type.Usize ), null), new FieldInfo("from", 
new EnumType( Type.U32 ), null), new FieldInfo("order", 
new EnumType( Type.U8 ), null), new FieldInfo("size", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.aid = bb.readInt();
		this.from = bb.readInt();
		this.order = bb.readInt() as ORDER;
		this.size = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.aid);
                
        bb.writeInt(this.from);
                
        bb.writeInt(this.order);        
        bb.writeInt(this.size);
        
	}
}


export class UserArray extends Struct {

    arr: Array<UserInfo>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.UserArray",3314358878, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, UserInfo._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):UserInfo);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class GroupArray extends Struct {

    arr: Array<GroupInfo>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GroupArray",3455647052, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, GroupInfo._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):GroupInfo);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class FriendLinkArray extends Struct {

    arr: Array<FriendLink>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.FriendLinkArray",3613887611, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, FriendLink._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):FriendLink);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class GroupUserLinkArray extends Struct {

    arr: Array<GroupUserLink>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GroupUserLinkArray",426912347, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, GroupUserLink._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):GroupUserLink);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class GroupHistoryArray extends Struct {

    arr: Array<GroupHistory>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GroupHistoryArray",3667754453, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, GroupHistory._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):GroupHistory);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class UserHistoryArray extends Struct {

    newMess: number;
    arr: Array<UserHistory>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.UserHistoryArray",4205730711, null, [new FieldInfo("newMess", 
new EnumType( Type.U32 ), null), new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, UserHistory._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.newMess = bb.readInt();
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):UserHistory);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.newMess);
                
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class AnnounceHistoryArray extends Struct {

    arr: Array<AnnounceHistory>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.AnnounceHistoryArray",1047372780, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, AnnounceHistory._$info ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):AnnounceHistory);
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class GetUserInfoReq extends Struct {

    uids: Array<number>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GetUserInfoReq",3399798775, null, [new FieldInfo("uids", 
new EnumType( Type.Arr, 
new EnumType( Type.Usize ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uids = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.uids, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GetGroupInfoReq extends Struct {

    gids: Array<number>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GetGroupInfoReq",3762220928, null, [new FieldInfo("gids", 
new EnumType( Type.Arr, 
new EnumType( Type.Usize ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.gids = bb.readArray(() => {
	return     bb.readInt();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.gids, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GetContactReq extends Struct {

    uid: number;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GetContactReq",2681321439, null, [new FieldInfo("uid", 
new EnumType( Type.Usize ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
        
	}
}


export class GetFriendLinksReq extends Struct {

    uuid: Array<string>;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.GetFriendLinksReq",996969944, null, [new FieldInfo("uuid", 
new EnumType( Type.Arr, 
new EnumType( Type.Str ) ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uuid = bb.readArray(() => {
	return     bb.readUtf8();
})
;
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.uuid, (el) => {    
            bb.writeUtf8(el);
            
        });
        
	}
}


export class LoginReq extends Struct {

    uid: number;
    passwdHash: string;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.LoginReq",1155692049, null, [new FieldInfo("uid", 
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


export class WalletLoginReq extends Struct {

    openid: string;
    sign: string;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.WalletLoginReq",3820559526, null, [new FieldInfo("openid", 
new EnumType( Type.Str ), null), new FieldInfo("sign", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.openid = bb.readUtf8();
		this.sign = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.openid);
                
        bb.writeUtf8(this.sign);
        
	}
}


export enum UserType_Enum{DEF = 1,WALLET = 2
}
export class UserType extends Struct{
    enum_type: UserType_Enum;
    value: LoginReq | WalletLoginReq;

    static _$info = new EnumInfo('earn/server/data/rpc/basic.UserType', 220963270, null,  [
new EnumType(Type.Struct, LoginReq._$info ),
new EnumType(Type.Struct, WalletLoginReq._$info )]);

    constructor(type?: UserType_Enum, value?: LoginReq | WalletLoginReq){
        super();
        this.enum_type = type;
        this.value = value;
    }

    bonEncode(bb: BonBuffer){
        bb.writeInt(this.enum_type);
        switch (this.enum_type){
            case 1:                
                bb.writeBonCode(this.value as LoginReq);
                
                break;
            case 2:                
                bb.writeBonCode(this.value as WalletLoginReq);
                
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
                this.value =  bb.readBonCode(LoginReq)
                break;
            case 2:
                this.value =  bb.readBonCode(WalletLoginReq)
                break;
            default:
                throw new Error("bonDecode type error, A is not exist index:" + t);
        }
    }

}

export class LoginReply extends Struct {

    status: number;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.LoginReply",1916408934, null, [new FieldInfo("status", 
new EnumType( Type.U8 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.status = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.status);
        
	}
}


export class UserHistoryFlag extends Struct {

    rid: number;
    hIncId: string;
	static _$info =  new StructInfo("earn/server/data/rpc/basic.UserHistoryFlag",4055182655, null, [new FieldInfo("rid", 
new EnumType( Type.U32 ), null), new FieldInfo("hIncId", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.rid = bb.readInt();
		this.hIncId = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.rid);
                
        bb.writeUtf8(this.hIncId);
        
	}
}

