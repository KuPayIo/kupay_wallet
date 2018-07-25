/**
 * memory hash
 */
// todo 手机版需要移除该引用
// import { getArgonHash } from '../../app/utils_pc/argon2';
import { NativeObject, ParamType, registerSign } from './native';

export class ArgonHash extends NativeObject {
    /**
     * 从本地选择图片
     * @param param 参数
     */
    public calcHashValue(iParam: any, successF: Function, failF: Function) {
        const param = {
            success: successF,
            fail: failF,
            t: 1,
            m: 512 * 1024,
            p: 8,
            pwd: iParam.pwd || 'password',
            salt: iParam.salt || 'somesalt',
            type: 2,
            hashLen: 32
        };
        if (navigator.userAgent.indexOf('YINENG') < 0) {
            this.calcHashValueAtPc('getArgon2Hash', param);
        } else {
            this.call('getArgon2Hash', param);
        }

    }

    public async calcHashValuePromise(iParam: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.calcHashValue(iParam, (result) => {
                return resolve(result);
            }, (err) => {
                alert(`失败${err}`);

                return reject(err);
            });
        });
    }

    private calcHashValueAtPc(iType: string, param: any) {
        if (iType === 'getArgon2Hash') {
            setTimeout(() => {
                // todo 这里考虑使用worker进行处理
                const hash = getArgonHash(param.pwd, param.salt, param.t, param.m, param.hashLen, param.p, 1);
                param.success(hash);
            }, 1000);
        }
    }
}

registerSign(ArgonHash, {
    getArgon2Hash: [
        {
            name: 't',// 迭代次数
            type: ParamType.Number
        },
        {
            name: 'm',// 内存(单位是kb)
            type: ParamType.Number
        },
        {
            name: 'p',// 并行数量
            type: ParamType.Number
        },
        {
            name: 'pwd',// 密码
            type: ParamType.String
        },
        {
            name: 'salt',// 盐
            type: ParamType.String
        },
        {
            name: 'type',// 类型(有0 1 2可以选，一般传2)
            type: ParamType.Number
        },
        {
            name: 'hashLen',// 结果长度
            type: ParamType.Number
        }
    ]
});

/**
 * 这是测试
 */
const test = () => {
    const hash = new ArgonHash();
    hash.init();
    hash.calcHashValue({ pwd: 'password', salt: 'somesalt' }, (result) => {
        alert(`成功${result}`);
    }, (result) => {
        alert(`失败${result}`);
    });
};