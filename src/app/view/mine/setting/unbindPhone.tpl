<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    {{: topBarTitle = {"zh_Hans":"绑定手机号","zh_Hant":"綁定手機號","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},textStyle:"margin-right:25px;color:rgba(136,136,136,1);font-size:28px;" }</app-components-topBar-topBar>
    <div w-class="body">
        {{: desc = {"zh_Hans":"我的手机号","zh_Hant":"我的手機號","en":""} }}
        <div w-class="desc"><pi-ui-lang>{{desc}}</pi-ui-lang></div>
        <div w-class="box"><span w-class="num">+{{it.areaCode}}</span><span w-class="phone">{{it.phoneNumber}}</span></div>
        {{: unbind = {"zh_Hans":"解除绑定手机号","zh_Hant":"解除綁定手機號","en":""} }}
        <div w-class="unbind" on-tap="unbindClick"><pi-ui-lang>{{unbind}}</pi-ui-lang></div>
    </div>
</div>