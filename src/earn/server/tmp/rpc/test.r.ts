import { doAward } from '../util/award.t';
import { RandomSeedMgr } from '../util/randomSeedMgr';
import { randomInt } from '../../../pi/util/math';
import { Test } from './test.s';

// #[rpc=rpcServer]
export const award = (award: number): Test => {
    const seedMgr = new RandomSeedMgr(randomInt(1, 100));
    let v = []
    doAward(award, seedMgr, v);
    let t = new Test();
    t.r = v.join();
    return t
};