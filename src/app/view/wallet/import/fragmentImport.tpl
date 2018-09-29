<div class="new-page" w-class="new-page">
    <app-view-wallet-components-tipsCard>{{it1.cfgData.tipsCard}}</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div>
        <div w-class="input-father" ev-input-change="fragment1Change">
            <app-components-input-input>{input:{{it1.fragment1}},placeHolder:{{it1.cfgData.inputPlace[0]}},style:"padding-right:76px;"}</app-components-input-input>
            <img src="../../../res/image/scan.png" w-class="scan" on-tap="doScanQRCode(e,{{1}})"/>
        </div>
        <div w-class="input-father" ev-input-change="fragment2Change">
            <app-components-input-input>{input:{{it1.fragment2}},placeHolder:{{it1.cfgData.inputPlace[1]}},style:"padding-right:76px;"}</app-components-input-input>
            <img src="../../../res/image/scan.png" w-class="scan" on-tap="doScanQRCode(e,{{2}})"/>
        </div>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
    </div>
</div>