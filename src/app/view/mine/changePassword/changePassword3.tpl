<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"修改密码"}</app-components-topBar-topBar>
    <div w-class="ga-content">
        <div w-class="ga-input-father" ev-input-change="inputChange"><app-components-input-input>{itype:"password",placeHolder:"重复新密码",style:{{it1.style}}}</app-components-input-input></div>
    </div>
    <div w-class="ga-btn" on-tap="btnClick">确定</div>
</div>