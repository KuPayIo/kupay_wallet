<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page" on-tap="pageClick">
    <div w-class="ga-top-banner">
        <app-components-topBar-topBar>{title:{{it1.gwlt.nickName}}}</app-components-topBar-topBar>
        <div w-class="cardPaddingDiv">
            <div w-class="ga-card">
                <div w-class="ga-wallet-name-container">
                    <img w-class="ga-wallet-header" src="../../../res/image/{{it1.wallet.avatar}}" />
                    <input id="walletNameInput" w-class="ga-input" value="{{it1.gwlt.nickName}}" on-blur="walletNameInputBlur" on-focus="walletNameInputFocus"
                    />
                </div>
                <div w-class="ga-assets">
                    <span w-class="ga-assets-item">≈</span>{{it1.totalAssets}}&nbsp;CNY</div>
            </div>
        </div>
    </div>
    <div w-class="ga-bottom-container">
        <div w-class="ga-item" on-tap="changePasswordClick">
            <span w-class="ga-item-text">修改交易密码</span>
            <img w-class="ga-item-arrow" src="../../../res/image/btn_right_arrow.png" />
        </div>
        <div w-class="ga-item" on-tap="exportPrivateKeyClick">
            <span w-class="ga-item-text">导出私钥</span>
            <img w-class="ga-item-arrow" src="../../../res/image/btn_right_arrow.png" />
        </div>
        <div w-class="ga-item" on-tap="signOutClick">
            <span w-class="ga-item-text">退出钱包</span>
            <img w-class="ga-item-arrow" src="../../../res/image/btn_right_arrow.png" />
        </div>
    </div>

    <div w-class="ga-wallet-backup-btn" on-tap="backupMnemonic">备份助记词</div>

    <div w-class="ga-delete-wallet" on-tap="deleteWalletClick">删除钱包</div>
</div>