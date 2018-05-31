<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"修改密码"}</app-components-topBar-topBar>
    <div w-class="ga-content">
        <div w-class="ga-input-father" ev-input-change="inputChange"><app-components-input-input>{itype:"password",placeHolder:"当前密码",style:{{it1.style}}}</app-components-input-input></div>
        <div w-class="ga-desc"><span>钱包不存储用户密码，如果忘记密码请导入助记词或私钥重设密码</span><span w-class="ga-import-wallet" on-tap="importWalletClick">导入钱包</span></div>
    </div>
    <div w-class="ga-btn" on-tap="btnClick">确定</div>
</div>