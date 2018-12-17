/**
 * 随机种子管理器
 * 种子随机算法---https://www.zhihu.com/question/22818104
 * @example
 */
// ===================================================== 导入

// ===================================================== 导出--类型
export class RandomSeedMgr {
    public static maxSeed: number = 233280;
    private _seed: number;

    // 构造函数
    constructor(seed: number) {
        this._seed = seed;

    }

    public get seed() {
        this.updateSeed();

        return this._seed;
    }

    // 用指定的种子，生成指定范围的随机数（随机值可以取到N1和N2）max 必须 大于 等于 min 
    public static randomSeed = (seed: number, min: number, max: number): number => {
        if (min > max) return 0;

        return Math.round(min + (max - min) * seed / RandomSeedMgr.maxSeed);
    }

    // 检查概率是否通过
    public static checkProbability = (probability: number, seed: number) => {
        return probability >= 1 || (probability >= seed / RandomSeedMgr.maxSeed);
    }
    // 当前种子
    public currentSeed() {
        return this._seed;
    }

    private updateSeed() {
        const seed = (this._seed * 9301 + 49297) % RandomSeedMgr.maxSeed;
        this._seed = seed < 0 ? seed + RandomSeedMgr.maxSeed : seed;
    }
}

// 线性求余算法
// var randNumber = (seed, max = 2147483647) => {
//     // 防止种子为0
//     var r = seed ^ 123459876;
//     // C语言的写法，可防止溢出
//     seed = 16807 * r - ((r / 127773) | 0) * max;
//     return seed < 0 ? seed + max : seed;
// };

// ===================================================== 导出--初始化