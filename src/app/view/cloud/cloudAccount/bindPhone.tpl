<div w-class="base" class="ga-new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{title:"验证手机"}</app-components-topBar-topBar>
    <div style="position: relative;top: 90px;">
        <div w-class="phone-input" ev-input-change="phoneChange">
            <app-components-input-input>{placeHolder:"请填入手机号",style:"padding-left: 100px;padding-right: 30px;"}</app-components-input-input>
        </div>
        <div w-class="old-code" on-tap="showNewCode">+{{it1.oldCode}}</div>
        <div w-class="code-input" ev-input-change="codeChange">
            <app-components-input-input>{placeHolder:"请填入验证码" style:"padding-left: 30px;padding-right: 180px;"}</app-components-input-input>
        </div>
        {{if it1.countdown>0}}
        <div w-class="text-code">{{it1.countdown}}秒</div>
        {{else}}
        <div w-class="text-code" on-tap="getCode">获取验证码</div>
        {{end}} {{if it1.isShowNewCode}}
        <div w-class="new-code-bg" on-tap="chooseNewCode"></div>
        <div w-class="new-code">+{{it1.newCode}}</div>
        {{end}}
        <div w-class="btn-code" on-tap="doSure">确认</div>
        <div w-class="tip">一个手机号只能验证一个钱包</div>
    </div>
</div>