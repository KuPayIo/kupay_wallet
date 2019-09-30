<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"修改密码","zh_Hant":"修改密碼","en":""} }}	
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="content">
        {{: itemTitle = [{"zh_Hans":"原密码","zh_Hant":"原密碼","en":""},
        {"zh_Hans":"新密码","zh_Hant":"新密碼","en":""},
        {"zh_Hans":"重复新密码","zh_Hant":"重複新密碼","en":""}] }}	
        <div w-class="inputItem" ev-input-clear="pswClear(0)" ev-input-change="oldPswChange">
            <app-components1-input-input>{showClearType:true,placeHolder:{{itemTitle[0]}},itype:"password",clearable:true,autofocus:true }</app-components1-input-input>
        </div>
        <div style="margin: 0 10px;" ev-psw-clear="pswClear(1)" ev-psw-change="newPswChange">
            <app-components-password-password>{placeHolder:{{itemTitle[1]}},hideTips:true }</app-components-password-password>
        </div>
        <div w-class="inputItem" ev-input-clear="pswClear(2)" ev-input-change="rePswChange">
            <app-components-input-suffixInput>{isShow:true,itype:"password",placeHolder:{{itemTitle[2]}},clearable:true,available:{{it.pswEqualed}} }</app-components-input-suffixInput>
        </div>
        
    </div>
    
    <div style="width: 100%;position: absolute;bottom: 60px;" ev-btn-tap="btnClicked">
        {{: btnName = {"zh_Hans":"保存修改","zh_Hant":"保存修改","en":""} }}	
        <app-components1-btn-btn>{name:{{btnName}},color:"blue",style:"margin:0 60px;"}</app-components1-btn-btn>
    </div>
</div>