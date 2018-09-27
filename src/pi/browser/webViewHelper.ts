import { NativeObject, registerSign, ParamType } from "./native";

export class WebViewHelper extends NativeObject {
    public open(param: any) {
        this.call("openNewWebView",param)
    }
}


/**
 * 注册方法名和参数-->新开一个WebView
 */
registerSign(WebViewHelper, {
    openNewWebView: [{
        name: "loadUrl",
        type: ParamType.String
    },{
    name: "title",
    type: ParamType.String 
    }]
});