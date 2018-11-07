<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"手机号码","zh_Hant":"手機號碼","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone></app-components-bindPhone-bindPhone>
    </div>
    <div w-class="content">
        {{if !it1.isSuccess}}
        <div w-class="verify"><pi-ui-lang>{"zh_Hans":"验证码有误","zh_Hant":"驗證碼有誤","en":""}</pi-ui-lang></div>
        {{end}}
        
        <div style="text-align: center;margin-top: 60px;">
            {{for ind,val of [1,2,3,4]}}
            <div w-class="codeBottom">
                <input type="number" w-class="codeInput" id="codeInput{{ind}}" on-keyup="codeChange" on-focus="codeFocus"/>
            </div>
            {{end}}
            
        </div>
    </div>
</div>