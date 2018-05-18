<div class="ga-new-page" w-class="ga-switch-wallet-page">
    <div w-class="ga-switch-wallet-left" on-tap="closePageClick"></div>
    <div w-class="ga-switch-wallet-right">
        <div w-class="ga-wallet-container">
            {{for index,wallet of it1.wallets.list}}
            <div w-class="ga-wallet-item" on-tap="switchWalletClick(e,{{index}})">
                <span w-class="ga-wallet-item-dot" style="background-color:{{wallet.walletId === it1.wallets.curWalletId ? 'green' : 'white'}};"></span>
                <span w-class="ga-wallet-item-name">{{wallet.walletName}}</span>
            </div>
            {{end}}
        </div>
        <div w-class="ga-bottom-container">
            <div w-class="ga-create-wallet" on-tap="createWalletClick">
                <img src="../../res/image/u250.png" w-class="ga-img"/>
                <span w-class="ga-text">创建钱包</span>
            </div>
            <div w-class="ga-import-wallet">
                <img src="../../res/image/u250.png" w-class="ga-img"/>
                <span w-class="ga-text">导入钱包</span>
            </div>
        </div>
    </div>
</div>