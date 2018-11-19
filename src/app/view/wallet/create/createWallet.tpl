<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"创建账户","zh_Hant":"創建賬戶","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        {{: tipsCardTitle = {"zh_Hans":"设置账户密码","zh_Hant":"設置賬戶密碼","en":""} }}
        {{: tipsCardContent = {"zh_Hans":"系统已为您创建好账户，请设置账户密码。","zh_Hant":"系統已為您創建好賬戶，請設置賬戶密碼。","en":""} }}
        <app-view-wallet-components-tipsCard>{title:{{tipsCardTitle}},content:{{tipsCardContent}} }</app-view-wallet-components-tipsCard>
        
        <div w-class="bottom-box">
            <div w-class="avatar-container" on-tap="selectImageClick">
                {{if !it1.chooseImage}}
                <div style="background-image: url(../../../res/image/default_avater_big.png);" w-class="avatar"></div>
                {{else}}
                <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.avatarHtml}}</widget>
                {{end}}
                {{if !it1.chooseImage}}
                <div w-class="choose-img-mask">
                    <img src="../../../res/image/choose_img.png" w-class="choose-img"/>
                </div>
                {{end}}
            </div>
            <div w-class="name-box" ev-input-change="walletNameChange">
                <widget w-tag="app-components1-input-input" style="flex: 1;">{input:{{it1.walletName}},maxLength:10}</widget>
                <img w-class="random" src="../../../res/image/dice.png" on-tap="randomPlayName" id="random"/>
            </div>
            <div ev-psw-change="pswChange" ev-psw-clear="pwsClear"><app-components-password-password>{hideTips:true}</app-components-password-password></div>
            <div w-class="input-father" ev-input-change="pswConfirmChange">
                {{: inputPlace = {"zh_Hans":"重复密码","zh_Hant":"重複密碼","en":""} }}
                <app-components-input-suffixInput>{itype:"password",placeHolder:{{inputPlace}},clearable:true,available:{{it1.pswEqualed}}}</app-components-input-suffixInput>
            </div>
            <div w-class="registered-protocol" ev-checkbox-click="checkBoxClick">
                {{: readAgree = {"zh_Hans":"我已经认证阅读并同意","zh_Hant":"我已經認證閱讀並同意","en":""} }}
                <app-components1-checkbox-checkbox>{itype:"false",text:{{readAgree}} }</app-components1-checkbox-checkbox>
                <span w-class="user-protocol" on-tap="agreementClick"><pi-ui-lang>{"zh_Hans":"用户协议及隐私服务","zh_Hant":"用戶協議及隱私服務","en":""}</pi-ui-lang></span>
            </div>
            <div ev-btn-tap="createClick" w-class="btn">
                {{: btnName = {"zh_Hans":"完成","zh_Hant":"完成","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue","cannotClick":{{!it1.userProtocolReaded}} }</app-components1-btn-btn>
            </div>
        </div>
    </div>
</div>