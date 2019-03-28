<div class="new-page" w-class="new-page" >
    {{: topBarTitle = {"zh_Hans":"设置密码","zh_Hant":"設置密碼","en":""} }}
    <app-components-topBar-topBar>{"title":{{ topBarTitle }},"backImg":"../../res/image/hamburger.png" }</app-components-topBar-topBar>
    <div w-class="body">
        {{: tips = {"zh_Hans":"设置支付密码","zh_Hant":"設置支付密碼","en":""} }}
        <div w-class="create-tips"><div w-class="tip-divid"></div><pi-ui-lang>{{tips}}</pi-ui-lang></div>
        {{: desc = {"zh_Hans":"为了您的资产安全，建议您立即设置支付密码","zh_Hant":"您的賬戶有變動，為了您的資產安全，建議您立即設置支付密碼","en":""} }}
        <div w-class="desc"><pi-ui-lang>{{desc}}</pi-ui-lang></div>
        <div w-class="bottom-box">
            <div ev-psw-change="pswChange" ev-psw-clear="pwsClear"><app-components-password-password>{hideTips:true}</app-components-password-password></div>
            <div w-class="input-father" ev-input-change="pswConfirmChange">
                {{: inputPlace = {"zh_Hans":"重复密码","zh_Hant":"重複密碼","en":""} }}
                <app-components-input-suffixInput>{isShow:true,itype:"password",placeHolder:{{inputPlace}},clearable:true,available:{{it.pswEqualed}}}</app-components-input-suffixInput>
            </div>
            <div w-class="registered-protocol" ev-checkbox-click="checkBoxClick">
                    <span w-class="user-agree"><pi-ui-lang>{"zh_Hans":"选择继续表示同意","zh_Hant":"選擇繼續表示同意","en":""}</pi-ui-lang></span>
                <span w-class="user-protocol" on-tap="agreementClick"><pi-ui-lang>{"zh_Hans":"用户协议及隐私服务","zh_Hant":"用戶協議及隱私服務","en":""}</pi-ui-lang></span>
            </div>
            <div ev-btn-tap="createClick" w-class="btn">
                {{: btnName = {"zh_Hans":"继续","zh_Hant":"繼續","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue","cannotClick":{{!it.userProtocolReaded}} }</app-components1-btn-btn>
            </div>
        </div>
    </div>
</div>