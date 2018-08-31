<div class="ga-new-page" ev-back-click="backPrePage" w-class="new-page">
    <app-components-topBar-topBar>{title:"管理钱包"}</app-components-topBar-topBar>
    <div style="overflow-x: hidden;overflow-y: auto;flex:1 0 0;">
    <div w-class="main">
        {{for i,v of it1.walletList}}
        <div w-class="items" on-tap="listItemClicked('{{v.walletId}}')">
            <img src="../../../res/image/{{v.avatar}}" w-class="avatar" style="{{it1.curWalletId==v.walletId ? '' : 'filter: grayscale(100%);'}}"/>
            <div w-class="nickName">
                {{it1.fromJSON(v.gwlt).nickName}}
            </div>
            {{if  !it1.fromJSON(v.gwlt).mnemonicBackup}}
            <span w-class="backupBtn" on-tap="backupClicked('{{v.walletId}}')">
                请备份
            </span>
            {{end}}
        </div>
        {{end}}
    </div>
    </div>
</div>