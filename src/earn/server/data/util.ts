/**
 * 只有后端可以用的util
 */
import { iterDb, read } from '../../pi_pt/db';
import { Mgr, Tr } from '../../pi_pt/rust/pi_db/mgr';
import { WARE_NAME } from '../../server/data/constant';

/**
 * 用于测试的时候遍历表
 * @param dbMgr db manager
 * @param tableStruct table struct
 */
export const iterTable = (dbMgr:Mgr, tableStruct:any) => {
    read(dbMgr, (tr: Tr) => {
        console.log('login read---------------:');
        // 角色基础
        const iterBase = iterDb(tr, WARE_NAME, tableStruct._$info.name, null, false, null); // 取from表的迭代器
        let elBase = iterBase.nextElem();
        while (elBase) {
            console.log('elBase----------------read---------------', elBase);
            elBase = iterBase.nextElem();
        }
    });
};

