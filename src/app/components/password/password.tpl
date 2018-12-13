<div>
    <div w-class="pswInput" ev-input-change="pswChange" ev-input-blur="pswBlur()" ev-input-focus="iconChange()">
        <div style="flex: 1;height: 100%;">
            {{if it.placeHolder}}
                {{: placeHolder = it.placeHolder }}
            {{else}}
                {{: placeHolder = {"zh_Hans":"密码","zh_Hant":"密碼","en":""} }}
            {{end}}
            <app-components1-input-input>{itype:"password",placeHolder:{{placeHolder}},input:{{it.password}} }</app-components1-input-input>
        </div>
        {{if it.isSuccess}}
        <img src="../../res/image/icon_right2.png" w-class="successPic"/>
        {{elseif it.showIcon}}
        <img src="../../res/image/fail.png" w-class="successPic" on-tap="clear"/>
        {{end}}
    </div>

    <div w-class="pseRank-line" style="display: flex;flex: 3;">
        <div w-class="line line{{it.secret>0?it.secret:''}}"></div>
        <div w-class="line line{{it.secret>1?it.secret:''}}"></div>
        <div w-class="line line{{it.secret>2?it.secret:''}}"></div>
    </div>

    {{if it.showTips}}
        {{if typeof(it.tips)==='string' && it.tips }}
            <div w-class="tips">{{it.tips}}</div>
        {{else}}
            <div w-class="tips"><pi-ui-lang>{"zh_Hans":"至少8位字符，可包含英文、数字、特殊字符！","zh_Hant":"至少8位字符，可包含英文、數字、特殊字符！","en":""}</pi-ui-lang></div>
        {{end}}
    
    {{end}}
</div>