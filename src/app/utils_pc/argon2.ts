/**
 * 
 */

import { Module } from './argon2-asm.min';
/**
 * 
 * @param password 口令
 * @param salt 盐
 * @param time 迭代次数{int}
 * @param memory 内存，单位为KB{int}
 * @param hashLen 计算结果的长度，单位：字节{int}
 * @param parallelism 并行数{int}
 * @param type Argon2d为0，Argon2i为1，Argon2id为2{int}
 * @return hash对应的16进制字符串 
 */
export const getArgonHash = (password: string = 'password', salt: string = 'somesalt', time = 1, memory = 1024
    , hashLen = 32, parallelism = 1, iType = 0): string => {

    // tslint:disable-next-line:prefer-array-literal
    const hash = Module.allocate(new Array(hashLen), 'i8', Module.ALLOC_NORMAL);

    const encodedLen = 512;
    // tslint:disable-next-line:prefer-array-literal
    const encoded = Module.allocate(new Array(encodedLen), 'i8', Module.ALLOC_NORMAL);

    const saltImpl = allocateArray(salt);
    const passwordImpl = allocateArray(password);

    let err;
    let res;
    try {
        const version = 0x13;
        res = Module._argon2_hash(time, memory, parallelism, passwordImpl, password.length,
            saltImpl, salt.length, hash, hashLen, encoded, encodedLen, iType, version);
    } catch (e) {
        err = e;
    }

    let result;
    if (res === 0 && !err) {
        const hashArr = [];
        for (let i = hash; i < hash + hashLen; i++) {
            hashArr.push(Module.HEAP8[i]);
        }
        result = hashArr.map(elem => (`0${(elem & 0xFF).toString(16)}`).slice(-2)).join('');
    } else {
        try {
            if (!err) {
                err = Module.Pointer_stringify(Module._argon2_error_message(res));
                throw new Error(err);
            }
        } catch (e) {
            throw new Error(`getArgonHash asm error = ${e.message}`);
        }
    }

    try {
        Module._free(passwordImpl);
        Module._free(saltImpl);
        Module._free(hash);
        Module._free(encoded);
    } catch (e) {
        throw new Error(`getArgonHash asm free error = ${e.message}`);
    }

    return result;
};

const allocateArray = strOrArr => {
    const arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr :
        Module.intArrayFromString(strOrArr);

    return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
};