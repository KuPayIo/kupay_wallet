<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"助记词登录","zh_Hant":"助記詞登錄","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: createTips = {"zh_Hans":"按序输入助记词","zh_Hant":"按序輸入助記詞","en":""} }}
        <div w-class="create-tips"><div w-class="tip-divid"></div><pi-ui-lang>{{createTips}}</pi-ui-lang><img src="../../../res/image/41_blue.png" w-class="what-is" on-tap="whatIsMnemonicClick"/></div>
        {{: desc = {"zh_Hans":"请输入您创建账号时备份的12个英文单词，助记词登录能导入云端和本地所有资产","zh_Hant":"請輸入您創建賬號時備份的12個英文單詞，助記詞登錄能導入雲端和本地所有資產","en":""} }}
        <div w-class="desc"><pi-ui-lang>{{desc}}</pi-ui-lang></div>
        <div w-class="bottom-box">
            <div w-class="textarea-father" ev-input-change="inputChange">
                {{:let inputPlace = {"zh_Hans":"输入助记词，空格键分隔","zh_Hant":"輸入助記詞，空格鍵分隔","en":""} }}
                <app-components-textarea-textarea>{placeHolder:{{inputPlace}} }</app-components-textarea-textarea>
            </div>
            <div ev-btn-tap="nextClick" w-class="btn">
                {{: btnName = {"zh_Hans":"继续","zh_Hant":"繼續","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
            </div>
            <div w-class="other-btns">
                {{: imgLogin = {"zh_Hans":"照片登录","zh_Hant":"照片登錄","en":""} }}
                <pi-ui-lang w-class="other-btn" on-tap="imageImportClick">{{imgLogin}}</pi-ui-lang>
                {{: fragmentLogin = {"zh_Hans":"片段登录","zh_Hant":"片段登錄","en":""} }}
                <pi-ui-lang w-class="other-btn" on-tap="fragmentImportClick">{{fragmentLogin}}</pi-ui-lang>
                {{: forgetMnemonic = {"zh_Hans":"忘了助记词","zh_Hant":"忘了助記詞","en":""} }}
                <pi-ui-lang w-class="other-btn" on-tap="phoneImportClick">{{forgetMnemonic}}</pi-ui-lang>
            </div>
        </div>
    </div>
</div>