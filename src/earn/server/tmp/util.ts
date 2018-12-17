/**
 * 只有后端可以用的util
 */
import { getEnv } from '../../pi_pt/net/rpc_server';
import { Bucket } from '../../utils/db';
import * as CONSTANT from './constant';
import { IDIndex } from './db/user.s';


//获取唯一ID
export const get_index_id = (index:string) => {
    const dbMgr = getEnv().getDbMgr();
    const IndexIDBucket = new Bucket('file', CONSTANT.ID_INDEX_TABLE, dbMgr);
    let r = new IDIndex();
    IndexIDBucket.readAndWrite(index,(v) => {
        r.index = index;
        if(!v[0]){
            r.id=1
        }else{
            r.id=v[0].id + 1
        }
        return r;
    }); 
    return r.id
};
