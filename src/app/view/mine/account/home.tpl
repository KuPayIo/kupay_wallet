<div class="new-page" ev-back-click="backPrePage" on-tap="pageClick">
    <app-components1-topBar-topBar>{title:"账户",background:"#fff"}</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="head-container">
            <img w-class="avatar" src="{{it1.avatar ? it1.avatar : '../../../res/image1/default_avatar.png'}}" on-tap="uploadAvatar"/>
            <input id="walletNameInput" w-class="edit-input" value="{{it1.nickName}}" on-blur="walletNameInputBlur" on-focus="walletNameInputFocus"/>
            <img src="../../../res/image/edit.png" w-class="edit"/>
        </div>
        <div w-class="other">
            <div w-class="other-item" on-tap="backupWalletClick">
                <div w-class="item-title">备份助记词</div>
                {{if !it1.backup}}
                <div w-class="tag">未备份</div>
                {{end}}
                <img src="../../../res/image/right_arrow2_gray.png"/>
            </div>
            <div w-class="other-item" on-tap="exportPrivateKeyClick">
                <div w-class="item-title">导出私钥</div>
                <img src="../../../res/image/right_arrow2_gray.png"/>
            </div>
        </div>
    </div>
</div>