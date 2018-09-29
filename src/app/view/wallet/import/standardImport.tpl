<div class="new-page" w-class="new-page">
    <app-view-wallet-components-tipsCard>{{it1.cfgData.tipsCard}}</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div w-class="textarea-father" ev-input-change="inputChange"><app-components-textarea-textarea>{placeHolder:{{it1.cfgData.inputPlace}} }</app-components-textarea-textarea></div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
    </div>
</div>