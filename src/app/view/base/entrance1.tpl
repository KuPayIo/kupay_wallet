<div class="new-page" w-class="new-page" >
    <img src="../../res/image/img_logo.png" w-class="logo"/>
    <div w-class="slogan">能赚钱的游戏平台</div>
    
    <div w-class="body2">
        <div w-class="users">
            <div w-class="user-item" on-tap="popMoreUser">
                <img src="{{it.accountList[it.selectedAccountIndex].avatar}}" w-class="avatar"/>
                <div w-class="name">{{it.accountList[it.selectedAccountIndex].nickName}}</div>
                <img src="../../res/image/40.png" w-class="more" />
            </div>
            <div w-class="pop-box" style="height:{{it.showMoreUser ? it.popHeight : 0}}px; {{it.forceCloseMoreUser ? 'display:none;' : ''}} ">
                {{for index,item of it.accountList}}
                <div w-class="user-item2" on-tap="chooseCurUser(e,{{index}})">
                    <img src="{{item.avatar}}" w-class="avatar"/>
                    <div w-class="name">{{item.nickName}}</div>
                    <img src="../../res/image/30_gray.png" w-class="del" on-tap="delUserAccount(e,{{index}})"/>
                </div>
                {{end}}
            </div>
        </div>
        <div w-class="input-father" ev-input-change="pswChange">
            {{: inputHolder = {"zh_Hans":"输入密码","zh_Hant":"輸入密碼","en":""} }}
            <app-components1-input-input>{placeHolder:{{inputHolder}},itype:"password"}</app-components1-input-input>
        </div>
        {{: let loginName = {"zh_Hans":"登录","zh_Hant":"登錄","en":""} }}
        <div ev-btn-tap="loginClick" w-class="btn-father"><app-components1-btn-btn>{"name":{{ loginName }},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        <div w-class="register-btn" on-tap="registerNewClick">
            <pi-ui-lang>{"zh_Hans":"注册新账号","zh_Hant":"註冊新賬號","en":""}</pi-ui-lang>
        </div>
    </div>
</div>