/**
 * 大整数的工具类
 */
import * as bigInt from './biginteger';

// 将大整数转化为ArrayBuffer
export const u64ToBuffer = (n: bigInt.BigInteger, littleEnd?: boolean): Uint8Array => {
    let i = 0;
    if (littleEnd) {
        const arr = new Uint32Array(2);// 小端序
        while (!n.isZero()) {
            const r = n.divmod(4294967296);
            arr[i] = (<any>r.remainder).value;
            n = r.quotient;
            i++;
        }

        return new Uint8Array(arr.buffer);
    } else {
        const buf = new ArrayBuffer(8);
        const view = new DataView(buf);
        while (!n.isZero()) {
            const r = n.divmod(4294967296);
            view.setUint32(i * 4, (<any>r.remainder).value);
            n = r.quotient;
            i++;
        }

        return new Uint8Array(buf);
    }
};

// 将大整数转化为ArrayBuffer
export const u128ToBuffer = (n: bigInt.BigInteger, littleEnd?: boolean): Uint8Array => {
    let i = 0;
    if (littleEnd) {
        const arr = new Uint32Array(4);// 小端序
        while (!n.isZero()) {
            const r = n.divmod(4294967296);
            arr[i] = (<any>r.remainder).value;
            n = r.quotient;
            i++;
        }

        return new Uint8Array(arr.buffer);
    } else {
        const buf = new ArrayBuffer(16);
        const view = new DataView(buf);
        while (!n.isZero()) {
            const r = n.divmod(4294967296);
            view.setUint32(i * 4, (<any>r.remainder).value);
            n = r.quotient;
            i++;
        }

        return new Uint8Array(buf);
    }
};

export const bufferToU64 = (buf: Uint8Array, littleEnd?: boolean): bigInt.BigInteger => {
    const i = 0;
    if (littleEnd) {
        const arr = new Uint32Array(buf.buffer);// 小端序

        return bigInt(arr[1]).multiply(0x100000000).add(bigInt(arr[0]));
    } else {
        const view = new DataView(buf.buffer);

        return bigInt(view.getUint32(0)).multiply(bigInt(0x100000000)).add(bigInt(view.getUint32(4)));
    }
};

export const bufferToU128 = (buf: Uint8Array, littleEnd?: boolean): bigInt.BigInteger => {
    const i = 0;
    if (littleEnd) {
        const arr = new Uint32Array(buf.buffer);// 小端序

        // tslint:disable-next-line:max-line-length
        return bigInt(arr[3]).multiply(bigInt('0x1000000000000000000000000').add(bigInt(arr[2]).multiply(bigInt('0x10000000000000000')))).add(bigInt(arr[1]).multiply(bigInt('0x100000000'))).add(bigInt(arr[0]));
    } else {
        const view = new DataView(buf.buffer);

        // tslint:disable-next-line:max-line-length
        return bigInt(view.getUint32(0)).multiply(bigInt('0x1000000000000000000000000').add(bigInt(view.getUint32(4)).multiply(bigInt('0x10000000000000000')))).add(bigInt(view.getUint32(8)).multiply(bigInt('0x100000000'))).add(bigInt(view.getUint32(12)));
    }
};

export const u64Unwrap = (v: bigInt.BigInteger): number | Uint8Array => {
    if (typeof (<any>v).value === 'number' && (<any>v).value <= 9007199254740992) {
        return (<any>v).value;
    } else {
        return u64ToBuffer(v, true);
    }
};

export const u128Unwrap = (v: bigInt.BigInteger): number | Uint8Array => {
    if (typeof (<any>v).value === 'number' && (<any>v).value <= 9007199254740992) {
        return (<any>v).value;
    } else {
        return u128ToBuffer(v, true);
    }
};

export const u64Merge = (v: number | Uint8Array): bigInt.BigInteger => {
    if (typeof v === 'number') {
        return bigInt(v);
    } else {
        return bufferToU64(v, true);
    }
};

export const u128Merge = (v: number | Uint8Array): bigInt.BigInteger => {
    if (typeof v === 'number') {
        return (<any>v).value;
    } else {
        return bufferToU128(v, true);
    }
};