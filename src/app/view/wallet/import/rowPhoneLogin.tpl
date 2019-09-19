<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    <app-components1-topBar-topBar>{"title":"手机号码" }</app-components1-topBar-topBar>
    {{: phone = {"zh_Hans":"手机号","zh_Hant":"手機號","en":""} }}
    {{: code = {"zh_Hans":"验证码","zh_Hant":"驗證碼","en":""} }}
    <div w-class="phoneInput" ev-input-change="phoneChange"><app-components1-input-input>{input:{{it.phone}},placeHolder:{{phone}},itype:"number"}</app-components1-input-input></div>
    <div w-class="codeBox">
        <div w-class="codeInput" ev-input-change="codeChange">
            <app-components1-input-input>{input:{{it.code}},placeHolder:{{code}},itype:"number" }</app-components1-input-input>
        </div>
        {{if it.countdown>0}}
            <div w-class="time">{{it.countdown}}s 重新获取</div>
        {{else}}
            <div w-class="time" on-tap="getCode">获取验证码</div>
        {{end}}
    </div>
    <div w-class="btn" on-tap="login">登录</div>
</div>