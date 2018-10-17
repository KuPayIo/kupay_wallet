<div class="new-page" w-class="new-page" >
    <div w-class="logo"></div>
    <div ev-back-click="backPrePage" w-class="title-container"><app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},"background":"rgba(0,0,0,0)" }</app-components1-topBar-topBar></div>
    {{if !it1.login}}
    <div w-class="body1">
        <div ev-btn-tap="createStandardClick"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName[0]}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        <div ev-btn-tap="createByImgClick"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName[1]}},"types":"big","color":"white"}</app-components1-btn-btn></div>
        <div w-class="container1">
            <div w-class="box" on-tap="switch2LoginClick"  style="{{ it1.walletList.length > 0 ? '' : 'width:0px;overflow: hidden;'}} ">
                <img src="../../../res/image/avatar1.png" w-class="img-logo"/>
                <div w-class="tag" >{{it1.cfgData.login}}</div>
            </div>
            <div w-class="box" on-tap="walletImportClicke">
                <img src="../../../res/image/right_arrow2_blue.png" w-class="img-logo"/>
                <div w-class="tag" >{{it1.cfgData.hasWallet}}</div>
            </div>
        </div>
    </div>
    {{else}}
    <div w-class="body2">
        <div w-class="users">
            <img src="../../../res/image1/default_avatar.png" w-class="avatar"/>
            <div w-class="name">{{it1.accountList[0].nickName}}</div>
            <img src="../../../res/image/40.png" w-class="more" />
        </div>
        <div w-class="input-father" ev-input-change="pswChange">
            <app-components-input-input>{placeHolder:"输入密码",itype:"password"}</app-components-input-input>
        </div>
        <div ev-btn-tap="loginClick"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName[2]}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        <div w-class="container2">
            <div w-class="box" on-tap="switch2CreateClick">
                <img src="../../../res/image/avatar1.png" w-class="img-logo"/>
                <div w-class="tag" >{{it1.cfgData.create}}</div>
            </div>
            <div w-class="box" on-tap="walletImportClicke">
                <img src="../../../res/image/right_arrow2_blue.png" w-class="img-logo"/>
                <div w-class="tag" >{{it1.cfgData.hasWallet}}</div>
            </div>
        </div>
    </div>
    {{end}}
</div>