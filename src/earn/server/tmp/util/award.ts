
/**
 * 这里处理冒险相关逻辑
 */
// ===================================================== 导入
import { RandomSeedMgr } from './randomSeedMgr';
import { isAverageAward, isRateAward, isWeightAward } from '../cfg/award.s';
// ===================================================== 导出

// 获取权重对应的位置
export function getWeightIndex(weights: number[], seed: number) {
    const rate = RandomSeedMgr.randomSeed(seed, 1, weights[weights.length - 1]);

    let i = 0;
    for (i = 0; i < weights.length; i++) {
        if (rate <= weights[i]) break;
    }

    return i;
}

// 是特殊奖励
export const isSpecialAward = (awardId: number) => {
    return isRateAward(awardId) || isWeightAward(awardId) || isAverageAward(awardId);
};

// ===================================================== 本地
// ===================================================== 立即执行
