<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"修改密码"}</app-components-topBar-topBar>
    <div w-class="ga-content">
        <div w-class="ga-input-father" ev-input-change="inputChange"><app-components-input-input>{type:"password",placeHolder:"设置新密码",style:{{it1.style}}}</app-components-input-input></div>
        <div w-class="ga-desc"><span>密码不少于8位字符，可包含英文、数字、特殊字符</span></div>
    </div>
    <div w-class="ga-btn" on-tap="btnClick">确定</div>
</div>