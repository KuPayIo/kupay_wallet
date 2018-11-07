<div class="new-page" w-class="new-page" >

    <img src="../../../res/image/login_bg.png" w-class="logo"/>
    <div ev-back-click="backPrePage" w-class="title-container">
        {{: topBarTitle = {"zh_Hans":"登陆","zh_Hant":"登錄","en":""} }}
        <app-components1-topBar-topBar>{"title":{{topBarTitle}},"background":"rgba(0,0,0,0)" }</app-components1-topBar-topBar>
    </div>

    {{if !it1.login}}
    <div w-class="body1">
        <div ev-btn-tap="createStandardClick">
            {{: btnName = [
                {"zh_Hans":"创建标准账户","zh_Hant":"創建標準賬戶","en":""},
                {"zh_Hans":"使用照片创建账户","zh_Hant":"使用照片創建賬戶","en":""},
                {"zh_Hans":"登陆","zh_Hant":"登錄","en":""}] }}
            <app-components1-btn-btn>{"name":{{btnName[0]}},"types":"big","color":"blue"}</app-components1-btn-btn>
        </div>
        <div ev-btn-tap="createByImgClick">
            <app-components1-btn-btn>{"name":{{btnName[1]}},"types":"big","color":"white"}</app-components1-btn-btn>
        </div>
        <div w-class="container1">
            <div w-class="box" on-tap="switch2LoginClick"  style="{{ it1.accountList.length > 0 ? '' : 'width:0px;overflow: hidden;'}} ">
                <img src="../../../res/image/avatar1.png" w-class="img-logo"/>
                <div w-class="tag" ><pi-ui-lang>{"zh_Hans":"登陆账户","zh_Hant":"登錄賬戶","en":""}</pi-ui-lang></div>
            </div>
            <div w-class="box" on-tap="walletImportClicke">
                <img src="../../../res/image/right_arrow2_blue.png" w-class="img-logo"/>
                <div w-class="tag" ><pi-ui-lang>{"zh_Hans":"已有账户","zh_Hant":"已有賬戶","en":""}</pi-ui-lang></div>
            </div>
        </div>
    </div>
    {{else}}
    <div w-class="body2">
        <div w-class="users">
            <div w-class="user-item" on-tap="popMoreUser">
                <img src="../../../res/image1/default_avatar.png" w-class="avatar"/>
                <div w-class="name">{{it1.accountList[it1.selectedAccountIndex].nickName}}</div>
                <img src="../../../res/image/40.png" w-class="more" />
            </div>
            <div w-class="pop-box" style="height:{{it1.showMoreUser ? it1.popHeight : 0}}px; ">
                {{for index,item of it1.accountList}}
                <div w-class="user-item2" on-tap="chooseCurUser(e,{{index}})">
                    <img src="../../../res/image1/default_avatar.png" w-class="avatar"/>
                    <div w-class="name">{{item.nickName}}</div>
                    <img src="../../../res/image/30_gray.png" w-class="del" on-tap="delUserAccount(e,{{index}})"/>
                </div>
                {{end}}
            </div>
        </div>
        <div w-class="input-father" ev-input-change="pswChange">
            {{: inputHolder = {"zh_Hans":"输入密码","zh_Hant":"輸入密碼","en":""} }}
            <app-components1-input-input>{placeHolder:{{inputHolder}},itype:"password"}</app-components1-input-input>
        </div>
        <div ev-btn-tap="loginClick"><app-components1-btn-btn>{"name":{{btnName[2]}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        <div w-class="container2">
            <div w-class="box" on-tap="switch2CreateClick">
                <img src="../../../res/image/avatar1.png" w-class="img-logo"/>
                <div w-class="tag" ><pi-ui-lang>{"zh_Hans":"创建新账户","zh_Hant":"創建新賬戶","en":""}</pi-ui-lang></div>
            </div>
            <div w-class="box" on-tap="walletImportClicke">
                <img src="../../../res/image/right_arrow2_blue.png" w-class="img-logo"/>
                <div w-class="tag" ><pi-ui-lang>{"zh_Hans":"已有账户","zh_Hant":"已有賬戶","en":""}</pi-ui-lang></div>
            </div>
        </div>
    </div>
    {{end}}
</div>