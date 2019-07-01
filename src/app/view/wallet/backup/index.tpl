<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: title = {"zh_Hans":"按序抄写助记词","zh_Hant":"按序抄寫助記詞","en":""} }}
        {{: content = {"zh_Hans":"助记词是您找回账号的唯一凭证，如果丢失，" + it.walletName + "将无法恢复您的账户和资产。请务必妥善保管您的助记词","zh_Hant":"助記詞是您找回賬號的唯一憑證，如果丟失，"+it.walletName+"將無法恢復您的賬號和資產。請務必妥善保管您的助記詞。","en":""} }}
        <app-view-wallet-components-tipsCard>{contentStyle:"color:#ef3838;",title:{{title}},content:{{content}} }</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            <div w-class="mnemonic-container">
               {{it.mnemonic}}
            </div>
            <div w-class="btn-container">
                {{: btnNames = 
                [{"zh_Hans":"我已妥善保管","zh_Hant":"我已妥善保管","en":""},
                {"zh_Hans":"请好友协助保管","zh_Hant":"請好友協助保管","en":""}] }}
                <div ev-btn-tap="standardBackupClick" w-class="btn"><app-components1-btn-btn>{"name":{{btnNames[0]}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
                <div ev-btn-tap="fragmentsBackupClick" w-class="btn"><app-components1-btn-btn>{"name":{{btnNames[1]}},"types":"big","color":"white"}</app-components1-btn-btn></div>
            </div>
        </div>
    </div>
</div>