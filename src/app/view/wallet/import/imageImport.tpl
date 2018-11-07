<div class="new-page" w-class="new-page">
    {{: tipsCardTitle = {"zh_Hans":"使用原始照片和照片密码","zh_Hant":"使用原始照片和照片密碼","en":""} }}
    {{: tipsCardContent = {"zh_Hans":"请使用创建账户时设置的照片和照片密码恢复账户。","zh_Hant":"請使用創建賬戶時設置的照片和照片密碼恢復賬戶。","en":""} }}
    <app-view-wallet-components-tipsCard>{title:{{tipsCardTitle}},content:{{tipsCardContent}} }</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div w-class="choose-image-container" on-tap="selectImageClick">
            {{if !it1.chooseImage}}
            <div w-class="choose-image-text">+ <pi-ui-lang>{"zh_Hans":"选择照片","zh_Hant":"選擇照片","en":""}</pi-ui-lang></div>
            {{else}}
            <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.imageHtml}}</widget>
            <div w-class="image-psw-container" on-tap="imagePswClick">
                <div w-class="input-father" ev-input-change="imagePswChange">
                    {{: inputPlace = {"zh_Hans":"输入照片密码","zh_Hant":"輸入照片密碼","en":""} }}
                    <app-components-input-suffixInput>{itype:"password",placeHolder:{{inputPlace}},clearable:true,available:{{it1.imagePswAvailable}}}</app-components-input-suffixInput>
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