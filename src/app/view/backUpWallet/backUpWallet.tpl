<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"备份钱包"}</app-components-topBar-topBar>
    <div w-class="ga-back-up-container">
        <img src="../../res/image/u507.png" w-class="ga-back-up-img"/>
        <span w-class="ga-label-1">立即备份钱包</span>
        <p w-class="ga-label-2">导出助记词，将助记词抄写到安全的地方，千万不要保存于网络，然后可尝试转账收款等小额交易。</p>
        <div w-class="ga-wallet-back-up-btn" on-tap="backUpWalletClick">备份助记词</div>
        <div w-class="ga-how-to-back-up-btn">如何备份助记词</div>
    </div>
</div>