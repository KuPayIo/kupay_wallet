<div class="ga-new-page" ev-back-click="backPrePage">
        <app-components-topBar-topBar>{title:"备份助记词"}</app-components-topBar-topBar>
        <div w-class="ga-backup-mnemonic-container">
            <p w-class="ga-mnemonic-title">确认你的助记词</p>
            <p w-class="ga-mnemonic-desc">In hac habitasse platea dictumst. Vivamus fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam vel iaculis mauris. Sed ullamcorper tellus erat, ultrices sem tincidunt euismod. </p>
            <div w-class="ga-mnemonic-confirm">
                {{for index,item of it1.confirmedMnemonic}}
                <span w-class="ga-mnemonic-confirmed-item" on-tap="confirmedMnemonicItemClick(e,{{index}})">{{item.word}}</span>
                {{end}}
            </div>
            <div w-class="ga-mnemonic-shuffled">
                {{for index,item of it1.shuffledMnemonic}}
                <span w-class="ga-mnemonic-shuffled-item {{item.isActive ? 'ga-mnemonic-shuffled-item-active' : ''}}" on-tap="shuffledMnemonicItemClick(e,{{index}})">{{item.word}}</span>
                {{end}}
            </div>
            <div w-class="ga-mnemonic-next-step-btn" on-tap="nextStepClick">下一步</div>
        </div>
    </div>