<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"新建钱包"}</app-components-topBar-topBar>
    <div w-class="body">
       <img src="../../../res/image/security.png" w-class="imgsecur" />
       <p w-class="tips">选择创建或导入一个钱包</p>
       <div w-class="btnBlue btn" on-tap="toCreateWallet">
       	创建新钱包
       </div>
       <div w-class="btnWhite btn2" on-tap="toCreateByImg">
       	用照片生成/导入钱包
       </div>
       <div w-class="btnWhite btn3" on-tap="importByImtokenClicked">
       	导入imtoken钱包
       </div>
       <div w-class="botTips">
       	<span w-class="botItem" style="border-right: 1px solid rgba(160,172,192,1);" on-tap="walletImportClicked">已有助记词</span>
       	<span w-class="botItem" on-tap="importByFairblockClicked">已有Fairblock</span>  
       </div>
    </div>
</div>