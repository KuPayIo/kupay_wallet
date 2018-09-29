<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        <img src="../../../res/image/addMine_create.png" w-class="create-logo"/>
        <div ev-btn-tap="createStandardClick"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName[0]}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        <div ev-btn-tap="createByImgClick"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName[1]}},"types":"big","color":"white"}</app-components1-btn-btn></div>
        <div w-class="import" on-tap="walletImportClicke">{{it1.cfgData.hasWallet}}</div>
    </div>
</div>