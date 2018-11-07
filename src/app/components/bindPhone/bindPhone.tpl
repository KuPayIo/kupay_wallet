<div style="position: relative;">
    <div w-class="bindPhone" ev-input-change="phoneChange">
        <div w-class="old-code" on-tap="showNewCode">
            <span>+{{it1.oldCode}}</span>
            <img src="../../res/image/15.png" style="width: 40px;height:40px;margin-left: 10px;"/>
        </div>
        {{: phone = {"zh_Hans":"手机号","zh_Hant":"手機號","en":""} }}
        {{: second = {"zh_Hans":"s 重新获取","zh_Hant":"s 重新獲取","en":""} }}
        {{: getCode = {"zh_Hans":"获取验证码","zh_Hant":"獲取驗證碼","en":""} }}
        <div w-class="phoneInput"><app-components1-input-input>{placeHolder:{{phone}},itype:"integer",autofocus:true,maxLength:11}</app-components1-input-input></div>
        {{if it1.countdown>0}}
        <div w-class="text-code">
            {{it1.countdown}}
            <pi-ui-lang>{{second}}</pi-ui-lang>
        </div>
        {{else}}
        <div w-class="text-code" on-tap="getCode">
            <pi-ui-lang>{{getCode}}</pi-ui-lang>
        </div>
        {{end}} 
    </div>

    {{if it1.isShowNewCode}}
    <div w-class="new-code-bg">
        {{for ind,val of it1.codeList}}
        <div w-class="new-code" on-tap="chooseNewCode({{ind}})">+{{val}}</div>
        {{end}}
    </div>
    {{end}}
</div>
