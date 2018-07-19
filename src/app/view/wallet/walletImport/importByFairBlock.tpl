<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page" id="importFairBlock">
    <app-components-topBar-topBar>{title:"导入FairBlock"}</app-components-topBar-topBar>
    <div w-class="topTip">
        Fairblock是一个开源项目，不储存用户密码，如果您忘了密码，我们将无法帮助你重置。请不要丢失或忘记。
    </div>
    <div w-class="ga-import-container">
        <div w-class="ga-topTips">
            将您分享给好友的片段内容粘贴至输入框中
        </div>
        <div ev-input-change="walletPart1Change">
            <div w-class="ga-textarea-father" id="area1">
                <app-components-input-input>{placeHolder:"请在这里输入片段",itype:"textarea",rows:3,style:{{it1.textAreaStyle1}}}</app-components-input-input>
            </div>
        </div>
        <div ev-input-change="walletPart2Change">
                <div w-class="ga-textarea-father" style="margin-bottom: 20px" id="area2">
                    <app-components-input-input>{placeHolder:"这里也输入片段",itype:"textarea",rows:3,style:{{it1.textAreaStyle2}}}</app-components-input-input>
                </div>
        </div>
        <div w-class="ga-import-item" ev-input-change="walletPswChange">
            <div w-class="ga-import-item-label">密码，不少于8位字符，可包含英文、数字、特殊字符</div>
            <div w-class="ga-input-father">
                <app-components-input-input>{itype:"password",placeHolder:"设置密码"}</app-components-input-input>
                <span w-class="ga-password-strength" style="color:{{it1.curWalletPswStrength.color}};">
                    <span w-class="ga-password-strength-label">安全强度:</span>
                    <span w-class="ga-password-strength-text">{{it1.curWalletPswStrength.text}}</span>
                </span>
            </div>
        </div>
        <div w-class="ga-psw-tip-hidden  {{it1.walletPsw.length>0 ? 'ga-psw-tip-show' : ''}}">不少于8位字符，可包含英文、数字、特殊字符</div>
        <div w-class="ga-import-item" ev-input-change="walletPswConfirmChange">
            <div w-class="ga-import-item-label">再次输入密码</div>
            <div w-class="ga-input-father">
                <app-components-input-input>{itype:"password",placeHolder:"再次输入密码"}</app-components-input-input>
            </div>
        </div>
        <div w-class="ga-import-item" ev-input-change="walletPswTipsChange">
            <div w-class="ga-import-item-label">提示信息（可不填）</div>
            <div w-class="ga-input-father">
                <app-components-input-input>{placeHolder:"提示信息（可不填）"}</app-components-input-input>
            </div>
        </div>
        <div w-class="ga-import-protocol" ev-checkbox-click="checkBoxClick">
            <app-components-checkbox-checkbox>{itype:"false",text:"我已经认证阅读并同意"}</app-components-checkbox-checkbox>
            <span w-class="ga-user-protocol" on-tap="agreementClick">隐私条约</span>
        </div>
        <div w-class="ga-import-btn" on-tap="importWalletClick" style="backgroundColor:{{it1.userProtocolReaded ? '#1A70DD' : 'white'}}; color : {{it1.userProtocolReaded ? '#FFFFFF' : '#1A70DD'}};">导入</div>
    </div>
</div>