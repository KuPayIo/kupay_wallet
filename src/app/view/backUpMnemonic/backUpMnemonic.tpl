<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"备份助记词"}</app-components-topBar-topBar>
    <div w-class="ga-back-up-mnemonic-container">
        <p w-class="ga-mnemonic-title">抄写你的助记词</p>
        <p w-class="ga-mnemonic-desc">In hac habitasse platea dictumst. Vivamus fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam vel iaculis mauris. Sed ullamcorper tellus erat, ultrices sem tincidunt euismod. </p>
        <div w-class="ga-mnemonic">
            {{for index,value of it1.mnemonic}}
            <span w-class="ga-mnemonic-item">{{value}}</span>
            {{end}}
        </div>
        <div w-class="ga-mnemonic-next-step-btn" on-tap="nextStepClick">下一步</div>
    </div>
</div>