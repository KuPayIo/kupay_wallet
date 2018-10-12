import {NativeObject, ParamType, registerSign} from "./native";

export class HttpHelper extends NativeObject {
    public getConnection(param: any) {
        this.call("openGetConnection", param);
    }

    public postConnection(param: any) {
        this.call("postGetConnection", param);
    }
}

registerSign(HttpHelper, {
    openGetConnection: [
        {
            name: "url",
            type: ParamType.String
        }
    ],
    postGetConnection: [
        {
            name: "url",
            type: ParamType.String
        },
        {
            name: "json",
            type: ParamType.String
        }
    ]
});