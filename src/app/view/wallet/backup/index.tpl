<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"备份助记词"}</app-components1-topBar-topBar>
    <div w-class="body">
        <app-view-wallet-components-tipsCard>{contentStyle:"color:#ef3838;",title:"按序抄写助记词",content:"助记词是您找回账号的唯一凭证，如果丢失，KuPay将无法恢复您的账号和资产。请务必妥善保管您的助记词。"}</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            <div w-class="mnemonic-container">
               {{it.mnemonic}}
            </div>
            <div w-class="btn-container">
                <div ev-btn-tap="standardBackupClick" w-class="btn"><app-components1-btn-btn>{"name":"我已妥善保管","types":"big","color":"blue"}</app-components1-btn-btn></div>
                <div ev-btn-tap="fragmentsBackupClick" w-class="btn"><app-components1-btn-btn>{"name":"请好友协助保管","types":"big","color":"white"}</app-components1-btn-btn></div>
            </div>
        </div>
    </div>
</div>