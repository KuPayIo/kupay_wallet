<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"手机号码"}</app-components1-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone></app-components-bindPhone-bindPhone>
    </div>
    <div w-class="content">
        {{if !it1.isSuccess}}
        <div w-class="verify">验证码有误</div>
        {{end}}
        <div w-class="code" ev-input-change="codeChange" id="code">
            <app-components1-input-input>{itype:"number",style:"font-size:64px;color:#368FE5;letter-spacing: 70px;padding:0;"}</app-components1-input-input>
        </div>
        <div style="text-align: center;">
            <div w-class="codeBottom"></div>
            <div w-class="codeBottom"></div>
            <div w-class="codeBottom"></div>
            <div w-class="codeBottom"></div>
            <div w-class="codeBottom"></div>
            <div w-class="codeBottom"></div>
        </div>
    </div>
</div>