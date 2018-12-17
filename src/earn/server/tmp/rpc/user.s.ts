
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class WalletLoginReq extends Struct {

    openid: string;
    sign: string;
	static _$info =  new StructInfo("earn/server/tmp/rpc/user.WalletLoginReq",735267780, null, [new FieldInfo("openid", 
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


export class LoginReply extends Struct {

    status: number;
	static _$info =  new StructInfo("earn/server/tmp/rpc/user.LoginReply",2531371234, null, [new FieldInfo("status", 
new EnumType( Type.U8 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.status = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.status);
        
	}
}


export class LoginReq extends Struct {

    uid: number;
	static _$info =  new StructInfo("earn/server/tmp/rpc/user.LoginReq",3861294067, null, [new FieldInfo("uid", 
new EnumType( Type.U32 ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
        
	}
}


export enum UserType_Enum{DEF = 1,WALLET = 2
}
export class UserType extends Struct{
    enum_type: UserType_Enum;
    value: LoginReq | WalletLoginReq;

    static _$info = new EnumInfo('earn/server/tmp/rpc/user.UserType', 3032162812, null,  [
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
