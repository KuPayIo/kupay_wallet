<div class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"兑换中心","zh_Hant":"兌換中心","en":""} }}	
    <app-components1-topBar-topBar>{"title":{{topBarTitle}},nextImg:"../../res/image/detailBlueIcon.png"}</app-components1-topBar-topBar>
    <div w-class="inputBox" ev-input-change="inputChange">
        {{: inputPlaceholder = {"zh_Hans":"输入兑换码或邀请码","zh_Hant":"輸入兌換碼或邀請碼","en":""} }}
        <app-components1-input-input>{placeHolder:{{inputPlaceholder}},style:"border-radius:12px;text-align:center;color:#318DE6;font-size:36px;",input:{{it.cid}},notUnderLine:true }</app-components1-input-input>
    </div>
    <div w-class="btn" ev-btn-tap="convertClick">
        {{: btnName = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}
        {{: exchangTip ={"zh_Hans":"未兑换的红包，将于24小时后退回原账户","zh_Hant":"未兌換的紅包，將於24小時後退回原賬戶","en":""} }}
        <app-components1-btn-btn>{name:{{btnName}},color:"blue",style:"margin:10px 0px 30px;"}</app-components1-btn-btn>
        <widget w-class="exchangeTip" w-tag="pi-ui-lang">{{exchangTip}}</widget>
    </div>
</div>