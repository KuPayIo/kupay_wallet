
struct WalletLoginReq {
    openid: String,
    sign: String
}

struct LoginReply {
    status: u8
}

struct LoginReq {
    uid: u32,
}

enum UserType {
    DEF(LoginReq),
    WALLET(WalletLoginReq),
}