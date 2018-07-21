<div class="ga-new-page" w-class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"修改交易密码"}</app-components-topBar-topBar>
    <div w-class="ga-content">
        <div w-class="ga-input-father" ev-input-change="newPasswordChange">
            <app-components-input-input>{itype:"password",placeHolder:"新密码",style:{{it1.style}}}</app-components-input-input>
            <span w-class="strength">
                安全强度 &nbsp;<span style="color: {{it1.strength.color}}">{{it1.strength.text}}</span>
            </span>
        </div>
        <div w-class="ga-psw-tip-hidden  {{it1.newPassword.length>0 ? 'ga-psw-tip-show' : ''}}" style="color: rgba(234,142,65,1);">至少8位字符，可包含英文、数字、特殊字符</div>
        <div w-class="ga-input-father" ev-input-change="rePasswordChange">
            <app-components-input-input>{itype:"password",placeHolder:"再次输入密码",style:{{it1.style}}}</app-components-input-input>
        </div>
        <div w-class="ga-input-father passWordTips">
            <span>
                密码是我生日
            </span>
            <span w-class="rightTip">
                密码提示
            </span>
        </div>
        <div w-class="blueBtn" on-tap="btnClicked">
            确认修改
        </div>
    </div>
</div>