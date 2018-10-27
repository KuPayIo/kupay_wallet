/**
 * 最终返回
 */
import { NativeObject, registerSign } from './native';

export class ExitApp extends NativeObject {
    public exitApplication(param: any) {
        this.call('confirmExit', param);
    }

    public ToHome(param: any) {
        this.call('backToHome', param);
    }
}

registerSign(ExitApp, {
    confirmExit: [],
    backToHome: []
});

// let exit = new ExitApp();
//         exit.init();
//         exit.exitApplication({
//             success: (result) => {

//             }
//             , fail: (result) => {

//             }
//         })