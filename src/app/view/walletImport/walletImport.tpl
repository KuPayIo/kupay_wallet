<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"导入钱包"}</app-components-topBar-topBar>
    <div w-class="ga-import-container">
        <div w-class="ga-import-item" ev-input-change="walletMnemonicChange">
            <div w-class="ga-import-item-label">输入你的助记词</div>
            <pi-components-input-input>{placeHolder:"空格键分隔"}</pi-components-input-input>
        </div>
        <div w-class="ga-import-item" ev-input-change="walletNameChange">
            <div w-class="ga-import-item-label">钱包名称</div>
            <pi-components-input-input>{}</pi-components-input-input>
        </div>
        <div w-class="ga-import-item" ev-input-change="walletPswChange">
            <div w-class="ga-import-item-label">密码，不少于8位字符，可包含英文、数字、特殊字符</div>
            <pi-components-input-input>{}</pi-components-input-input>
            <span w-class="ga-password-strength" style="color:{{it1.curWalletPswStrength.color}};">{{it1.curWalletPswStrength.text}}</span>
        </div>
        <div w-class="ga-import-item" ev-input-change="walletPswConfirmChange">
            <div w-class="ga-import-item-label">再次输入密码</div>
            <pi-components-input-input>{}</pi-components-input-input>
        </div>
        <div w-class="ga-import-item" ev-input-change="walletPswTipsChange">
            <div w-class="ga-import-item-label">密码提示（可不填）</div>
            <pi-components-input-input>{}</pi-components-input-input>
        </div>
        <div w-class="ga-import-protocol" ev-checkbox-click="checkBoxClick">
            <pi-components-checkbox-checkbox>{type:"false",text:"我已经认证阅读并同意"}</pi-components-checkbox-checkbox>
            <span w-class="ga-user-protocol" on-click="agreementClick">用户协议</span>
        </div>
        <div w-class="ga-import-btn" on-click="importWalletClick">开始导入</div>
        <div w-class="ga-whatis-mnemonic-btn">什么是助记词</div>
    </div>
</div>