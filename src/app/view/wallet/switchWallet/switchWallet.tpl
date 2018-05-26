<div class="ga-new-page" w-class="ga-switch-wallet-page">
    <div w-class="ga-switch-wallet-left" on-tap="closePageClick"></div>
    <div w-class="ga-switch-wallet-right">
        <div w-class="ga-wallet-container">
            {{for index,wallet of it1.wallets.walletList}}
            <div w-class="ga-wallet-item {{wallet.walletId === it1.wallets.curWalletId ? 'ga-wallet-item-active' : ''}}" on-tap="switchWalletClick(e,{{index}})">
                <span w-class="ga-wallet-item-dot" style="background-color:{{it1.randomRgbColor()}};"></span>
                <span w-class="ga-wallet-item-name">{{it1.nickNameInterception(wallet.gwlt.nickName)}}</span>
            </div>
            {{end}}
        </div>
        <div w-class="ga-bottom-container">
            <div w-class="ga-create-wallet" on-tap="createWalletClick">
                <span w-class="ga-text">创建钱包</span>
            </div>
            <div w-class="ga-import-wallet" on-tap="importWalletClick">
                <span w-class="ga-text">导入钱包</span>
            </div>
        </div>
    </div>
</div>