// ========================= import 

import { NativeObject, registerSign, ParamType } from './native';

// ========================= export

export class caremaPicker extends NativeObject {
    public takePhoto(success:(width: number, height: number, base64: String)=>void) {
        this.call("takePhoto",{success});
    }
}

registerSign(caremaPicker, {
    takePhoto: []
});