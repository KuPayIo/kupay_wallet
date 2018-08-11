<div class="ga-new-page" w-class="ga-switch-wallet-page {{it1.close ? 'ga-switch-wallet-page-hidden' : ''}}">
    <div w-class="ga-switch-wallet-left" on-tap="closePageClick"></div>
    <div w-class="ga-switch-wallet-right {{it1.close ? 'ga-switch-wallet-right-hidden' : ''}}">
        <div w-class="ga-wallet-container">
            {{for index,wallet of it1.walletList}}
            <div w-class="ga-wallet-item {{wallet.walletId === it1.curWalletId ? 'ga-wallet-item-active' : ''}}" on-tap="switchWalletClick(e,{{index}},{{wallet.walletId === it1.curWalletId}})">
                <img w-class="ga-wallet-header" src="../../../res/image/{{wallet.avatar}}"/>
                <span w-class="ga-wallet-item-name">{{it1.nickNameInterception(wallet.gwlt.nickName)}}</span>
            </div>
            {{end}}
        </div>
        <div w-class="ga-bottom-container">
            <div w-class="ga-import-wallet" on-tap="importWalletClick">
                <span w-class="ga-text">添加钱包</span>
            </div>
        </div>
    </div>
</div>