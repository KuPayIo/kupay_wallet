<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"手机号码"}</app-components1-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone></app-components-bindPhone-bindPhone>
    </div>
    <div w-class="content">
        {{if !it1.isSuccess}}
        <div w-class="verify">验证码有误</div>
        {{end}}
        
        <div style="text-align: center;margin-top: 60px;" ev-input-change="codeChange" ev-input-focus="codeFocus">
            {{for ind,val of [1,2,3,4]}}
            <div w-class="codeBottom" id="codeInput{{ind}}">
                <app-components1-input-input>{index:{{ind}},itype:"number",style:"font-size:64px;color:#368FE5;text-align:center;",input:{{it1.code[ind]}} }</app-components1-input-input>
            </div>
            {{end}}
            
        </div>
    </div>
</div>