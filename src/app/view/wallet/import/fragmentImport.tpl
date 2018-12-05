<div class="new-page" w-class="new-page">
    {{: tipsCardTitle = {"zh_Hans":"输入好友保管的片段","zh_Hant":"輸入好友保管的片段","en":""} }}
    {{: tipsCardContent = {"zh_Hans":"请输入两个您分享给好友的助记词片段，导入后建议销毁本地记录，以免被盗取。","zh_Hant":"請輸入兩個您分享給好友的助記詞片段，導入後建議銷毀本地記錄，以免被盜取。","en":""} }}
    <app-view-wallet-components-tipsCard>{title:{{tipsCardTitle}},content:{{tipsCardContent}} }</app-view-wallet-components-tipsCard>
    <div w-class="bottom-box">
        <div>
        <div w-class="input-father" ev-input-change="fragment1Change">
            {{: inputPlace = [{"zh_Hans":"输入片段一","zh_Hant":"輸入片段一","en":""},{"zh_Hans":"输入片段二","zh_Hant":"輸入片段二","en":""}] }}
            <app-components1-input-input>{input:{{it.fragment1}},placeHolder:{{inputPlace[0]}},style:"padding-right:76px;",notUnderLine:true}</app-components1-input-input>
            <img src="../../../res/image/scan.png" w-class="scan" on-tap="doScanQRCode(e,{{1}})"/>
        </div>
        <div w-class="input-father" ev-input-change="fragment2Change">
            <app-components1-input-input>{input:{{it.fragment2}},placeHolder:{{inputPlace[1]}},style:"padding-right:76px;",notUnderLine:true}</app-components1-input-input>
            <img src="../../../res/image/scan.png" w-class="scan" on-tap="doScanQRCode(e,{{2}})"/>
        </div>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn">
            {{: btnName = {"zh_Hans":"下一步","zh_Hant":"下一步","en":""} }}
            <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
        </div>
    </div>
</div>