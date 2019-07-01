<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"助记词登录","zh_Hant":"助記詞登錄","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: createTips = {"zh_Hans":"按序输入助记词","zh_Hant":"按序輸入助記詞","en":""} }}
        <div w-class="create-tips"><div w-class="tip-divid"></div><pi-ui-lang>{{createTips}}</pi-ui-lang></div>
        {{: desc = {"zh_Hans":"请输入您创建账号时备份的12个英文单词，助记词登录能导入云端和本地所有资产","zh_Hant":"請輸入您創建賬號時備份的12個英文單詞，助記詞登錄能導入雲端和本地所有資產","en":""} }}
        <div w-class="desc"><pi-ui-lang>{{desc}}</pi-ui-lang></div>
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
                {{: btnName = {"zh_Hans":"继续","zh_Hant":"繼續","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
            </div>
        </div>
    </div>
</div>