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
        <img src="../../res/image/closeEyes.png" w-class="close-eyes" />
        <div w-class="rank-container">
            {{if it.secret>2}}
            <div w-class="rank-item" style="background:rgba(234,45,45,1);"></div>
            <div w-class="rank-item" style="background:rgba(234,45,45,1);"></div>
            {{end}}
            {{if it.secret>1}}
            <div w-class="rank-item"></div>
            <div w-class="rank-item"></div>
            {{end}}
            {{if it.secret>0}}
            <div w-class="rank-item" style="background:rgba(123,229,84,1);"></div>
            <div w-class="rank-item" style="background:rgba(123,229,84,1);"></div>
            {{end}}
        </div>
    </div>

    {{if it.showTips}}
        {{if typeof(it.tips)==='string' && it.tips }}
            <div w-class="tips">{{it.tips}}</div>
        {{else}}
            <div w-class="tips"><pi-ui-lang>{"zh_Hans":"至少8位字符，可包含英文、数字、特殊字符！","zh_Hant":"至少8位字符，可包含英文、數字、特殊字符！","en":""}</pi-ui-lang></div>
        {{end}}
    
    {{end}}
</div>