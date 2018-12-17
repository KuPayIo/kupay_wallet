/**
 * 这里处理冒险奖励逻辑
 */
// ===================================================== 导入
import { iterDb, read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { RandomSeedMgr } from './randomSeedMgr';
import { AverageAwardCfg, isAverageAward, isRateAward, isWeightAward, RateAwardCfg, WeightAwardCfg } from '../cfg/award.s';
import { MEMORY_NAME } from '../constant';
import { isSpecialAward, getWeightIndex } from './award';
// ===================================================== 导出
// 处理奖励
export const doAward = (awardId: number, seedMgr: RandomSeedMgr, awards: [number, number][]) => {
    // 计算奖励
    if (isRateAward(awardId)) {
        doRateAward(awardId, seedMgr, awards);
    } else if (isWeightAward(awardId)) {
        doWeightAward(awards, awardId, seedMgr);
    } else if (isAverageAward(awardId)) {
        doAverageAward(awards, awardId, seedMgr);
    }

};
// 添加奖励
export const addAward = (itemId: number, count: number, allAwards: [number, number][]) => {
    if (!itemId || !count) return;
    // 装备是不可叠加的，其他的可叠加
    const index = allAwards.findIndex(v => v[0] === itemId);
    if (index < 0) {
        allAwards.push([itemId, count]);
    } else {
        allAwards[index][1] += count;
    }
};

// ===================================================== 本地
// 处理几率奖励---万分率
const doRateAward = (awardId: number, seedMgr: RandomSeedMgr, awards: [number, number][]) => {
    const dbMgr = getEnv().getDbMgr();
    const specialAwards = [];
    read(dbMgr, (tr: Tr) => {
        let maxCount = 0;
        // 取几率奖励配置
        const iterCfg = iterDb(tr, MEMORY_NAME, RateAwardCfg._$info.name, awardId, false, null); // 取from表的迭代器
        do {
            const elCfg = iterCfg.nextElem();
            console.log('elCfg----------------read---------------', elCfg);
            if (!elCfg) return;
            const cfg: RateAwardCfg = elCfg[1];
            if (maxCount <= 0) maxCount = cfg.count;
            let hadAward = false;
            if (cfg.rate < 10000) {
                const index = RandomSeedMgr.randomSeed(seedMgr.seed, 0, 10000);
                if (index <= cfg.rate) {
                    hadAward = true;
                }
            } else {
                hadAward = true;
            }
            if (hadAward) {
                if (isSpecialAward(cfg.prop)) {
                    specialAwards.push(cfg.prop);
                } else {
                    const count = RandomSeedMgr.randomSeed(seedMgr.seed, cfg.min, cfg.max);
                    addAward(cfg.prop, count, awards);
                }
            }
            maxCount--;
        } while (maxCount > 0);
    });

    // 处理特殊奖励
    specialAwards.forEach(v => {
        doAward(v, seedMgr, awards);
    });

};

/**
 * 处理权重奖励
 * @param upBox 宝箱品质提升
 */
const doWeightAward = (awards: [number, number][], awardId: number, seedMgr: RandomSeedMgr) => {
    const dbMgr = getEnv().getDbMgr();
    const cfgs: WeightAwardCfg[] = [];
    const weights = [];
    let maxWeights = 0;
    read(dbMgr, (tr: Tr) => {
        let maxCount = 0;
        // 取权重奖励配置
        const iterCfg = iterDb(tr, MEMORY_NAME, WeightAwardCfg._$info.name, awardId, false, null); // 取from表的迭代器
        do {
            const elCfg = iterCfg.nextElem();
            console.log('elCfg----------------read---------------', elCfg);
            if (!elCfg) return;
            const cfg: WeightAwardCfg = elCfg[1];
            if (maxCount <= 0) maxCount = cfg.count;
            cfgs.push(cfg);
            maxWeights = cfg.weight + maxWeights;
            weights.push(maxWeights);
            maxCount--;
        } while (maxCount > 0);
    });

    const i = getWeightIndex(weights, seedMgr.seed);
    // 处理特殊奖励
    const cfg: WeightAwardCfg = cfgs[i];
    let prop = cfg.prop;
    if (isSpecialAward(prop)) {
        doAward(prop, seedMgr, awards);
    } else {
        const count = RandomSeedMgr.randomSeed(seedMgr.seed, cfg.min, cfg.max);
        addAward(prop, count, awards);
    }
};

// 处理平均奖励
const doAverageAward = (awards: [number, number][], awardId: number, seedMgr: RandomSeedMgr) => {
    const dbMgr = getEnv().getDbMgr();
    let cfg: AverageAwardCfg;
    read(dbMgr, (tr: Tr) => {
        // 取平均奖励配置
        const iterCfg = iterDb(tr, MEMORY_NAME, AverageAwardCfg._$info.name, awardId, false, null); // 取from表的迭代器
        const elCfg = iterCfg.nextElem();
        console.log('elCfg----------------read---------------', elCfg);
        if (!elCfg) return;
        const iCfg: AverageAwardCfg = elCfg[1];
        const index = RandomSeedMgr.randomSeed(seedMgr.seed, 1, iCfg.count);
        if (index === 1) {
            cfg = iCfg;
        } else {
            awardId = Math.floor(awardId / 100) * 100 + index;
            const iterCfg = iterDb(tr, MEMORY_NAME, AverageAwardCfg._$info.name, awardId, false, null); // 取from表的迭代器
            const elCfg = iterCfg.nextElem();
            console.log('elCfg----------------read---------------', elCfg);
            if (!elCfg) return;
            cfg = elCfg[1];
        }
    });

    // 处理特殊奖励
    if (isSpecialAward(cfg.prop)) {
        doAward(cfg.prop, seedMgr, awards);
    } else {
        const count = RandomSeedMgr.randomSeed(seedMgr.seed, cfg.min, cfg.max);
        addAward(cfg.prop, count, awards);
    }
};
// ===================================================== 立即执行
