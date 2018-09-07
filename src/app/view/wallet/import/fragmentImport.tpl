<div class="new-page" w-class="new-page">
    <app-view-wallet-components-tipsCard>{title:"输入好友保管的片段",content:"请输入两个您分享给好友的助记词片段，导入后建议销毁本地记录，以免被盗取。"}</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div>
        <div w-class="input-father" ev-input-change="fragment1Change">
            <app-components-input-input>{input:{{it1.fragment1}},placeHolder:"输入片段一",style:"padding-right:76px;"}</app-components-input-input>
            <img src="../../../res/image/scan.png" w-class="scan" on-tap="doScanQRCode(e,{{1}})"/>
        </div>
        <div w-class="input-father" ev-input-change="fragment2Change">
            <app-components-input-input>{input:{{it1.fragment2}},placeHolder:"输入片段二",style:"padding-right:76px;"}</app-components-input-input>
            <img src="../../../res/image/scan.png" w-class="scan" on-tap="doScanQRCode(e,{{2}})"/>
        </div>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components-btn-btn>{"name":"下一步","types":"big","color":"blue"}</app-components-btn-btn></div>
    </div>
</div>