<div class="new-page" w-class="new-page">
    <app-view-wallet-components-tipsCard>{title:"按序输入助记词",content:"请输入您创建账号时备份的12个英文单词"}</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div w-class="textarea-father" ev-input-change="inputChange"><app-components-textarea-textarea>{placeHolder:"输入助记词，空格键分隔"}</app-components-textarea-textarea></div>
        <div ev-btn-tap="nextClick"><app-components-btn-btn>{"name":"下一步","types":"big","color":"blue"}</app-components-btn-btn></div>
    </div>
</div>