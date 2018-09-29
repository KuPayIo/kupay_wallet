<div class="new-page" w-class="new-page">
    <app-view-wallet-components-tipsCard>{{it1.cfgData.tipsCard}}</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div w-class="choose-image-container" on-tap="selectImageClick">
            {{if !it1.chooseImage}}
            <div w-class="choose-image-text">+ {{it1.cfgData.selectPic}}</div>
            {{else}}
            <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.imageHtml}}</widget>
            <div w-class="image-psw-container" on-tap="imagePswClick">
                <div w-class="input-father" ev-input-change="imagePswChange"><app-components-input-suffixInput>{itype:"password",placeHolder:{{it1.cfgData.inputPlace}},clearable:true,available:{{it1.imagePswAvailable}}}</app-components-input-suffixInput></div>
            </div>
            {{end}}
        </div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
    </div>
</div>