<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"备份助记词"}</app-components1-topBar-topBar>
    <div w-class="body">
        <app-view-wallet-components-tipsCard>{contentStyle:"color:#ef3838;",title:"按序抄写助记词",content:"助记词是您找回账号的唯一凭证，如果丢失，KuPay将无法恢复您的账号和资产。请务必妥善保管您的助记词。"}</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            {{for i,v of it1.successList}}
            <div w-class="item" on-tap="shareItemClick(e,{{i}})">
                <img src="../../../res/image/number{{i + 1}}.png"/>
                <div w-class="share-box">
                    <div w-class="share-title">分享给好友</div>
                    <div w-class="share-fragment">{{it.fragments[i]}}</div>
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