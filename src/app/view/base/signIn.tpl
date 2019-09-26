<div w-class="new-page">
    <div w-class="title">
        <img src="../../res/image/user.png" style="width: 50px;height:50px;"/>
        <span>登录好嗨</span>
    </div>
    <div w-class="phoneInput">
        <input type="number" w-class="pi_input_inner"/>
    </div>
    <div w-class="codeBox">
        <div w-class="codeInput">
            <input type="number" w-class="pi_input_inner"/>
        </div>
        {{if it.countdown>0}}
            <div w-class="time">{{it.countdown}}s 重新获取</div>
        {{else}}
            <div w-class="time" on-tap="getCode">获取验证码</div>
        {{end}}
    </div>
    <div w-class="btn" on-tap="login">登录</div>

    <div w-class="verify">验证码有误</div>
</div>