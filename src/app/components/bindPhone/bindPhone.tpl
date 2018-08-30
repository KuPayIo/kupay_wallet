<div w-class="phone-input" ev-input-change="phoneChange">
    <div w-class="old-code" on-tap="showNewCode">+{{it1.oldCode}}</div>
    <div><app-components-input-input>{placeHolder:"请填入手机号"}</app-components-input-input></div>
    {{if it1.countdown>0}}
    <div w-class="text-code">{{it1.countdown}}秒</div>
    {{else}}
    <div w-class="text-code" on-tap="getCode">获取验证码</div>
    {{end}} {{if it1.isShowNewCode}}
    <div w-class="new-code-bg" on-tap="chooseNewCode"></div>
    <div w-class="new-code">+{{it1.newCode}}</div>
    {{end}}
</div>