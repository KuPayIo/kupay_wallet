<div class="new-page" w-class="new-page">

    {{: tipsCardTitle = {"zh_Hans":"按序输入助记词","zh_Hant":"按序輸入助記詞","en":""} }}
    {{: tipsCardContent = {"zh_Hans":"请输入您创建账号时备份的12个英文单词","zh_Hant":"請輸入您創建賬號時備份的12個英文單詞","en":""} }}
    <app-view-wallet-components-tipsCard>{title:{{tipsCardTitle}},content:{{tipsCardContent}} }</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div w-class="textarea-father" ev-input-change="inputChange">
            {{: inputPlace = {"zh_Hans":"输入助记词，空格键分隔","zh_Hant":"輸入助記詞，空格鍵分隔","en":""} }}
            <app-components-textarea-textarea>{placeHolder:{{inputPlace}} }</app-components-textarea-textarea>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn">
            {{: btnName = {"zh_Hans":"下一步","zh_Hant":"下一步","en":""} }}
            <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
        </div>
    </div>
</div>