<div class="new-page" w-class="new-page" on-tap="closePopBox">
    <img src="../../res/image/login_logo.png" w-class="logo"/>
    <div w-class="body2">
        <div w-class="users">
            <div w-class="user-item" on-tap="popMoreUser">
                <img src="{{it.accountList[it.selectedAccountIndex].avatar}}" w-class="avatar"/>
                <div w-class="name">{{it.accountList[it.selectedAccountIndex].nickName}}</div>
                <img src="../../res/image/40.png" w-class="more" />
            </div>
            <div w-class="pop-box {{it.noAnimate ? 'pop-box-no-animate' : ''}}" style="height:{{it.showMoreUser ? it.popHeight : 0}}px; {{it.forceCloseMoreUser ? 'display:none;' : ''}} ">
                {{for index,item of it.accountList}}
                <div w-class="user-item2" on-tap="chooseCurUser(e,{{index}})">
                    <widget w-tag="app-components1-img-img" w-class="rank-headImg" >{imgURL:{{item.avatar}},width:"60px;"}</widget>
                    <div w-class="name">{{item.nickName}}</div>
                    <img src="../../res/image/30_gray.png" w-class="del" on-tap="delUserAccount(e,{{index}})"/>
                </div>
                {{end}}
            </div>
        </div>
        <div w-class="input-father" ev-input-change="pswChange">
            {{: inputHolder = {"zh_Hans":"输入密码","zh_Hant":"輸入密碼","en":""} }}
            <app-components1-input-input>{input:{{it.psw}},placeHolder:{{inputHolder}},itype:"password"}</app-components1-input-input>
        </div>
        {{: let loginName = {"zh_Hans":"登录","zh_Hant":"登錄","en":""} }}
        <div ev-btn-tap="loginClick" w-class="btn-father"><app-components1-btn-btn>{"name":{{ loginName }},"types":"big","color":"blue"}</app-components1-btn-btn></div>
       
    </div>
    <div w-class="bottom" >
        <div w-class="bottom-item"  on-tap="phoneLoginClick">
            <img src="../../res/image/phone_login.png"/>
            <pi-ui-lang w-class="item-text">{"zh_Hans":"手机登录","zh_Hant":"手機登錄","en":""}</pi-ui-lang>
        </div>
        <div w-class="bottom-item" on-tap="touristLoginClick">
            <img src="../../res/image/tourlist_login.png"/>
            <pi-ui-lang w-class="item-text">{"zh_Hans":"游客登录","zh_Hant":"遊客登錄","en":""}</pi-ui-lang>
        </div>
        <div w-class="bottom-item" on-tap="registerLoginClick">
            <img src="../../res/image/random_login.png"/>
            <pi-ui-lang w-class="item-text">{"zh_Hans":"区块链账号注册","zh_Hant":"區塊鏈賬號註冊","en":""}</pi-ui-lang>
        </div>
        <div w-class="bottom-item" on-tap="haveAccountClick">
            <img src="../../res/image/standard_import_login.png"/>
            <pi-ui-lang w-class="item-text">{"zh_Hans":"区块链账号登录","zh_Hant":"區塊鏈賬號登錄","en":""}</pi-ui-lang>
        </div>
    </div>
</div>