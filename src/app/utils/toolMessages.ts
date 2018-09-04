/**
 * 处理提示信息
 */
import { popNew } from '../../pi/ui/root';

/**
 * 显示错误信息
 */
// tslint:disable-next-line:cyclomatic-complexity
export const showError = (result, str?) => {
    if (result === 1) return;
    if (!str) {
        switch (result) {
            case 600: str = '数据库错误'; break;
            case 701: str = '红包不存在';break;
            case 702: str = '红包已领完';break;
            case 703: str = '红包已过期';break;
            case 704: str = '红包已领取';break;
            case 705: str = '余额不足';break;
            case 711: str = '兑换码不存在'; break;
            case 712: str = '兑换码已兑换'; break;
            case 713: str = '兑换码已过期'; break;
            case 714: str = '已兑换该红包'; break;
            case 1001: str = '用户名为空'; break;
            case 1002: str = '创建用户失败'; break;
            case 1003: str = '用户注册失败'; break;
            case 1004: str = '用户登录失败'; break;
            case 1005: str = '已注册'; break;
            case 1006: str = '权限验证错误'; break;
            case 1007: str = '用户已存在'; break;
            case 1008: str = '密保设置错误'; break;
            case 1009: str = '验证密保设置错误'; break;
            case 1010: str = '账号异常'; break;
            case 2001: str = '挖矿达到上限'; break;
            case 2010: str = '无法兑换自己的兑换码'; break;
            case 2020: str = '重复充值'; break;
            case 2021: str = '充值失败'; break;
            case 2022: str = '提现失败'; break;
            case 2023: str = '提现金额未达到下限'; break;
            case 2024: str = '提现失败(服务未初始化))'; break;
            case 2025: str = '提现金额达到上限'; break;
            case 2030: str = '购买理财产品失败'; break;
            case 2031: str = '出售理财产品失败'; break;
            case 2032: str = '已出售'; break;
            case 2033: str = '已售罄'; break;
            case -1: str = '无效的兑换码'; break;
            case -2: str = '你已经兑换了同类型的兑换码'; break;
            default: str = '出错啦';

        }
    }

    popNew('app-components-message-message', { content: str });
};

/**
 * 显示错误信息
 * @param err 错误对象
 */
export const doErrorShow = (err:Error) => {
    console.log('error',err);
    if (!err) return;
    let showStr = '';
    switch (err.message) {
        case 'Invalid Mnemonic' : showStr = '密码错误';break;
        case 'insufficient funds for gas * price + value':showStr = '余额不足';break;
        case 'insufficient funds' : showStr = '余额不足';break;
        case 'intrinsic gas too low':showStr = 'gas过低';break;
        default: showStr = err.message || '出错啦';
    }
    popNew('app-components-message-message', { content: showStr });
};