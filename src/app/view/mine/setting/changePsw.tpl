<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"修改密码"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="inputItem" ev-input-change="oldPswChange">
            <app-components1-input-input>{placeHolder:"原密码"}</app-components1-input-input>
        </div>
        <div style="margin: 0 10px;" ev-psw-change="newPswChange">
            <app-components-password-password>{placeHolder:"新密码"}</app-components-password-password>
        </div>
        <div w-class="inputItem" ev-input-change="rePswChange">
            <app-components1-input-input>{placeHolder:"重复新密码",clearable:true}</app-components1-input-input>
        </div>
        
    </div>
    
    <div style="width: 100%;position: absolute;bottom: 60px;">
        <app-components-btn-btn>{name:"保存修改",color:"blue",style:"margin:0 60px;"}</app-components-btn-btn>
    </div>
</div>