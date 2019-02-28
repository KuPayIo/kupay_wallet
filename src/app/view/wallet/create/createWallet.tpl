<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: randomTitle = {"zh_Hans":"注册新账号","zh_Hant":"註冊新賬號","en":""} }}
    {{: imageTitle = {"zh_Hans":"设置密码","zh_Hant":"設置密碼","en":""} }}
    {{: topBarTitle = it.itype === it.createWalletType.Random ? randomTitle : imageTitle}}
    <app-components1-topBar-topBar>{"title":{{ topBarTitle }} }</app-components1-topBar-topBar>
    <div w-class="body">
        {{: randomTips = {"zh_Hans":"设置支付密码","zh_Hant":"設置支付密碼","en":""} }}
        {{: imageTips = {"zh_Hans":"设置密码","zh_Hant":"設置密碼","en":""} }}
        {{: createTips = it.itype === it.createWalletType.Random ? randomTips : imageTips}}
        <div w-class="create-tips"><div w-class="tip-divid"></div><pi-ui-lang>{{createTips}}</pi-ui-lang></div>
        <div w-class="bottom-box">
            <div w-class="avatar-container" on-tap="selectImageClick">
                {{if !it.chooseImage}}
                <div style="background-image: url(../../../res/image/default_avater_big.png);" w-class="avatar"></div>
                {{else}}
                <widget w-tag="pi-ui-html" w-class="ui-html">{{it.avatarHtml}}</widget>
                {{end}}
            </div>
            <div w-class="name-box" ev-input-change="walletNameChange">
                <widget w-tag="app-components1-input-input" style="flex: 1;">{input:{{it.walletName}},maxLength:10}</widget>
                <img w-class="random" src="../../../res/image/dice.png" on-tap="randomPlayName" id="random"/>
            </div>
            <div ev-psw-change="pswChange" ev-psw-clear="pwsClear"><app-components-password-password>{hideTips:true}</app-components-password-password></div>
            <div w-class="input-father" ev-input-change="pswConfirmChange">
                {{: inputPlace = {"zh_Hans":"重复密码","zh_Hant":"重複密碼","en":""} }}
                <app-components-input-suffixInput>{itype:"password",placeHolder:{{inputPlace}},clearable:true,available:{{it.pswEqualed}}}</app-components-input-suffixInput>
            </div>
            <div w-class="registered-protocol" ev-checkbox-click="checkBoxClick">
                {{: readAgree = {"zh_Hans":"我已经认证阅读并同意","zh_Hant":"我已經認證閱讀並同意","en":""} }}
                <app-components1-checkbox-checkbox>{itype:"false",text:{{readAgree}} }</app-components1-checkbox-checkbox>
                <span w-class="user-protocol" on-tap="agreementClick"><pi-ui-lang>{"zh_Hans":"用户协议及隐私服务","zh_Hant":"用戶協議及隱私服務","en":""}</pi-ui-lang></span>
            </div>
            <div ev-btn-tap="createClick" w-class="btn">
                {{: btnName = {"zh_Hans":"完成","zh_Hant":"完成","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue","cannotClick":{{!it.userProtocolReaded}} }</app-components1-btn-btn>
            </div>
            {{: haveAccount = {"zh_Hans":"已有账号登录","zh_Hant":"已有賬號登錄","en":""} }}
            {{: imgLogin = {"zh_Hans":"使用照片注册","zh_Hant":"使用照片註冊","en":""} }}
            {{if it.itype === it.createWalletType.Random}}
            <div w-class="login-btns">
                <pi-ui-lang w-class="login-btn" on-tap="haveAccountClick">{{haveAccount}}</pi-ui-lang>
                <pi-ui-lang w-class="login-btn" on-tap="imgLoginClick">{{imgLogin}}</pi-ui-lang>
            </div>
            {{end}}
        </div>
    </div>
</div>