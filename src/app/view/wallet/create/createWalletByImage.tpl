<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"创建账户"}</app-components1-topBar-topBar>
    <div w-class="body">
        <app-view-wallet-components-tipsCard>{title:"选择颜色丰富的照片",content:"照片和照片密码是您找回账号的唯一凭证，一旦丢失，KuPay将无法恢复您的账号和资产。照片和照片密码无法修改，请务必牢记并妥善保管。",contentStyle:"color:#ef3838"}</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            <div w-class="choose-image-container" on-tap="selectImageClick">
                {{if !it1.chooseImage}}
                <div w-class="choose-image-text">+ 选择照片</div>
                {{else}}
                <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.avatarHtml}}</widget>
                {{end}}
            </div>
            <div ev-btn-tap="nextClick" w-class="btn"><app-components-btn-btn>{"name":"下一步","types":"big","color":"blue"}</app-components-btn-btn></div>
        </div>
    </div>
</div>