<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"手机号码","zh_Hant":"手機號碼","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone>{verify:false}</app-components-bindPhone-bindPhone>
    </div>
    <div w-class="content">
        {{if !it.isSuccess}}
        <div w-class="verify"><pi-ui-lang>{"zh_Hans":"验证码有误","zh_Hant":"驗證碼有誤","en":""}</pi-ui-lang></div>
        {{end}}
        
        <div style="text-align: center;margin-top: 60px;">
            {{for ind,val of [1,2,3,4]}}
            <div w-class="codeBottom">
                <input type="number" w-class="codeInput" id="codeInput{{ind}}" on-keyup="codeChange" on-focus="codeFocus"/>
            </div>
            {{end}}
        </div>

        <div w-class="box">
            {{: tips = {"zh_Hans":"手机号登录，只能找回云端资产哦(^__^)","zh_Hant":"手機號登錄，只能找回雲端資產哦(^__^)","en":""} }}
            <div w-class="tips"><pi-ui-lang>{{tips}}</pi-ui-lang></div>
            {{: customerService = {"zh_Hans":"找客服","zh_Hant":"找客服","en":""} }}
            <div w-class="customer-service" on-tap="customerServiceClick"><pi-ui-lang>{{customerService}}</pi-ui-lang></div>
        </div>
    </div>
</div>