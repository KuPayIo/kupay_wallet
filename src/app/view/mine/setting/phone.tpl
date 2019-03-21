<div class="new-page" ev-back-click="backPrePage" ev-next-click="jumpClick">
    {{: topBarTitle = it.title ? it.title : {"zh_Hans":"手机号码","zh_Hant":"手機號碼","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},textStyle:"margin-right:25px;color:rgba(136,136,136,1);font-size:28px;" }</app-components-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone>{verify:{{it.itype === 1 ? true : false}},phone:{{it.phone}},disabled:{{ it.itype === 1 ? false : true}} }</app-components-bindPhone-bindPhone>
    </div>
    <div w-class="content">
        {{if !it.isSuccess}}
        <div w-class="verify"><pi-ui-lang>{"zh_Hans":"验证码有误","zh_Hant":"驗證碼有誤","en":""}</pi-ui-lang></div>
        {{end}}
        
        <div w-class="code-container">
            {{for ind,val of [1,2,3,4]}}
            <div w-class="codeBottom {{it.code[ind] ? 'codeBottom-active' : ''}}">
                <input type="number" w-class="codeInput" id="codeInput{{ind}}" on-keyup="codeChange" on-focus="codeFocus"/>
            </div>
            {{end}}
            
        </div>
    </div>
</div>