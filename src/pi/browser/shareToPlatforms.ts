import {NativeObject, ParamType, registerSign} from "./native";

export class ShareToPlatforms extends NativeObject {
    /**
     * 分享二维码图片
     * @param param
     */
    public shareQRCode(param: any) {
        this.call("shareQRCode", param);
    }
}

registerSign(ShareToPlatforms, {
    "shareQRCode": [{
        name: "content",
        type: ParamType.String
    }]
});