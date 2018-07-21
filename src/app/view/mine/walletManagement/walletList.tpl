<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"管理钱包"}</app-components-topBar-topBar>
    <div w-class="main">
        {{for i,v of it1.wallets.walletList}}
        <div w-class="items" on-tap="listItemClicked('{{v.walletId}}')">
            <img src="../../../res/image/{{v.avatar}}" w-class="avatar" style="{{it1.wallets.curWalletId==v.walletId ? '' : 'filter: grayscale(100%);'}}"/>
            <div w-class="nickName">
                {{it1.fromJSON(v.gwlt).nickName}}
            </div>
            <span w-class="backupBtn" on-tap="backupClicked('{{v.walletId}}')">
                请备份
            </span>
        </div>
        {{end}}
    </div>
</div>