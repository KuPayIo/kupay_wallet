/**
* 存储特定项目独有的数据结构
*/

/**
*用户的地址信息
*/
#[primary=uid,db=file,dbMonitor=true]
struct AddressInfo{
    uid: u32,//用户id,-1代表不存在
    addr: String//eth地址
}
