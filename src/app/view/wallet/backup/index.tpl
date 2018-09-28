<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        <app-view-wallet-components-tipsCard>{contentStyle:"color:#ef3838;",title:{{it1.cfgData.title}},content:{{it1.cfgData.content}} }</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            <div w-class="mnemonic-container">
               {{it.mnemonic}}
            </div>
            <div w-class="btn-container">
                <div ev-btn-tap="standardBackupClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnNames[0]}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
                <div ev-btn-tap="fragmentsBackupClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnNames[1]}},"types":"big","color":"white"}</app-components1-btn-btn></div>
            </div>
        </div>
    </div>
</div>