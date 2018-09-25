<div class="new-page" ev-back-click="backPrePage" on-tap="pageClick">
    <app-components1-topBar-topBar>{title:{{it1.cfgData.topBarTitle}},background:"#fff"}</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="head-container">
            <img w-class="avatar" src="{{it1.avatar ? it1.avatar : '../../../res/image1/default_avatar.png'}}" on-tap="uploadAvatar"/>
            <input id="walletNameInput" w-class="edit-input" value="{{it1.nickName}}" on-blur="walletNameInputBlur" on-focus="walletNameInputFocus"/>
            <img src="../../../res/image/edit.png" w-class="edit"/>
        </div>
        <div w-class="other">
            <div w-class="other-item" on-tap="backupWalletClick">
                <div w-class="item-title">{{it1.cfgData.itemTitle[0]}}</div>
                {{if !it1.backup}}
                <div w-class="tag">{{it1.cfgData.itemTitle[1]}}</div>
                {{end}}
                <img src="../../../res/image/right_arrow2_gray.png"/>
            </div>
            <div w-class="other-item" on-tap="exportPrivateKeyClick">
                <div w-class="item-title">{{it1.cfgData.itemTitle[2]}}</div>
                <img src="../../../res/image/right_arrow2_gray.png"/>
            </div>
        </div>
    </div>
</div>