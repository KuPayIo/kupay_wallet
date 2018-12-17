
const isRateAward: String = "formula#(id:u32):bool#(id/100000|0) == 4";
const isWeightAward: String = "formula#(id:u32):bool#(id/100000|0) == 3";
const isAverageAward: String = "formula#(id:u32):bool#(id/100000|0) == 2";

#[db=memory,readonly=true,primary=id]struct AverageAwardCfg{ id: u32, prop: u32, min: u32, max: u32, count: u32, limit: u32, }

#[db=memory,readonly=true,primary=id]struct WeightAwardCfg{ id: u32, prop: u32, min: u32, max: u32, count: u32, limit: u32, weight: u32, }

#[db=memory,readonly=true,primary=id]struct RateAwardCfg{ id: u32, prop: u32, min: u32, max: u32, count: u32, rate: u32, }