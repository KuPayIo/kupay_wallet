<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page" on-tap="pageClick">
    <div w-class="ga-top-banner">
        <app-components-topBar-topBar>{title:"我的钱包"}</app-components-topBar-topBar>
        <div w-class="ga-card">
            <div w-class="ga-wallet-name-container">
                <img w-class="ga-wallet-header" src="../../../res/image/{{it1.wallet.avatar}}"/>
                <input 
                    id="walletNameInput"
                    w-class="ga-input" 
                    value="{{it1.gwlt.nickName}}" 
                    on-blur="walletNameInputBlur"
                    on-focus="walletNameInputFocus"
                    />
            </div>
            <div w-class="ga-assets"><span w-class="ga-assets-item">≈</span>{{it1.totalAssets}}&nbsp;CNY</div>
            <div w-class="ga-group-wallet" on-tap="showGroupWallet">群钱包</div>
        </div>
    </div>
    <div w-class="ga-bottom-container">
        <div w-class="ga-item" on-tap="changePasswordClick">
            <span w-class="ga-item-text">修改密码</span>
            <img w-class="ga-item-arrow" src="../../../res/image/btn_right_arrow.png"/>
        </div>
        <div w-class="ga-item">
            {{if !it1.showPswTips}}<span w-class="ga-item-text">********</span>
            {{else}}
            <input 
                id="pswTipsInput"
                w-class="ga-input-psw-tips" 
                value="{{it1.pswTips}}" 
                on-blur="pswTipsInputBlur"
                on-focus="pswTipsInputFocus"/>
            {{end}}
            <div w-class="ga-psw-tips-container" on-tap="pswTipsClick">
                <span>密码提示</span>
                <img src="../../../res/image/{{it1.showPswTips ? 'btn_display_open.png' : 'btn_display_close.png'}}" w-class="ga-img"/>
            </div>
        </div>
        <div w-class="ga-item" on-tap="exportPrivateKeyClick">
            <span w-class="ga-item-text">导出私钥</span>
            <img w-class="ga-item-arrow" src="../../../res/image/btn_right_arrow.png"/>
        </div>
        <div w-class="ga-item" on-tap="signOutClick">
            <span w-class="ga-item-text">退出登录</span>
            <img w-class="ga-item-arrow" src="../../../res/image/btn_right_arrow.png"/>
        </div>
    </div>
    
    <div w-class="ga-wallet-backup-btn" on-tap="backupMnemonic" {{if !it1.mnemonicExisted}} style="pointer-events: none;visibility: hidden;" {{end}}>备份助记词</div>
    
    <div w-class="ga-delete-wallet" on-tap="deleteWalletClick">删除钱包</div>
</div>