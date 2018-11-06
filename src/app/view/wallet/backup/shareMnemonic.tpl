<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
        {{: topBarTitle = {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
            {{: title = {"zh_Hans":"按序抄写助记词","zh_Hant":"按序抄寫助記詞","en":""} }}
            {{: content = {"zh_Hans":"助记词是您找回账号的唯一凭证，如果丢失，KuPay将无法恢复您的账户和资产。请务必妥善保管您的助记词","zh_Hant":"助記詞是您找回賬號的唯一憑證，如果丟失，KuPay將無法恢復您的賬號和資產。請務必妥善保管您的助記詞。","en":""} }}
        <app-view-wallet-components-tipsCard>{contentStyle:"color:#ef3838;",title:{{title}} ,content:{{content}} }</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            {{for i,v of it1.successList}}
            <div w-class="item" on-tap="shareItemClick(e,{{i}})">
                <img src="../../../res/image/number{{i + 1}}.png"/>
                <div w-class="share-box">
                    <div w-class="share-title">
                        <pi-ui-lang>{"zh_Hans":"分享给好友","zh_Hant":"分享給好友","en":""}</pi-ui-lang>
                    </div>
                    <div w-class="share-fragment">{{it1.encryptFragments[i]}}</div>
                </div>
                <div w-class="choose-box">
                    {{if v}}
                    <img src="../../../res/image/icon_right2.png" w-class="choosed"/>
                    {{else}}
                    <div w-class="choose-inner"></div>
                    {{end}}
                </div>
            </div>
            {{end}}
        </div>
    </div>
</div>