<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"创建账户","zh_Hant":"創建賬戶","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        {{: tipsCardTitle = {"zh_Hans":"选择颜色丰富的照片","zh_Hant":"選擇顏色豐富的照片","en":""} }}
        {{: tipsCardContent = {"zh_Hans":"照片和照片密码是您找回账号的唯一凭证，一旦丢失，"+it1.walletName+"将无法恢复您的账号和资产。照片和照片密码无法修改，请务必牢记并妥善保管。","zh_Hant":"照片和照片密碼是您找回賬號的唯一憑證，一旦丟失，"+it1.walletName+"將無法恢復您的賬號和資產。照片和照片密碼無法修改，請務必牢記並妥善保管。","en":""} }}
        <app-view-wallet-components-tipsCard>{title:{{tipsCardTitle}},content:{{tipsCardContent}},contentStyle:"color:#ef3838" }</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            <div w-class="choose-image-container" on-tap="selectImageClick">
                {{if !it1.chooseImage}}
                <div w-class="choose-image-text">+ <pi-ui-lang>{"zh_Hans":"选择照片","zh_Hant":"選擇照片","en":""}</pi-ui-lang>
                </div>
                {{else}}
                <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.imageHtml}}</widget>
                <div w-class="image-psw-container" on-tap="imagePswClick">
                    {{: inputPlace = [
                        {"zh_Hans":"为照片设置密码","zh_Hant":"為照片設置密碼","en":""},
                        {"zh_Hans":"重复照片密码","zh_Hant":"重複照片密碼","en":""}] }}
                    <div w-class="input-father" ev-input-change="imagePswChange">
                        <app-components-input-suffixInput>{itype:"password",placeHolder:{{inputPlace[0]}},clearable:true,available:{{it1.imagePswAvailable}}}</app-components-input-suffixInput>
                    </div>
                    <div w-class="input-father1" ev-input-change="imagePswConfirmChange">
                        <app-components-input-suffixInput>{itype:"password",placeHolder:{{inputPlace[1]}},clearable:true,available:{{it1.pswEqualed}}}</app-components-input-suffixInput>
                    </div>
                </div>
                {{end}}
            </div>
            <div ev-btn-tap="nextClick" w-class="btn">
                {{: btnName = {"zh_Hans":"下一步","zh_Hant":"下一步","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
            </div>
        </div>
    </div>
</div>