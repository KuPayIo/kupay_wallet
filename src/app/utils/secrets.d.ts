/**
 * 封装LZ4ASM模块
 */
export module secrets {

    const secrets;

    function random(skeyBits: number): string;
    function share(sKey, n, k): string[];
    function newShare(id, shares):string;
    function combine(secretKeys):string;

}

