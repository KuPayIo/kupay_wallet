<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="inputItem" ev-input-change="oldPswChange">
            <app-components1-input-input>{placeHolder:{{it1.cfgData.itemTitle[0]}},itype:"password",clearable:true,autofocus:true }</app-components1-input-input>
        </div>
        <div style="margin: 0 10px;" ev-psw-change="newPswChange">
            <app-components-password-password>{placeHolder:{{it1.cfgData.itemTitle[1]}},hideTips:true }</app-components-password-password>
        </div>
        <div w-class="inputItem" ev-input-change="rePswChange">
            <app-components-input-suffixInput>{itype:"password",placeHolder:{{it1.cfgData.itemTitle[2]}},clearable:true,available:{{it1.pswEqualed}} }</app-components-input-suffixInput>
        </div>
        
    </div>
    
    <div style="width: 100%;position: absolute;bottom: 60px;" ev-btn-tap="btnClicked">
        <app-components1-btn-btn>{name:{{it1.cfgData.btnName}},color:"blue",style:"margin:0 60px;"}</app-components1-btn-btn>
    </div>
</div>