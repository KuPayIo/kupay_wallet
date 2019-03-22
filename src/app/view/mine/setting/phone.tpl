<div class="new-page" ev-back-click="backPrePage" ev-next-click="jumpClick">
    {{: topBarTitle = !!it.unbind ? {zh_Hans:'解除绑定',zh_Hant:'解除綁定',en:''} : { zh_Hans:'绑定新手机号',zh_Hant:'綁定新手機號',en:'' } }}
    {{: text = it.jump ? "跳过" : ""}}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},text:{{text}},textStyle:"margin-right:25px;color:rgba(136,136,136,1);font-size:28px;" }</app-components-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone>{verify:{{!it.unbind}},phone:{{it.phone}},disabled:{{ !!it.unbind }} }</app-components-bindPhone-bindPhone>
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