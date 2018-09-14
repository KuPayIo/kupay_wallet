<div class="new-page" w-class="new-page">
    <app-view-wallet-components-tipsCard>{title:"使用原始照片和照片密码",content:"请使用创建账户时设置的照片和照片密码恢复账户。"}</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div w-class="choose-image-container" on-tap="selectImageClick">
            {{if !it1.chooseImage}}
            <div w-class="choose-image-text">+ 选择照片</div>
            {{else}}
            <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.imageHtml}}</widget>
            <div w-class="image-psw-container" on-tap="imagePswClick">
                <div w-class="input-father" ev-input-change="imagePswChange"><app-components-input-suffixInput>{itype:"password",placeHolder:"输入照片密码",clearable:true,available:{{it1.imagePswAvailable}}}</app-components-input-suffixInput></div>
            </div>
            {{end}}
        </div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":"下一步","types":"big","color":"blue"}</app-components1-btn-btn></div>
    </div>
</div>