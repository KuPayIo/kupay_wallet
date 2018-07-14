<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"备份钱包"}</app-components-topBar-topBar>
    <div w-class="ga-backup-mnemonic-container">
        <p w-class="ga-mnemonic-title">抄写你的助记词</p>
        <p w-class="ga-mnemonic-desc">请将下面的助记词抄写在一张纸上，保存在安全的地方，如果丢失，将无法恢复您的钱包。助记词非常重要，不要丢失或泄露，否则您您的资产将受到损失。</p>
        <div w-class="ga-mnemonic">
            {{for index,value of it1.mnemonic}}
            <span w-class="ga-mnemonic-item">{{value}}</span>
            {{end}}
        </div>
        <div w-class="ga-mnemonic-next-step-btn" on-tap="nextStepClick">下一步</div>
        <div w-class="ga-mnemonic-next-step-btn" on-tap="doShare">分享备份助记词</div>
    </div>
</div>