<div style="position: relative;">
    <div w-class="bindPhone" ev-input-change="phoneChange">
        <div w-class="old-code" on-tap="showNewCode">
            <span>+{{it1.oldCode}}</span>
            <img src="../../res/image/15.png" style="width: 40px;height:40px;margin-left: 10px;"/>
        </div>
        <div w-class="phoneInput"><app-components1-input-input>{placeHolder:"请填入手机号",itype:"number"}</app-components1-input-input></div>
        {{if it1.countdown>0}}
        <div w-class="text-code">{{it1.countdown}}秒</div>
        {{else}}
        <div w-class="text-code" on-tap="getCode">获取验证码</div>
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
