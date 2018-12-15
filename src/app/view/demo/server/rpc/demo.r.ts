/**
 * 设置用户信息和获取用户信息
 */
// =============================================== 导入
import {DemoUserInfo} from "../data/demo.s";
import {Result} from "./demo.s";
import { Bucket } from '../../../../../chat/utils/db';
import { getEnv } from '../../../../../pi_pt/net/rpc_server';
import * as CONSTANT from "../data/constant";
// =============================================== 导出
// #[rpc=rpcServer]
export const demoSetUserInfo = (info:DemoUserInfo):Result => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.DEMO_USER_INFO_TABLE,dbMgr);
    let demoInfo = new DemoUserInfo();
    demoInfo.id = info.id;
    demoInfo.name = info.name;
    userInfoBucket.put(demoInfo.id, demoInfo);
    let r = new Result();
    r.r = 1;
    
    return r;
}

// #[rpc=rpcServer]
export const demoGetUserInfo = (id:number):DemoUserInfo => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.DEMO_USER_INFO_TABLE,dbMgr);

    return userInfoBucket.get(id)[0]
}