<div w-class="ga-psw-screen">
    <div w-class="ga-title">{{it.title}}</div>
    <div w-class="ga-dots-container">
        {{for index,value of it1.defaultArr}}
            <span w-class="{{it1.pswArr[index] >= 0 ? 'ga-dot ga-dot-active' : 'ga-dot'}}"></span>
        {{end}}
    </div>
    <div w-class="ga-forgetpsw" on-tap="forgetPswClick">{{it.forgetPsw ? '忘记密码?' : ''}}</div>
    <div w-class="ga-password-board">
        {{for index,value of it1.pswBoard}}
            <span w-class="ga-psw-board-item" on-down="boardItemClick(e,{{index}})">{{value}}</span>
        {{end}}
        <span w-class="ga-clear" on-tap="clearClick">x</span>
    </div>
</div>