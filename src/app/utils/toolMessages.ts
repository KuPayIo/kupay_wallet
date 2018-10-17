/**
 * 处理提示信息
 */
import { popNew } from '../../pi/ui/root';
import { getStaticLanguage } from './tools';

/**
 * 显示错误信息
 */
// tslint:disable-next-line:cyclomatic-complexity
export const showError = (result, str?) => {
    if (result === 1) return;
    if (!str) {
        switch (result) {
            case 600: str = getStaticLanguage().errorList[600]; break;
            case 701: str = getStaticLanguage().errorList[701];break;
            case 702: str = getStaticLanguage().errorList[702];break;
            case 703: str = getStaticLanguage().errorList[703];break;
            case 704: str = getStaticLanguage().errorList[704];break;
            case 705: str = getStaticLanguage().errorList[705];break;
            case 711: str = getStaticLanguage().errorList[711]; break;
            case 712: str = getStaticLanguage().errorList[712]; break;
            case 713: str = getStaticLanguage().errorList[713]; break;
            case 714: str = getStaticLanguage().errorList[714]; break;
            case 1001: str = getStaticLanguage().errorList[1001]; break;
            case 1002: str = getStaticLanguage().errorList[1002]; break;
            case 1003: str = getStaticLanguage().errorList[1003]; break;
            case 1004: str = getStaticLanguage().errorList[1004]; break;
            case 1005: str = getStaticLanguage().errorList[1005]; break;
            case 1006: str = getStaticLanguage().errorList[1006]; break;
            case 1007: str = getStaticLanguage().errorList[1007]; break;
            case 1008: str = getStaticLanguage().errorList[1008]; break;
            case 1009: str = getStaticLanguage().errorList[1009]; break;
            case 1010: str = getStaticLanguage().errorList[1010]; break;
            case 2001: str = getStaticLanguage().errorList[2001]; break;
            case 2010: str = getStaticLanguage().errorList[2010]; break;
            case 2020: str = getStaticLanguage().errorList[2020]; break;
            case 2021: str = getStaticLanguage().errorList[2021]; break;
            case 2022: str = getStaticLanguage().errorList[2022]; break;
            case 2023: str = getStaticLanguage().errorList[2023]; break;
            case 2024: str = getStaticLanguage().errorList[2024]; break;
            case 2025: str = getStaticLanguage().errorList[2025]; break;
            case 2030: str = getStaticLanguage().errorList[2030]; break;
            case 2031: str = getStaticLanguage().errorList[2031]; break;
            case 2032: str = getStaticLanguage().errorList[2032]; break;
            case 2033: str = getStaticLanguage().errorList[2033]; break;
            case -1: str = getStaticLanguage().errorList[-1]; break;
            case -2: str = getStaticLanguage().errorList[-2]; break;
            default: str = getStaticLanguage().errorList.default;
        }
    }

    popNew('app-components1-message-message', { content: str });
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
        case 'Invalid Mnemonic' : showStr = getStaticLanguage().transError[0];break;
        case 'insufficient funds for gas * price + value':showStr = getStaticLanguage().transError[1];break;
        case 'insufficient funds' : showStr = getStaticLanguage().transError[1];break;
        case 'intrinsic gas too low':showStr = getStaticLanguage().transError[2];break;
        default: showStr = err.message || getStaticLanguage().transError[3];
    }
    popNew('app-components1-message-message', { content: showStr });
};